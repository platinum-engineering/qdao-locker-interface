import Vue from 'vue';
import Vuex from 'vuex';
import locker from './modules/locker.js';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    locker,
  },
  strict: debug,
});
