import Vue from 'vue';
import team from '@/team-list.json';
import locker from '@/helpres/web3/locker';

const state = {
  holders: {},
  loading: false,
  locks: [],
  teamList: team,
  ethAddress: undefined,
  total: {
    locked: 0,
    withdrawable: 0,
  },
};

const getters = {
  getLocks: _state => [..._state.locks].reverse(),
  getActiveLocks: _state => [..._state.locks].reverse().filter(
    item => item && item.lock && !item.lock._finalize,
  ),
  getHolder: _state => (_address) => {
    const result = {
      total: {
        locked: 0,
        withdrawable: 0,
      },
      locks: [],
    };
    if (!_state.holders[_address] || !_state.holders[_address].length) {
      return result;
    }
    const holderList = _state.holders[_address];
    const locks = [];
    for (let i = 0; i < holderList.length; i += 1) {
      if (!_state.locks[holderList[i]]) {
        break;
      }
      const { lock } = _state.locks[holderList[i]];
      const res = locker.reduceLock(lock);
      const unpaid = locker.unpaidLocks(lock);
      if (unpaid.length) {
        result.total.withdrawable += parseInt(res.withdrawable, 10);
        result.total.locked += parseInt(res.locked, 10);
        locks.push({
          tokens: parseInt(res.locked, 10),
          withdrawable: parseInt(res.withdrawable, 10),
          id: holderList[i],
          nextUnlock: res.nextUnlock,
          unpaid,
          lock,
        });
      }
    }

    result.locks = locks.sort((a, b) => a.nextUnlock < b.nextUnlock);
    return result;
  },
  getTotal: _state => _state.total,
  getTeam: _state => _state.teamList,
  getEthAddress: _state => _state.ethAddress,
};

const actions = {
  updateLockList: async ({ commit }) => {
    commit('loading', true);

    const totalLocked = await locker.getTotalLocked();
    commit('totalLocked', totalLocked);

    const totalWithdrawable = await locker.getTotalWithdrawable();
    commit('totalWithdrawable', totalWithdrawable);

    const slots = await locker.getSlotsQuantity();
    if (!slots) {
      return [];
    }

    const getLock = async (_id) => {
      try {
        const lock = await locker.getLock(_id);
        const holder = await locker.getAddressToId(_id);
        return {
          id: _id,
          lock: {
            ...locker.reduceLock(lock),
            address: holder,
          },
        };
      } catch (e) {
        console.error(e);
        return false;
      }
    };

    for (let i = 0; i < slots; i += 1) {
      getLock(i).then((res) => {
        commit('loading', false);
        commit('addLock', { lock: res.lock, id: res.id });
      });
    }

    return true;
  },
  updateEthAddress: async ({ commit }) => {
    commit('loading', true);
    const address = await locker.getMetamaskAddress();
    commit('setEthAddress', address);

    const locksList = await locker.getLocksList(address);
    commit('setHolder', { address, list: locksList });
    commit('loading', false);
  },
  withdraw: async ({ commit, dispatch }, _id) => {
    commit('loading', true);
    try {
      locker.withdraw(_id).then(async () => {
        dispatch('updateLockList');
      });
    } catch (err) {
      console.err(err);
    }
  },
};

const mutations = {
  loading: (_state, _status) => {
    _state.loading = !!_status;
  },
  totalLocked: (_state, _locked) => {
    _state.total.locked = _locked;
  },
  totalWithdrawable: (_state, _withdrawable) => {
    _state.total.withdrawable = _withdrawable;
  },
  addLock: (_state, _params) => {
    Vue.set(_state.locks, _params.id, _params.lock);
  },
  setHolder: (_state, _params) => {
    Vue.set(_state.holders, _params.address, _params.list);
  },
  setEthAddress: (_state, _address) => {
    _state.ethAddress = _address;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
