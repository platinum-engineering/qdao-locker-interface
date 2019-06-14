import Web3 from 'web3';
import abi from '@/abi.json';

const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/94bb727e0864416dbbe6f9bc6efd188f'), null, {});
if (window.ethereum) {
  try {
    console.log('Here');
    window.ethereum.enable();
  } catch (error) {
    console.log('Error');
    console.log('Please allow access for the app to work');
  }
}

console.log(web3);
console.log(web3.eth.getBalance('0x71E0D074Bb70FDc5345F986E3435117F52aFcEbb'));

const address = '0x773e51d1C781D30dBC9c88cf94efE7a64bF229c5';

const contract = new web3.eth.Contract(abi, address);

console.log(contract);
console.log(contract.methods);
contract.methods.getLockSlot('0x98111289e72f43E528f9C0Fe879F56805B57efE5')
  .call((error, result) => {
    console.log('Calling');
    console.log(result);
    console.log(error);
  });
console.log('End');

/*
  if (window.ethereum) {
    console.log('tryMetamask');
    const instance = new Web3(window.ethereum);
    try {
      console.log('Here');
      window.ethereum.enable();
      return instance;
    } catch (error) {
      console.log('Error');
      console.log('Please allow access for the app to work');
    }
  } else if (window.web3) {
    console.log('Web3');
    return new Web3(window.web3.currentProvider);
  } else {
    console.log('Non eth');
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
  */

export default {
  nonEthereum: () => !window.ethereum,
  getMetamaskAddress: () => {
    if (window.ethereum) {
      const instance = new Web3(window.ethereum);
      try {
        window.ethereum.enable();
        return instance;
      } catch (error) {
        return false;
      }
    }
    return false;
  },
  getHoldersCount: (_cb) => {
    contract.methods.getHoldersQuantity()
      .call((error, result) => {
        if (result) {
          _cb(result);
          return;
        }
        console.error(error);
      });
  },
  getHoldersList: (_index, _cb) => {
    contract.methods.holdersList(_index)
      .call((error, result) => {
        if (result) {
          _cb(result);
          return;
        }
        console.error(error);
      });
  },
  getLockList: (_address, _cb) => {
    contract.methods.getAllLockSlotIdsToAddress(_address)
      .call((error, result) => {
        if (result) {
          _cb(result);
          return;
        }
        console.error(error);
      });
  },
  getLock: (_index, _cb) => {
    contract.methods.getLock(_index)
      .call((error, result) => {
        if (result) {
          _cb(result);
          return;
        }
        console.error(error);
      });
  },
  getLockSlotsLength: () => {},
  getLockSlots: (_cb, _from, _to) => _cb + _from + _to,
};
