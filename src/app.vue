<template>
  <fragment>
    <header>
      <nav class="uk-navbar-container uk-navbar-transparent" uk-navbar>
        <div class="uk-navbar-left">
          <ul class="uk-navbar-nav">
            <li class="uk-active">
              <Logo/>
            </li>
          </ul>
        </div>

        <div class="uk-navbar-right">
          <ul class="uk-navbar-nav uk-hidden@m">
            <li>
              <div uk-toggle="target: #mobile-nav">
                <span uk-icon="icon: menu; ratio: 1.5"></span>
              </div>
              <div id="mobile-nav" uk-offcanvas="flip: true; overlay: true">
                <div class="uk-offcanvas-bar uk-flex uk-flex-column">
                  <button class="uk-offcanvas-close" type="button" uk-close="ratio: 1.5"></button>

                  <ul class="uk-nav uk-nav-left uk-margin-auto-vertical">
                    <TopNavLinks/>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
          <ul class="uk-navbar-nav uk-visible@m">
            <TopNavLinks/>
          </ul>
        </div>
      </nav>
    </header>
    <main>
      <div class="sidebar">
        <div class="sidebar-wrapper">
          <ul uk-sticky>
            <li>
              <router-link :to="{ name: 'home' }" active-class="" class="default">
                <img alt="" class="uk-preserve" src="../src/assets/images/tools-logo.svg" uk-svg/>
              </router-link>
            </li>
            <li>
              <router-link :to="{name: 'home'}" exact>
                <img alt="" class="uk-preserve" src="../src/assets/images/stack.svg" uk-svg/>
              </router-link>
            </li>
            <li>
              <router-link :to="{name: 'checker'}">
                <img alt="" class="uk-preserve" src="../src/assets/images/lock-opened.svg" uk-svg/>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="content">
        <router-view/>
      </div>
    </main>
  </fragment>
</template>

<style lang="scss">
  @import "scss/app.scss";
</style>

<script>
// eslint-disable-next-line
import { Logo, TopNavLinks } from '@/components/header';

export default {
  components: {
    Logo,
    TopNavLinks,
  },
};
</script>
