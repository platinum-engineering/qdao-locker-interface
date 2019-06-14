import Vue from 'vue';
import moment from 'moment';
import numeral from 'numeral';

Vue.filter('paymentAddress', value => (value ? `${value.substring(0, 8)}…${value.substring(value.length - 8, value.length)}` : ''));

Vue.filter('unixDateTime', value => moment.unix(value).format('MM/DD/YYYY hh:mm a'));

Vue.filter('tokensValue', value => {
  const val = value / (10  ** process.env.VUE_APP_QDAO_DECIMALS);
  const res = numeral(val).format('0,0.0[00000000000000000]');
  if (res === 'NaN') {
    return val;
  }
  return res;
});
