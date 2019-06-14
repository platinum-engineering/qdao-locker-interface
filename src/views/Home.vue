<template>
  <fragment>
    <h1>{{ $t('home.title') }}</h1>
    <div class="uk-flex uk-flex-between uk-flex-wrap">
      <div>
        <div class="uk-section-muted float-box">
          <ul class="uk-list uk-list-divider">
            <li>
              <span class="title">{{ $t('labels.total-locked') }}</span>
              <span class="value">{{ lockerTotal.locked | tokensValue }} Q DAO</span>
            </li>
            <li>
              <span class="title">{{ $t('labels.withdrawable') }}</span>
              <span class="value">{{ lockerTotal.withdrawable | tokensValue }} Q DAO</span>
            </li>
            <li>
              <span class="title">{{ $t('labels.smart-contract') }}</span>
              <span class="value">
              {{ lockerTotal.contract | paymentAddress }}
              <button class="uk-button uk-button-text" v-clipboard:copy="lockerTotal.contract">
                <img src="../assets/images/copy.svg" class="uk-preserve" alt="Copy" uk-svg/>
              </button>
              <a :href="`https://etherscan.io/address/${ lockerTotal.contract }`" target="_blank">
                <img src="../assets/images/link.svg" class="uk-preserve" alt="Etherscan" uk-svg/>
              </a>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <FullList class="full-list-table uk-flex-first@m"/>
    </div>
  </fragment>
</template>

<script>
// eslint-disable-next-line
import { FullList } from '@/components/checker';

export default {
  name: 'home',
  components: {
    FullList,
  },
  computed: {
    lockerTotal() {
      return { ...this.$store.getters['locker/getTotal'], contract: process.env.VUE_APP_LOCKER_CONTRACT_ADDRESS };
    },
  },
};
</script>

<style lang="scss" scoped>
  .full-list-table  {
    width: 83rem;
    max-width: 100%;
  }
</style>
