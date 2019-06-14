<template>
  <div>
    <div class="uk-overflow-auto">
      <table class="uk-table uk-table-justify">
        <thead>
        <tr>
          <th v-for="key in thead" v-bind:key="key">{{ $t(`labels.${ key }`) }}</th>
        </tr>
        </thead>
        <tbody v-for="(item, index) in getPage(currentPage)" v-bind:key="index">
          <tr v-if="item">
            <td class="address">
              {{ item.address | paymentAddress }}
              <button class="uk-button uk-button-text" v-clipboard:copy="item.address">
                <img src="../../assets/images/copy.svg" class="uk-preserve" alt="Copy" uk-svg/>
              </button>
              <a :href="`https://etherscan.io/address/${ item.address }`" target="_blank">
                <img src="../../assets/images/link.svg" class="uk-preserve" alt="Etherscan" uk-svg/>
              </a>
              <span v-if="teamMember(item.address)">
                <span class="team-badge">
                  {{ $t('labels.team') }}
                </span>
                <div uk-drop="pos: top-center">
                  <div class="team-drop">
                    {{ $t('texts.team-address-explain') }}
                  </div>
                </div>
              </span>
            </td>
            <td>{{ item.locked | tokensValue }} Q DAO</td>
            <td>{{ item.withdrawable | tokensValue }} Q DAO</td>
            <td>
              <span class="open-periods" v-on:click="openTable(index)">
                {{ item.nextUnlock | unixDateTime }}
                <span uk-icon="icon: chevron-down; ratio: .8" v-if="!isOpen(index)"></span>
                <span uk-icon="icon: chevron-up; ratio: .8" v-else></span>
              </span>
            </td>
          </tr>
          <tr v-if="isOpen(index)">
            <td :colspan="Object.keys(item).length">
              <table class="uk-table uk-table-justify">
                <tbody>
                <tr v-for="(period, index) in item.lock._periods" v-bind:key="index">
                  <td>
                    {{ item.lock._tokens[index] | tokensValue }} Q DAO
                  </td>
                  <td class="uk-text-lowercase">
                    {{ isWithdrawable(period) ?
                      $t('labels.unlocked') : $t('labels.will-be-unlocked')
                    }}
                  </td>
                  <td>
                    {{ period | unixDateTime }}
                  </td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <pagination v-model="currentPage" :perPage="perPage" :total="lockList.length"/>
  </div>
</template>

<script>
import moment from 'moment';
import pagination from '@/components/pagination.vue';

export default {
  name: 'full-list-table',
  components: {
    pagination,
  },
  data() {
    return {
      currentRow: 0,
      currentPage: 0,
      perPage: 10,
      thead: ['address', 'tokens-locked', 'withdrawable', 'next-unlock'],
    };
  },
  methods: {
    openTable(index) {
      this.currentRow = this.currentRow === index ? undefined : index;
    },
    isOpen(index) {
      return index === this.currentRow;
    },
    getPage(page) {
      const fromIndex = page * this.perPage;
      const toIndex = Math.min((page + 1) * this.perPage, this.lockList.length);
      return this.lockList.slice(fromIndex, toIndex) || [];
    },
    teamMember(address) {
      return this.$store.getters['locker/getTeam'][address];
    },
    isWithdrawable(date) {
      return moment().isAfter(moment.unix(date));
    },
  },
  computed: {
    lockList() {
      return this.$store.getters['locker/getActiveLocks'];
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "@/scss/uikit/vars.scss";

  table {
    tbody {
      td {
        min-width: 10rem;
      }
      td[colspan] {
        padding: 0;

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

  .team-badge {
    background-color: $global-alter-color;
    color: #FFF;
    display: inline-block;
    vertical-align: middle;
    line-height: 1.5rem;
    font-size: 1rem;
    text-transform: uppercase;
    padding: 0 1rem;
    border-radius: 3px;
    cursor: pointer;
    font-weight: bold;
    transition: all .3s;
    user-select: none;

    &:hover  {
      opacity: .9;
    }
  }

  .team-drop {
    color: rgba(#FFF, .9);
    line-height: 1.36;
    font-size: 1.1rem;
    padding: 1rem;
    background: #000;
    box-shadow: 0 20px 35px 0 rgba(0, 0, 0, 0.06);
    border-radius: .5rem;
  }
</style>
