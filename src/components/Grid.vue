<template>
  <div id="grid" style="padding-left: calc(100vw - 100%);" :style="gridMaxMin" @mouseup="mouseUp">
      <svg id="SVG" :style="gridMaxMin">
        <line v-for="(point, index) in this.$store.getters.pathArr" :key="index" stroke-width="3px" stroke="yellow"  
          :x1="point.current.centerX" :y1="point.current.centerY" :x2="point.next.centerX" :y2="point.next.centerY"/>
      </svg>
      <template v-for="r in rows">
          <template v-for="c in cols">
              <grid-node :id="r + '-' + c" :key="r + '-' + c" :style="nodeStyle"></grid-node>
          </template>
          <div class="break" :key="r + 'br'"></div>
      </template>
  </div>
</template>

<script>

import Node from './Node.vue'

export default {
  components : {
    gridNode: Node
  },

  data () {
    return {
      nodeStyle: {
        width: this.$store.getters.nodeWidth + 'px',
        height: this.$store.getters.nodeWidth + 'px',
      },
      rows: Math.floor((window.screen.availHeight - 150)/this.$store.getters.nodeWidth),
      cols: Math.floor(Math.max(window.screen.availWidth, 1200)/this.$store.getters.nodeWidth),
    }
  },

  computed : {
    gridMaxMin() {
       return {
        'min-width': this.cols * this.$store.getters.nodeWidth + 'px',
        'min-height': this.rows * this.$store.getters.nodeWidth - this.rows + 'px'
      }
    }
  },

  created() {
    var obj = {
      rows: this.rows,
      cols: this.cols,
    }
    this.$store.dispatch('setRowsColsCreated', obj);
  },

  mounted() {
    var startNodeId = Math.floor(this.rows/2) + '-' + Math.floor(this.cols/3);
    var endNodeId = Math.floor(this.rows/2) + '-' + Math.floor(this.cols - this.cols/3);
    this.$store.getters.nodes[startNodeId].isStartNode = true;
    this.$store.getters.nodes[endNodeId].isEndNode = true;
    this.$store.dispatch('setStartNode' ,this.$store.getters.nodes[startNodeId]);
    this.$store.dispatch('setEndNode' ,this.$store.getters.nodes[endNodeId]);
    this.$store.dispatch('setNavMinWidth' , this.gridMaxMin['min-width']);
  },

  methods: {
    mouseUp() {
        this.$store.dispatch('mouseUp');
        this.$store.dispatch('setDrawMode', null);
        if(this.$store.getters.startNode && this.$store.getters.endNode) {
            this.$store.dispatch('setDrawState', 'wall');
        }
    },
  }
}

</script>

<style scoped>
    #grid {
        display: flex;
        flex: 1;
        flex-flow: row wrap;
        justify-content: center;
        margin: 20px 0 0 0;
    }

    .break {
        flex-basis: 100%;
        height: 0;
    }

      #SVG{
      position: absolute;
      pointer-events: none;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 2;
    }

    .gridNode {
        margin:-1px 0 0 -1px;
        padding: 0;
        border: 1px solid rgb(74, 174, 207);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary);
    }

    .wall {
        animation: wallAnimation 0.3s ease-out forwards;
        background: #0C3547;
        border: none;
    }

    .step {
        background: #E5E5E5;
        /* border: none; */
    }

    .prepared {
        background: #98FB98;
        /* border: none; */
    }

    .visited {
        /* background: #40CEE3; */
        animation: visitedAnimation 0.5s ease-out forwards;
    }

    .path {
        background-color: #AFEEEE;
    }

    @keyframes flip-in {
      from {
        transform: rotateY(90deg);
      }

      to {
        transform: rotateY(0deg);
      }
    }

    @keyframes flip-in-color {
        0% {
            transform: rotateY(90deg);
        }

        50% {
            background-color: rgb(34, 122, 160);
            transform: rotateY(45deg);
        }

        100% {
            backgroud-color: #0C3547;
            transform: rotateY(0deg);
        }
    }

    @keyframes visitedAnimation {
        0% {
            transform: scale(0.3);
            background-color: rgb(17, 76, 112);
            border-radius: 100%;
        }

        50% {
            background-color: rgb(112, 169, 235);
        }

        75% {
            transform: scale(1.15);
            background-color: rgb(133, 241, 255);
        }

        100% {
            transform: scale(1);
            background-color: #88F5FF;
        }
}

    @keyframes wallAnimation {
        0% {
            transform: scale(0.3);
            background-color: rgb(17, 76, 112);
        }

        50% {
            transform: scale(1.1);
            background-color: rgb(27, 90, 117);
        }

        100% {
            transform: scale(1);
            background-color: rgb(17, 68, 90);
        }
}

</style>
