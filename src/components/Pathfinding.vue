<template>
    <app-grid></app-grid>
</template>

<script>

import Grid from './Grid.vue'

export default {
  components: {
    appGrid: Grid
  },

  beforeCreate() {
    this.$store.dispatch('setMode', 'Pathfinding');
    this.$store.dispatch('setPausedAt', 0);
    this.$store.dispatch('setPaused', false);
    this.$store.dispatch('setGridLock', false);
  }
}
</script>

<style>

</style>
