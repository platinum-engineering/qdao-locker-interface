<template>
  <a :href="links.platinumLink" target="_blank">
    <img alt="" src="../../../src/assets/images/logo.svg"/>
  </a>
</template>

<script>
import Links from './topLinks';

export default {
  name: 'logo',
  data() {
    return {
      links: Links,
    };
  },
};
</script>
