<template>
    <app-columns></app-columns>
</template>

<script>

import Columns from './Columns.vue'

export default {
  components: {
    appColumns: Columns
  },

  beforeCreate() {
    this.$store.dispatch('setMode', 'Sorting');
  }
}
</script>

<style>

</style>
