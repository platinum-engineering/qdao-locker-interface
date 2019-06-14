<template>
  <Fragment>
    <li>
      <router-link :to="{ name: 'home' }">
        {{ $t('nav.dao-tools') }}
      </router-link>
    </li>
    <li>
      <a :href="links.usdqLink" target="_blank">{{ $t('nav.usdq-website') }}</a>
    </li>
    <li>
      <a :href="links.scannerLink" target="_blank">{{ $t('nav.scanner') }}</a>
    </li>
    <li>
      <a :href="links.platinumLink" target="_blank">{{ $t('nav.platinum') }}</a>
    </li>
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment';
import Links from './topLinks';

export default {
  name: 'top-nav-links',
  components: {
    Fragment,
  },
  data() {
    return {
      links: Links,
    };
  },
};
</script>
