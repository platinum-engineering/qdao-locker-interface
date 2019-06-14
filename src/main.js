import Vue from 'vue';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import router from '@/router';
import store from '@/store';
import App from '@/app.vue';
import '@/registerServiceWorker';
import i18n from '@/i18n';
import VueClipboard from 'vue-clipboard2';
import { Plugin } from 'vue-fragment';
import '@/helpres/filters';

UIkit.use(Icons);

Vue.config.productionTip = false;

Vue.use(VueClipboard);
Vue.use(Plugin);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created() {
    this.$store.dispatch('locker/updateLockList');
  },
}).$mount('#app');
