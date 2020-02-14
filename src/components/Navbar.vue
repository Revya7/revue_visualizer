<template>
    <nav class="navbar navbar-expand navbar-dark bg-primary" style="min-width: 1200px;height:55px;">
        <div id="navbar-background" :style="{width: navMinWidth}"></div>

        <router-link tag="a" class="navbar-brand" to="/pathfinding">Revue Visualizer</router-link>
        <span class="navbar-brand by">by <a target="_blank" href="https://www.facebook.com/mahdi.alfakih.75" class="theName">Mahdi Al-Fakih</a><span class="text-white"> | </span><a target="_blank" href="https://github.com/Revya7/revue_visualizer">Github</a></span>
        <button class="navbar-toggler ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="nav navbar-nav">
                <li class="nav-item dropdown mx-1 my-1 my-xl-0">
                    <a class="nav-link dropdown-toggle btn btn-secondary smaller-font" data-toggle="dropdown">
                        Mode: <span>{{ this.$store.getters.mode }}</span>
                    </a>
                    <div class="dropdown-menu bg-secondary">
                        <router-link tag="a" activeClass="active" class="dropdown-item" to="/pathfinding">Pathfinding</router-link>
                        <router-link tag="a" activeClass="active" class="dropdown-item" to="/sorting">Sorting</router-link>
                    </div>
                </li>

                <li class="nav-item dropdown mx-1 my-1 my-xl-0">
                    <a class="nav-link dropdown-toggle btn btn-secondary smaller-font" :class="{'has-max': mode === 'Pathfinding'}" data-toggle="dropdown">
                        Algorithm: <span>{{ this.$store.getters.toVisualizeName }}</span>
                    </a>
                    <!-- Pathfinding -->
                    <div v-if="$store.getters.mode == 'Pathfinding'" class="dropdown-menu bg-secondary" :class="{disabled: gridLocked}">
                        <div v-for="(algorithm, index) in PF_algorithms" :key="index" class="btn-group dropright w100">
                            <button @click="changeToVisualize(algorithm, index);" class="dropdown-item btn-primary text-white bg-secondary" :disabled="gridLocked">{{ algorithm.name }}</button>
                            
                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown"></button>
                                <div class="dropdown-menu bg-secondary">
                                    <a class="dropdown-item py-1 pl-1" :class="{disabled: gridLocked}">
                                        <div class="row">
                                            <div class="col-12 d-flex justify-content-center align-items-center">
                                                <label class="mb-0" :class="{disabled: algorithm.lockDiagonal}" :for="algorithm.name + '-diagonal-move'" style="cursor: pointer;">Diagonal</label>
                                                <input type="checkbox" @change="changeDiagonal(algorithm, $event);" :checked="algorithm.lockDiagonal || algorithm.diagonal" :disabled="gridLocked || algorithm.lockDiagonal" class="ml-auto" :id="algorithm.name + '-diagonal-move'" style="cursor: pointer;">
                                            </div>
                                        </div>
                                    </a>
                                    <template v-if="algorithm.heuristics.length > 0">
                                        <div class="dropdown-divider m-0"></div>
                                        <a class="dropdown-item pl-1">Heuristics:</a>
                                        <a v-for="(heuristic, index) in algorithm.heuristics" :key="index" class="dropdown-item" :class="{disabled: gridLocked}">
                                            <div class="row">
                                                <div class="col-12 d-flex justify-content-center align-items-center">
                                                    <label class="mb-0" :class="{disabled: algorithm.lockDiagonal}" :for="algorithm.name + heuristic" style="cursor: pointer;">{{ heuristic }}</label>
                                                    <input type="radio" :value="index" :checked="index == 0" @change="changeHeuristic(algorithm, $event);" :disabled="gridLocked" class="ml-auto" :id="algorithm.name + heuristic" style="cursor: pointer;" :name="algorithm.name">
                                                </div>
                                            </div>
                                        </a>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Sorting -->
                    <div v-if="$store.getters.mode == 'Sorting'" class="dropdown-menu bg-secondary" :class="{disabled: !noWorkStarted}">
                        <button class="dropdown-item btn-primary bg-secondary text-white" :disabled="!noWorkStarted" v-for="(algorithm, index) in sorting_algorithms" :key="index" @click="changeToVisualize(algorithm, index);">{{ algorithm.name }}</button>
                    </div>
                </li>

                <li v-if="$store.getters.mode == 'Pathfinding'" class="nav-item dropdown mx-1 my-1 my-xl-0">
                    <a class="nav-link dropdown-toggle btn btn-secondary smaller-font" data-toggle="dropdown">
                        Maze & Patterns
                    </a>
                    <div class="dropdown-menu bg-secondary" :class="{disabled: gridLocked}">
                        <button class="dropdown-item btn-primary bg-secondary text-white" v-for="(algorithm, index) in maze_algorithms" :key="index" @click="createMaze(algorithm.algorithm, index);" :disabled="gridLocked">{{ algorithm.name }}</button>
                     </div>
                </li>
            </ul>

            <ul class="nav navbar-nav ml-auto">

                <li v-if="$store.getters.mode == 'Pathfinding'" class="nav-item dropdown mx-1 my-1 my-xl-0">
                    <a class="nav-link dropdown-toggle btn btn-secondary smaller-font" data-toggle="dropdown">Clear</a>
                    <div class="dropdown-menu bg-secondary" :class="{disabled: gridLocked}">
                        <button class="dropdown-item btn-primary bg-secondary text-white" :disabled="gridLocked" @click.prevent="clearBoard">Board</button>
                        <button class="dropdown-item btn-primary bg-secondary text-white" :disabled="gridLocked" @click.prevent="clearPath">Path</button>
                        <button class="dropdown-item btn-primary bg-secondary text-white" :disabled="gridLocked" @click.prevent="clearWalls">Walls</button>
                    </div>
                </li>

                <li v-if="$store.getters.mode == 'Pathfinding'" class="nav-item dropdown mx-1 my-1 my-xl-0">
                    <a class="nav-link dropdown-toggle btn btn-secondary smaller-font" data-toggle="dropdown" style="min-width: 185px;">
                        Place/Draw: <span>{{ formattingDraw[this.$store.getters.drawState] }}</span>
                    </a>
                    <div class="dropdown-menu bg-secondary" :class="{disabled: gridLocked}">
                        <button class="dropdown-item btn-primary bg-secondary text-white" :disabled="gridLocked" @click.prevent="changeDrawState('startNode');">Starting Point</button>
                        <button class="dropdown-item btn-primary bg-secondary text-white" :disabled="gridLocked" @click.prevent="changeDrawState('endNode');">Target Point</button>
                        <button class="dropdown-item btn-primary bg-secondary text-white" :disabled="gridLocked" @click.prevent="changeDrawState('wall');">Walls</button>
                        <button class="dropdown-item btn-primary bg-secondary text-white" :disabled="gridLocked" @click.prevent="importExport('import')">Import</button>
                        <button class="dropdown-item btn-primary bg-secondary text-white" :disabled="gridLocked" @click.prevent="importExport('export')">Export</button>
                    </div>
                </li>

                <!-- For Sorting -->
                <li v-if="$store.getters.mode == 'Sorting'" class="nav-item dropdown mx-1 my-1 my-xl-0">
                    <a class="nav-link dropdown-toggle btn btn-secondary smaller-font" data-toggle="dropdown">Actions</a>
                    <div class="dropdown-menu bg-secondary" :class="{disabled: !noWorkStarted}">
                        <button class="dropdown-item btn-primary bg-secondary text-white" :disabled="!noWorkStarted" @click.prevent="generateNewSortingArr">Generate new Array</button>
                    </div>
                </li>


                <li class="nav-item dropdown mx-1 my-1 my-xl-0">
                    <a class="nav-link dropdown-toggle btn btn-secondary smaller-font" data-toggle="dropdown">
                        Speed: <span>{{ formattingSpeed[this.$store.getters.animationSpeed] }}</span>
                    </a>
                    <div class="dropdown-menu bg-secondary" :class="{disabled: processingWork}">
                        <button class="dropdown-item btn-primary bg-secondary text-white" :disabled="processingWork" v-if="false" @click.prevent="changeAnimationSpeed('fast');">Fast</button>
                        <button class="dropdown-item btn-primary bg-secondary text-white" :disabled="processingWork" @click.prevent="changeAnimationSpeed('normal');">Normal</button>
                        <button class="dropdown-item btn-primary bg-secondary text-white" :disabled="processingWork" @click.prevent="changeAnimationSpeed('slow');">Slow</button>
                    </div>
                </li>

                <li class="mx-1 my-1 my-xl-0">
                    <div class="btn-group bg-light" style="border-radius: 0.25rem">
                        <button class="btn btn-light text-primary navbar-btn btn-block h100" :disabled="creatingMaze" @click="visualize">{{ visualizeText }}</button>
                        <button type="button" class="btn btn-danger" @click="cancelVisualize" :disabled="noWorkStarted || creatingMaze"><i class="fas fa-power-off"></i></button>
                    </div>
                </li>
            </ul>

        </div>
    </nav>
</template>

<script>
  export default {

    data() { 
    return {

        PF_algorithms: this.$store.getters.PF_algorithms,
        maze_algorithms: this.$store.getters.maze_algorithms,
        sorting_algorithms: this.$store.getters.sorting_algorithms,
        formattingDraw: {
            startNode: 'Starting Point',
            endNode: 'Target Point',
            wall: 'Walls',
        },

        formattingSpeed: {
            fast: 'Fast',
            normal: 'Normal',
            slow: 'Slow',
        },

        speedState: {
            'Dijkstar': {
                fast: {
                    use: false,
                    time: 100
                },
                normal: {
                    use: true,
                    time: 175
                },
                slow: {
                    use: true,
                    time: 150
                }
            },

            'A*': {
                fast: {
                    use: false,
                    time: 100
                },
                normal: {
                    use: true,
                    time: 50
                },
                slow: {
                    use: true,
                    time: 100
                },
            },
            'Jump Point Search': {
                fast: {
                    use: false,
                    time: 100
                },
                normal: {
                    use: true,
                    time: 10
                },
                slow: {
                    use: true,
                    time: 30
                },
            },

            'Bubble Sort': {
                fast: {
                    use: false,
                    time: 100
                },
                normal: {
                    use: true,
                    time: 1
                },
                slow: {
                    use: true,
                    time: 150
                },
            },

            'Insertion Sort': {
                fast: {
                    use: false,
                    time: 100
                },
                normal: {
                    use: true,
                    time: 1
                },
                slow: {
                    use: true,
                    time: 150
                },
            },

            'Selection Sort': {
                fast: {
                    use: false,
                    time: 100
                },
                normal: {
                    use: true,
                    time: 1
                },
                slow: {
                    use: true,
                    time: 150
                },
            },

            'Quick Sort': {
                fast: {
                    use: false,
                    time: 100
                },
                normal: {
                    use: true,
                    time: 25
                },
                slow: {
                    use: true,
                    time: 125
                },
            },

            'Merge Sort': {
                fast: {
                    use: false,
                    time: 100
                },
                normal: {
                    use: true,
                    time: 30
                },
                slow: {
                    use: true,
                    time: 150
                },
            },
        },

    }
    },

    computed: {

        navMinWidth() {
            return this.$store.getters.navMinWidth;
        },

        creatingMaze() {
            return this.mode === 'Pathfinding' ? this.$store.getters.creatingMaze : false;
        },
            
        visualizeText() {
            let word = this.mode == 'Pathfinding' ? 'Search' : 'Sort';
            let paused;
            let started;
            if(word == 'Search') {
                paused = this.$store.getters.paused === true;
                started = this.$store.getters.isGridLocked  && !this.creatingMaze;
            } else {
                paused = this.$store.getters.sortingOptions.paused;
                started = this.$store.getters.sortingOptions.started;
            }

            if(started && !paused) {
                return `Pause ${word}`;
            }

            return paused ? `Resume ${word}` : `Start ${word}`;
        },

        mode() {
            return this.$store.getters.mode;
        },

        paused() {
            return this.$store.getters.paused;
        },

        gridLocked() {
            return this.$store.getters.isGridLocked;
        },

        noWorkStarted() {
            if(this.mode == 'Pathfinding') {
                return !this.gridLocked;
            } else {
                return !this.$store.getters.sortingOptions.started;
            }
        },

        processingWork() {
            if(this.mode == 'Pathfinding') {
                return this.gridLocked && !this.paused;
            } else {
                return this.$store.getters.sortingOptions.started && !this.$store.getters.sortingOptions.paused;
            }
        }
    },

    methods: {
        
        changeDrawState(val) {
            this.$store.dispatch('setDrawState', val);
        },

        changeAnimationSpeed(val) {
            this.$store.dispatch('setAnimationSpeed', val);
        },

        clearBoard() {
            this.clearPath();
            this.clearWalls();

            this.$store.dispatch('setStartNode', null);
            this.$store.dispatch('setEndNode', null);
        },

        clearPath() {
            var nodesMap = this.$store.getters.nodes;
            this.$store.dispatch('setPathArr', []);
            for(var node in nodesMap) {
                nodesMap[node].isVisited = false;
                nodesMap[node].isPath = false;
                nodesMap[node].isStep = false;
                nodesMap[node].isPrepared = false;
            }
        },

        clearWalls() {
            var nodesMap = this.$store.getters.nodes;
            for(var node in nodesMap) {
                nodesMap[node].isWall = false;
            }
        },

        changeToVisualize(algo, index) {
            this.$store.dispatch('setToVisualize', {
                algorithm: algo,
                index: index
            });
        },


        changeDiagonal(algorithm, $event) {
            algorithm.change('diagonal', $event.target.checked);
        },

        changeHeuristic(algorithm, $event) {
            algorithm.change('heuristicIndex', $event.target.value);
        },

        createMaze(algorithm, index) {
            if(this.gridLocked) {
                return;
            } else {
                this.$store.dispatch('setGridLock', true);
                this.$store.dispatch('setCreatingMaze', true);
            }
            this.clearWalls();
            this.clearPath();
            let self = this;
            let horStart = 1;
            let verStart = 1;
            let horEnd = this.$store.getters.rowsColsCreated.cols;
            let verEnd = this.$store.getters.rowsColsCreated.rows;
            let nodes = this.$store.getters.nodes;
            var map = algorithm(horStart, horEnd, verStart, verEnd, nodes, true);

            function animateMaze(map, index) {
                if(self.mode !== 'Pathfinding') {
                    index = Infinity;
                }
                if(nodes[map[index]]) {
                    nodes[map[index]].isWall = true;
                    setTimeout(() => {
                        animateMaze(map, ++index);
                    },10)
                } else {
                    self.$store.dispatch('setGridLock', false);
                    self.$store.dispatch('setCreatingMaze', false);
                }
            }

            animateMaze(map, 0);
        },

        generateNewSortingArr() {
            this.cancelVisualize();
            this.$store.dispatch('generateNewSortingArr');
        },

        cancelVisualize() {
            if(this.mode == 'Sorting') {
                this.$store.dispatch('resetSortingOptions');
                this.$store.getters.columns.forEach(column => {
                    column.bgColor = this.$store.getters.sortingOptions.original;
                });
                return;
            }

            if(this.paused === 'cancel') {
                this.$store.dispatch('setPausedAt', 0);
                this.$store.dispatch('setPaused', false);
            } else if(!this.paused) {
                this.$store.dispatch('setPaused', 'cancel');
                this.$store.dispatch('setPausedAt', 0);
            } else {
                this.$store.dispatch('setPaused', false);
                this.$store.dispatch('setPausedAt', 0);
            }

            this.$store.dispatch('setGridLock', false);
            this.clearPath();
        },

        visualize() {
            if(this.mode == 'Sorting') {
                this.visualizeSorting();
            } else {
                this.visualizePathfinding();
            }

        },

        visualizeSorting() {
            var sortingOpts = this.$store.getters.sortingOptions;

            if(!sortingOpts.paused && sortingOpts.started) {
                sortingOpts.paused = true;
                return;
            }
            var theAlgo = this.$store.getters.toVisualizeAlgo;
            sortingOpts.started = true;
            let animationSpeed = this.$store.getters.animationSpeed;
            let time = this.speedState[theAlgo.name][animationSpeed].time;
            sortingOpts.time = time;
            var columnsArr = this.$store.getters.columns;
            sortingOpts.paused = false;
            let i = null;
            let j = null;
            let res = null;

            switch(theAlgo.name) {
                case "Bubble Sort":
                    i = sortingOpts.resumes.i || columnsArr.length;
                    j = sortingOpts.resumes.j || 0;
                    res = theAlgo.algorithm(columnsArr, i, j, true, sortingOpts);
                break;

                case "Insertion Sort":
                    i = sortingOpts.resumes.i || 1;
                    j = sortingOpts.resumes.j || i-1;
                    let currentVal = sortingOpts.resumes.currentVal || null;
                    res = theAlgo.algorithm(columnsArr, i, j, currentVal, sortingOpts);
                break;
                case "Selection Sort":
                    i = sortingOpts.resumes.i || 0;
                    j = sortingOpts.resumes.j || 1;
                    let lowestIdx = sortingOpts.resumes.lowestIdx || null;
                    res = theAlgo.algorithm(columnsArr, i, j, lowestIdx, sortingOpts);
                break;
                case "Quick Sort":
                    let start = sortingOpts.resumes.start || 0;
                    let end = sortingOpts.resumes.end || columnsArr.length - 1;
                    res = theAlgo.algorithm(columnsArr, start, end, sortingOpts, true);
                break;
                case "Merge Sort":
                    if(sortingOpts.resumes.resuming) {
                        theAlgo.algorithm(columnsArr, true, sortingOpts, true, true);
                        return;
                    }
                    res = theAlgo.algorithm(columnsArr, true, sortingOpts);
                break;
            }
            // arr, i, j, noSwaps

            // maybe this reset should be done in store
            // this.$store.dispatch('setSortingArr', []);
            // this.$store.dispatch('setSortingArr', res);
        },

        visualizePathfinding() {
            var self = this;
            if(!this.$store.getters.startNode || !this.$store.getters.endNode) {
                alert('Be sure both Start Point and End Point are placed');
                return;
            }
            if(this.gridLocked) {
                if(!this.$store.getters.paused) {
                    this.$store.dispatch('setPaused', true);
                    return;
                } 

                this.$store.dispatch('setPaused', false);

            } else {
                this.$store.dispatch('setGridLock', true);
                this.clearPath();
            }

            var resultObj;
            var nodesMap = this.$store.getters.nodes;
            var theAlgoName = this.$store.getters.toVisualizeName;
            var theAlgoHeuristic = this.$store.getters.toVisualizeAlgo.getHeuristic();
            var theAlgo = this.$store.getters.toVisualizeAlgo.getAlgorithm();
            switch(theAlgoName) {
                case 'Dijkstar':
                    resultObj = theAlgo(this.$store.getters.startNode.id, this.$store.getters.endNode.id, nodesMap);
                    break;
                case 'A*':
                    resultObj = theAlgo(this.$store.getters.startNode.id, this.$store.getters.endNode.id, nodesMap, theAlgoHeuristic);
                    break;
                case 'Jump Point Search':
                    resultObj = theAlgo(this.$store.getters.startNode.id, this.$store.getters.endNode.id, nodesMap, theAlgoHeuristic, true);
                    break;
                default:
                    alert('Error...');
                    break;
            }

            // return;
            var path = resultObj.path;
            var map = resultObj.map;
            var speed = this.$store.getters.animationSpeed;
            var pausedAt = this.$store.getters.pausedAt;
            var timeOutTime = this.speedState[theAlgoName][speed].time;
            var chunked = false;
            var recursive = false;
            if(theAlgoName == 'Dijkstar') { chunked = true; }
            if(theAlgoName == 'Jump Point Search') { recursive = true; }
            function animateVisited(mapNodeIndex = pausedAt) {
                    if(self.$store.getters.paused) {
                        if(self.$store.getters.paused === 'cancel') {
                            self.cancelVisualize();
                        } else {
                            self.$store.dispatch('setPausedAt', mapNodeIndex);
                        }

                        return; 
                    }
                    switch(speed) {
                        case "normal" :
                            setTimeout(() => {
                            var old = mapNodeIndex;
                                while(chunked && nodesMap[map[mapNodeIndex]]) {
                                    nodesMap[map[mapNodeIndex]].isVisited = true;
                                    mapNodeIndex++;
                                }
                                if(mapNodeIndex === old) {
                                    if(nodesMap[map[mapNodeIndex]]) {
                                        if(recursive && map[mapNodeIndex+1] !== 'v') {
                                            if(map[mapNodeIndex+1] == 'j') {
                                                // disable/enable showing prepared AS prepared instead of visited
                                                nodesMap[map[mapNodeIndex]].isPrepared = true;
                                                // nodesMap[map[mapNodeIndex]].isVisited = true;
                                            } else {
                                                nodesMap[map[mapNodeIndex]].isStep = true;
                                            }
                                        } else {
                                            nodesMap[map[mapNodeIndex]].isVisited = true;
                                        }
                                    }
                                    mapNodeIndex++;
                                }
                                if (mapNodeIndex < map.length) {
                                    animateVisited(mapNodeIndex);
                                } else {
                                    animatedPath();
                                }
                            }, timeOutTime);
                            break;

                        case "slow" :
                            setTimeout(() => {
                                    if(map[mapNodeIndex] == 'chunk'){
                                        animateVisited(mapNodeIndex + 1);
                                        return;
                                    }

                                    if(nodesMap[map[mapNodeIndex]]) {
                                        if(recursive) {
                                            nodesMap[map[mapNodeIndex]].isStep = true;
                                        } else {
                                            nodesMap[map[mapNodeIndex]].isVisited = true;
                                        }
                                    }

                                    mapNodeIndex++;
                                    if (mapNodeIndex < map.length) {
                                        animateVisited(mapNodeIndex);
                                    } else {
                                        animatedPath();
                                    }
                                }, timeOutTime);
                            break;
                        case "fast" :
                            setTimeout(() => {
                                var old = mapNodeIndex;
                                while(chunked && map[mapNodeIndex] != 'chunk' && nodesMap[map[mapNodeIndex]]) {
                                    nodesMap[map[mapNodeIndex]].isVisited = true;
                                    mapNodeIndex++;
                                }
                                if(mapNodeIndex === old) {
                                    if(nodesMap[map[mapNodeIndex]]) {
                                        nodesMap[map[mapNodeIndex]].isVisited = true;
                                    }
                                    mapNodeIndex = mapNodeIndex+1 
                                }
                                if (mapNodeIndex < map.length) {
                                    animateVisited(mapNodeIndex);
                                } else {
                                    animatedPath();
                                }
                            }, 50);
                        break;
                        default:
                            alert('Error...');
                            break;
                    }

            }

            function animatedPath() {
                self.$store.dispatch('setGridLock', false);
                self.$store.dispatch('setPaused', false);
                self.$store.dispatch('setPausedAt', 0);
                if(path.length === 0) {
                    return;
                }
                self.$store.dispatch('setPathArr', []);
                let i = 0;
                nodesMap[path[i]].isVisited = false;
                nodesMap[path[i]].isPath = true;
                while(i+1 < path.length) {
                    self.$store.getters.pathArr.push({
                        current: nodesMap[path[i]],
                        next: nodesMap[path[i+1]]
                    });
                    nodesMap[path[i+1]].isVisited = false;
                    nodesMap[path[i+1]].isPath = true;
                    i++;
                }
            }

            animateVisited();
        },

        importExport(type) {
            // make the current map to an obj variable
            var self = this;
            let nodes = this.$store.getters.nodes;
            let arr = [];
            if(!navigator.clipboard) {
                return alert('Requires Secured Connection');
            }

            if(type == 'export') {

                for(let id in nodes) {
                    if(nodes[id].isWall) {
                        arr.push(id);
                    }
                }

                var arrJSON = JSON.stringify(arr);
                navigator.clipboard.writeText(arrJSON);
                alert('Copied to clipboard, you can use Import now.');
            }

            if(type == 'import') {

                // first import if clipboard allows
                navigator.clipboard.readText().then(function(data) {
                    try {
                        var map = JSON.parse(data);
                        self.clearWalls();
                        map.forEach(id => {
                            nodes[id].isWall = true;
                        });
                    } catch(e) {
                        alert('An imported map should be copied to the clipboard beforehand')
                    }
    
    
                    // then copy the variable to clipboard
                    // var arrJSON = JSON.stringify(arr);
                    // navigator.clipboard.writeText(arrJSON);
                });
            }

        },
    }

  }

</script>

<style scoped>
    .smaller-font {
        font-size: 13px !important;
    }

    .h100 {
        height: 100%;
    }

    .w100 {
        width: 100%;
    }

    span {
        font-size: 13px;
    }

    .dropdown-menu {
        margin-top: -1px;
        margin-left: -1px;
        padding: 0 0 0 0;
        border-radius: 0;
    }

    .dropdown>.dropdown-toggle-split {
        border-radius: 0 !important;
    }

    .dropdown>.dropdown-menu {
        transition: 0.3s all ease-in-out;
    }
    .dropdown:hover>.dropdown-menu {
        display: block;
    }

    .dropdown>.dropdown-toggle:active {
        /*Without this, clicking will make it sticky*/
        pointer-events: none;
    }

    .dropdown>button:hover {
        background: var(--primary);
    }

    .dropdown-menu>button:hover {
        background: var(--primary) !important;
    }

    .dropdown-menu>.btn-group>button:hover {
        background: var(--primary) !important;
    }

    .disabled {
        cursor: not-allowed;
    }

    /* .visualize-toggle:hover ~ .visualize-menu {
        display: block;
    } */

    /* .visualize-menu {
        pointer-events: none;
    } */

    /* .visualize-menu:hover {
        display: block;
    } */

    .dropdown-item:focus {
        background: var(--secondary) !important;
    }

    button:focus {
        outline: none !important;
        box-shadow: none !important;
    }

    .dropdown-divider {
        border-color: var(--primary)
    }

    .has-max {
        max-width : 150px;
        overflow:hidden;
        display:inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    #navbar-background {
        position: absolute;
        height: 55px;
        background: var(--primary);
        z-index: -1;
    }

    .navbar-brand.by {
        position: absolute;
        font-size: 11px;
        top: 31px;
        /* left: 71px; */
        user-select: none;
        /* pointer-events: none; */
    }

    .theName {
        font-size: 11px;
        color: rgb(115, 234, 255) !important;
    }

    .theName:hover {
        text-decoration: underline;
        text-decoration-color: rgb(115, 234, 255);
    }

</style>
