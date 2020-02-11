<template>
    <div id="columns" style="padding-left: calc(100vw - 100%);" :style="columnsMaxMin">
      <template v-for="(num, i) in this.$store.getters.sortingArr">
          <column :key="i" :theIndex="i" :id="'column-'+i" :theWidth="width" :theHeight="num">{{num}}</column>
      </template>
  </div>
</template>

<script>

import Column from './Column'

export default {
    components: {
        column: Column
    },

    data() {
        return {
            minWidth: 10,
            defaultLength: Math.min(Math.floor((Math.max(window.screen.availWidth, 1200) - window.screen.availWidth*13/100)/10 + 2), 120), // for margins
        }
    },

    computed: {
        width() {
            return this.$store.getters.sortingArrLength ? Math.floor((Math.max(window.screen.availWidth, 1200) - window.screen.availWidth*13/100)/this.$store.getters.sortingArrLength) : this.minWidth;
        },
        
        maxHeight() {
            return window.screen.availHeight - 150; // 55 for navbar, other for not being in fullscreen
        },

        columnsMaxMin() {
            return {
                'min-width': this.width * this.$store.getters.sortingArrLength + 'px',
                'min-height': this.maxHeight + 'px'
            }
        }
    },

    created() {
        let options = {
            length: this.defaultLength,
            min: 5,
            max: this.maxHeight
        }

        this.$store.dispatch('generateNewSortingArr', options);
    },

    mounted() {
        this.$store.dispatch('setNavMinWidth' , this.columnsMaxMin['min-width']);
    }

}


</script>

<style>
    #columns {
        display: flex;
        justify-content: center;
        align-items: flex-end;
    }
</style>
