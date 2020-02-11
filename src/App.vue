<template>
  <div id="app">
    <app-navbar></app-navbar>
    <app-loader v-if="$root.loading"></app-loader>
    <router-view v-if="!$root.loading"></router-view>
  </div>
</template>

<script>

import Navbar from './components/Navbar.vue'
import Loader from './components/Loader.vue'

export default {
  name: 'app',
  components: {
    appNavbar: Navbar,
    appLoader: Loader,
  },
  data () {
    return {
      
    }
  },
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto:light,regular,medium,thin,italic,mediumitalic,bold');

  :root {
    --primary: rgb(27, 90, 117);
    --secondary: rgb(12, 49, 65);
  }

  a {
    cursor: pointer;
    color: white !important;
  }

  .dropdown-menu a:hover {
    background: var(--primary) !important;
  }

  .active {
    font-weight: bolder;
  }

  .hidden {
    display: none;
  }

  * {
    font-family: 'Roboto', sans-serif;
  }
  
</style>
