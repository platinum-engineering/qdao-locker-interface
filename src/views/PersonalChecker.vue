<template>
  <fragment>
    <h1>{{ $t('personal-checker.title') }}</h1>
    <div class="uk-flex uk-flex-between">
      <div v-if="ethAddress">
        <div class="uk-section-muted float-box">
          <ul class="uk-list uk-list-divider">
            <li>
              <span class="title">{{ $t('labels.total-locked') }}</span>
              <span class="value">{{ personal.total.locked | tokensValue }} Q DAO</span>
            </li>
            <li>
              <span class="title">{{ $t('labels.withdrawable') }}</span>
              <span class="value">{{ personal.total.withdrawable | tokensValue }} Q DAO</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="personal-checker uk-flex-first@m">
        <button v-on:click="getMetamaskAddress" class="uk-button main alter">
          <img src="@/assets/images/metamask.svg" class="uk-preserve" uk-svg/>
          {{ $t('labels.metamask') }}
        </button>
        <button class="uk-button main soon" disabled>
          <img src="@/assets/images/trezor.svg" class="uk-preserve" uk-svg/>
          {{ $t('labels.trezor') }}
        </button>
        <p v-if="ethAddress === null" class="uk-text-danger"
           v-html="$t('texts.get-metamask-browser')">
        </p>
        <p class="uk-text-muted" v-else-if="!ethAddress">
          {{ $t('texts.login-through-metamask') }}
        </p>
        <div v-else>
          <h2>{{ $t('labels.next-unlocks') }}</h2>
          <div class="uk-overflow-auto">
            <table class="uk-table uk-table-justify">
              <thead>
                <tr>
                  <th v-for="key in thead" v-bind:key="key">{{ $t(`labels.${ key }`) }}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody v-if="!personal.locks.length">
                <tr>
                  <td colspan="4" class="empty-set uk-text-center">
                    {{ $t('labels.no-locks') }}
                  </td>
                </tr>
              </tbody>
              <tbody v-for="(item, index) in personal.locks" v-bind:key="index">
                <tr v-if="item">
                  <td>
                    {{ item.tokens | tokensValue }} Q DAO
                  </td>
                  <td>
                    <span class="open-periods" v-on:click="openTable(index)">
                      {{ item.nextUnlock | unixDateTime }}
                      <span uk-icon="icon: chevron-down; ratio: .8" v-if="!isOpen(index)"></span>
                      <span uk-icon="icon: chevron-up; ratio: .8" v-else></span>
                    </span>
                  </td>
                  <td>
                    {{ item.withdrawable | tokensValue }} Q DAO
                  </td>
                  <td>
                    <button v-on:click="withdraw(item.id)"
                            :disabled="isDisabled(item.id)"
                            v-if="item.withdrawable > 0"
                            class="uk-button alter">
                      <span uk-spinner="ratio: .5" v-if="isDisabled(item.id)"></span>
                      {{ $t('labels.withdraw-tokens') }}
                    </button>
                  </td>
                </tr>
                <tr v-if="isOpen(index)">
                  <td :colspan="Object.keys(item).length">
                    <table class="uk-table uk-table-justify">
                      <tr v-for="(lock, index) in item.unpaid" v-bind:key="index">
                        <td>
                          {{ lock.tokens | tokensValue }} Q DAO
                        </td>
                        <td class="uk-text-lowercase">
                          {{ isWithdrawable(lock.date) ?
                          $t('labels.unlocked') : $t('labels.will-be-unlocked')
                          }}
                        </td>
                        <td>
                          {{ lock.date | unixDateTime }}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
      </div>
    </div>
    </div>
  </fragment>
</template>

<script>
import Vue from 'vue';
import moment from 'moment';

export default {
  name: 'perrsonal-checker',
  data() {
    return {
      thead: ['total-locked', 'next-unlock', 'withdrawable'],
      disabled: {},
      currentRow: 0,
    };
  },
  methods: {
    getMetamaskAddress() {
      this.$store.dispatch('locker/updateEthAddress');
    },
    withdraw(_id) {
      Vue.set(this.disabled, _id, true);
      this.$store.dispatch('locker/withdraw', _id);
    },
    isDisabled(_id) {
      return this.disabled[_id];
    },
    openTable(index) {
      this.currentRow = this.currentRow === index ? undefined : index;
    },
    isOpen(index) {
      return index === this.currentRow;
    },
    isWithdrawable(date) {
      return moment().isAfter(moment.unix(date));
    },
  },
  computed: {
    ethAddress() {
      return this.$store.getters['locker/getEthAddress'];
    },
    personal() {
      return this.$store.getters['locker/getHolder'](this.$store.getters['locker/getEthAddress']);
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "@/scss/uikit/vars.scss";

  .personal-checker {
    min-width: 60%;

    .uk-button.main:not(:last-child) {
      margin-right: 3rem;
    }

    h2 {
      margin-top: 3rem;
    }

    table {
      width: 100%;
    }
  }

  table {
    tbody {
      td {
        min-width: 10rem;
        line-height: 2rem;
      }
      td[colspan] {
        padding: 0;
        &.empty-set {
          padding: 1.5rem 0;
        }

        table  {
          background-color: $global-alter-background;

          tr {
            td  {
              padding-left: 1rem;
            }
          }
        }
      }
    }
  }
</style>
