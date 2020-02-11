<template>
  <div class="gridNode" :class="classState" @mousedown.prevent="mouseDown();" @mouseenter="mouseEnter()">
      <span style="pointer-events: none;" v-if="isStartNode"><i class="fas fa-angle-right fa-2x"></i></span>
      <span style="pointer-events: none;" v-if="isEndNode"><i class="fas fa-bullseye" style="font-size: 19px;"></i></span>
  </div>
</template>

<script>
export default {
    data () {
        return {
            isVisited: false,
            isWall: false,
            isStartNode: false,
            isEndNode: false,
            isPath: false,
            isStep: false,
            isPrepared: false,
            id: null,
            neighbors: {},
            neighborsArr: [],
            isLocked: false,
            centerX: null,
            centerY: null,
            x: null,
            y: null
        }
    },

    computed : {
        classState: function() {
            return {
                wall: this.isWall && !this.isEndNode && !this.isStartNode,
                startNode: this.isStartNode,
                endNode: this.isEndNode,
                visited: this.isVisited,
                path: this.isPath,
                step: this.isStep,
                prepared: this.isPrepared
            }
        },
    },

    mounted() {
        this.id = this.$el.id;
        var res = this.id.split('-');
        var row = Number(res[0]);
        var col = Number(res[1]);
        this.x = row;
        this.y= col;

        // if +1 a row u'r going down dummy
        if(row - 1 <= this.$store.getters.rowsColsCreated.rows) {
            this.neighbors.top = row-1 + '-' + col;
            this.neighborsArr.push(row-1 + '-' + col);
            if(col + 1 <= this.$store.getters.rowsColsCreated.cols) {
                this.neighbors.topRight = row-1 + '-' + Number(col+1);
            }
            if(col - 1 > 0) {
                this.neighbors.topLeft = row-1 + '-' + Number(col-1);
            }
        }

        if(row + 1 > 0) {
            this.neighbors.bot = row+1 + '-' + col;
            this.neighborsArr.push(row+1 + '-' + col);
            if(col + 1 <= this.$store.getters.rowsColsCreated.cols) {
                this.neighbors.botRight = row+1 + '-' + Number(col+1);
            }
            if(col - 1 > 0) {
                this.neighbors.botLeft = row+1 + '-' + Number(col-1);
            }
        }

        if(col + 1 <= this.$store.getters.rowsColsCreated.cols) {
            this.neighbors.right = row + '-' + Number(col+1);
            this.neighborsArr.push(row + '-' + Number(col+1));
        }

        if(col - 1 > 0) {
            this.neighbors.left = row + '-' + Number(col-1);
            this.neighborsArr.push(row + '-' + Number(col-1));
        }

        const rect = this.$el.getBoundingClientRect();
        this.centerX = rect.left + window.scrollX + this.$el.offsetWidth/2;
        this.centerY = rect.top + window.scrollY + this.$el.offsetHeight/2;

        this.$store.dispatch('addNode', this);
    },

    methods : {

        wall() {
            return this.isWall && !this.isEndNode && !this.isStartNode;
        },

        mouseDown() {

            if(this.$store.getters.isGridLocked) return;

            this.$store.dispatch('mouseDown');

            // Removing Start Node or End Node if only clicked, try merging this inside mouseover func since we fixed pointer events
            if(this.isStartNode) {
                this.isStartNode = false;
                this.$store.dispatch('setStartNode', null);
                this.$store.dispatch('setDrawState', 'startNode');
                return;
            } else if(this.isEndNode) {
                this.isEndNode = false;
                this.$store.dispatch('setEndNode', null);
                this.$store.dispatch('setDrawState', 'endNode');
                return;
            }


            this.mouseEnter();
        },

        mouseEnter() {
            if(this.$store.getters.isMouseDown) {
                switch(this.$store.getters.drawState) {
                    case 'startNode':
                        if(this.isEndNode) return;
                        if(this.$store.getters.startNode) {
                            this.$store.getters.startNode.isStartNode = false;
                        }
                        this.isStartNode = true;
                        this.$store.dispatch('setStartNode', this);
                        break;

                    case 'endNode':
                        if(this.isStartNode) return;
                        if(this.$store.getters.endNode) {
                            this.$store.getters.endNode.isEndNode = false;
                        }
                        this.isEndNode = true;
                        this.$store.dispatch('setEndNode', this);
                        break;
                        
                    case 'wall':
                        if(this.isStartNode || this.isEndNode || this.isLocked) return;
                        this.isVisited = false;
                        this.isPath = false;
                        if(this.$store.getters.drawMode === 1) {
                            this.isWall = true;
                        } else if(this.$store.getters.drawMode === 0) {
                            this.isWall = false;
                        } else {
                            this.$store.dispatch('setDrawMode', this.isWall ? 0 : 1);
                            this.isWall = !this.isWall;  
                        }
                        this.isLocked = true;
                        setTimeout(() => {
                            this.isLocked = false;
                        }, 300);
                        break;
                }
            }
        },
    },
}
</script>
