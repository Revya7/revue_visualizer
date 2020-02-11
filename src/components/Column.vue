<template>
    <div class="column" :style="styleObj">
        <slot v-if="false && 'sizeTooSmall'"></slot>
    </div>
</template>

<script>

export default {
    props: ['theHeight', 'theWidth', 'theIndex'],

    data() {
        return {
            bgColor: this.$store.getters.sortingOptions.original,
            height: this.theHeight,
            width: this.theWidth,
            index: this.theIndex,
        }
    },

    computed: {
        styleObj() {
            return {
                width: this.width + 'px',
                background: this.bgColor,
                height: this.height + 'px',
                marginLeft: 1 + 'px',
                marginRight: 1 + 'px',
            }
        }
    },

    created() {
        this.$store.dispatch('addColumn', this);
    },

}


</script>

<style>

</style>
