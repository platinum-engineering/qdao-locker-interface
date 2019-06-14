<template>
  <ul class="uk-pagination" uk-margin v-if="total && pages > 1">
    <li v-for="(label, index) in labels"
        v-bind:key="index"
        :class="`page` in label ? (label.active ? 'uk-active' : '') : 'uk-disabled'">
      <span v-if="!(`page` in label)">...</span>
      <span v-else-if="label.active">{{ label.page + 1 }}</span>
      <a href="#" v-on:click.prevent="open(label.page)" v-else>
        {{ label.page + 1 }}
      </a>
    </li>
  </ul>
</template>


<script>
export default {
  name: 'pagination',
  props: ['value', 'total', 'perPage'],
  methods: {
    open(index) {
      this.$emit('input', index);
    },
  },
  computed: {
    pages() {
      return Math.ceil(this.total / this.perPage);
    },
    labels() {
      const currentPage = parseInt(this.value, 10);
      // eslint-disable-next-line
      let result = [];
      if (currentPage > 2) {
        result.push({
          page: 0,
        });
      }
      if (currentPage > 3) {
        result.push({});
      }
      {
        let i = Math.max(currentPage - 2, 0);
        for (; i < Math.min(currentPage + 3, this.pages); i += 1) {
          result.push({
            page: i,
            active: (i === currentPage),
          });
        }
      }
      if (currentPage < this.pages - 4) {
        result.push({});
      }
      if (currentPage < this.pages - 3) {
        result.push({
          page: this.pages - 1,
        });
      }
      return result;
    },
  },
};
</script>
