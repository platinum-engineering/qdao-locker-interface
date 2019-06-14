import moment from 'moment';
import contractConnector from './contract.js';
import abi from '@/abi.json';

let contract = contractConnector.connect(abi, process.env.VUE_APP_LOCKER_CONTRACT_ADDRESS);

export default {
  nonEthereum: () => !window.ethereum,
  getMetamaskAddress: async () => {
    if (window.ethereum) {
      contract = contractConnector.changeProvider(window.ethereum, abi,
        process.env.VUE_APP_LOCKER_CONTRACT_ADDRESS);
      try {
        await window.ethereum.enable();
        return window.ethereum.selectedAddress;
      } catch (error) {
        console.error(error);
        return undefined;
      }
    }
    return null;
  },
  getHoldersQuantity: () => contract.methods.getHoldersQuantity().call(),
  getSlotsQuantity: () => contract.methods.getSlotsQuantity().call(),
  getHoldersList: _id => contract.methods.holdersList(_id).call(),
  getLocksList: _address => contract.methods.getAllLockSlotIdsToAddress(_address).call(),
  getLock: _id => contract.methods.getLock(_id).call(),
  getAddressToId: _id => contract.methods.getAddressToId(_id).call(),
  getTotalLocked: () => contract.methods.getTotalLockedTokens().call(),
  getTotalWithdrawable: () => contract.methods.withdrawableTokens().call(),
  withdraw: _id => contract.methods.release(_id).send({ from: window.ethereum.selectedAddress }),
  reduceLock: (_lock) => {
    const now = moment();
    const periods = _lock._periods;
    const tokens = _lock._tokens;

    let withdrawable = tokens[0] - parseInt(_lock._paidTokens, 10);
    let locked = tokens[0] - parseInt(_lock._paidTokens, 10);
    let nextUnlock = periods[0];

    for (let i = 1; i < periods.length; i += 1) {
      const current = moment.unix(periods[i]);
      locked += parseInt(tokens[i], 10);
      if (current.isBefore(now)) {
        withdrawable += parseInt(tokens[i], 10);

        if (current.isAfter(moment.unix(nextUnlock))) {
          nextUnlock = periods[i];
        }
      }
    }
    return {
      lock: _lock,
      total: _lock._amountTokens,
      locked,
      withdrawable,
      nextUnlock,
    };
  },
  unpaidLocks: (_lock) => {
    const res = [];
    let amount = parseInt(_lock._paidTokens, 10);
    let i = 0;
    while (amount >= _lock._tokens[i]) {
      amount -= _lock._tokens[i];
      i += 1;
    }
    for (; i < _lock._periods.length; i += 1) {
      res.push({
        date: _lock._periods[i],
        tokens: _lock._tokens[i],
      });
    }

    return res;
  },
};
