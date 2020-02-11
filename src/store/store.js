import Vue from 'vue';
import Vuex from 'vuex';

var dijkstar = require('./algos/pathfinding/dijkstar');
var astar = require('./algos/pathfinding/astar');
var dijkstarDiagonal = require('./algos/pathfinding/dijkstarDiagonal');
var astarDiagonal = require('./algos/pathfinding/astarDiagonal');
var jps = require('./algos/pathfinding/jps');
var recursiveDivision = require('./algos/pathfinding/recursiveDivision');
var bubbleSort = require('./algos/sorting/bubbleSort');
var insertionSort = require('./algos/sorting/insertionSort');
var selectionSort = require('./algos/sorting/selectionSort');
var quickSort = require('./algos/sorting/quickSort');
var mergeSort = require('./algos/sorting/mergeSort');

class PF_Algorithm {
    constructor(name, algorithmArr, lockDiagonal = false, diagonal = false, heuristics = [], heuristicIndex = 0) {
        this.name = name;
        this.algorithmArr = algorithmArr;
        this.diagonal = diagonal;
        this.lockDiagonal = lockDiagonal;
        this.heuristics = heuristics;
        this.heuristicIndex = heuristicIndex;
    }

    change(prop, val) {
        if(this.hasOwnProperty(prop)) {
            this[prop] = val;
            return true;
        }

        throw 'Property not found';
    }

    getAlgorithm() {
        return this.algorithmArr[Number(this.diagonal)];
    }

    getHeuristic() {
        return this.heuristics[this.heuristicIndex];
    }
}

class Sorting_Algorithm {
    constructor(name, algorithm) {
        this.name = name;
        this.algorithm = algorithm;
    }
}

class Maze_Algorithm {
    constructor(name, algorithm) {
        this.name = name;
        this.algorithm = algorithm
    }
}

function generateNewSortingArr(opt = {length: 100, min: 5, max: 1000}) {
    let arr = []
    for(let i = 0; i < opt.length; i++) {
        arr.push(Math.floor(Math.random() * (opt.max - opt.min)) + opt.min);
    }
    return arr;
}

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        // bad, should be in main.js cz Navbar doesnt have access to mode and algo until the other shit is there
        mode: 'in main.js',
        nodeWidth: 28,
        navMinWidth: 0,
        isMouseDown: false,
        drawState: 'wall',
        drawMode: null,
        animationSpeed: 'normal',
        startNode: null,
        endNode: null,
        PF_algorithms: [
            new PF_Algorithm('Dijkstar', [dijkstar, dijkstarDiagonal], false),
            new PF_Algorithm('A*', [astar, astarDiagonal], false, false, ['Manhattan', 'Euclidean', 'Chebyshev']),
            new PF_Algorithm('Jump Point Search', [null, jps], true, true, ['Manhattan', 'Euclidean', 'Chebyshev']),
        ],
        maze_algorithms: [
            new Maze_Algorithm('Recursive Division', recursiveDivision),
        ],
        sorting_algorithms: [
            new Sorting_Algorithm('Bubble Sort', bubbleSort),
            new Sorting_Algorithm('Insertion Sort', insertionSort),
            new Sorting_Algorithm('Selection Sort', selectionSort),
            new Sorting_Algorithm('Quick Sort', quickSort),
            new Sorting_Algorithm('Merge Sort', mergeSort),
        ],
        nodes: {},
        columns: [],
        rowsColsCreated: null,
        isGridLocked: false,
        creatingMaze: false,
        toVisualizeIndex: 0,
        toVisualizeName: null,
        pathArr: [],
        paused: false,
        pausedAt: 0,
        sortingArrLength: null,
        maxColumnHeight: null,
        sortingArr: [],
        sortingOptions: {
            comparing: '#03dffc',
            original: 'green',
            finished: '#1B5A75',
            special: 'rgb(255, 113, 236)',
            marked: 'purple',
            paused: false,
            started: false,
            time: null,
            resumes: {}
        },
        generatingOptions: null,
    },

    getters: {

        mode(state) {
            return state.mode;
        },

        nodeWidth(state) {
            return state.nodeWidth;
        },

        isMouseDown(state) {
            return state.isMouseDown;
        },

        drawState(state) {
            return state.drawState;
        },

        animationSpeed(state) {
            return state.animationSpeed;
        },

        startNode(state) {
            return state.startNode;
        },

        endNode(state) {
            return state.endNode;
        },

        toVisualizeName(state) {
            if(state.toVisualizeName) {
                return state.toVisualizeName;
            }

            if(state.mode == 'Pathfinding') {
                return state.PF_algorithms[state.toVisualizeIndex].name;
            } else if(state.mode == 'Sorting') {
                return state.sorting_algorithms[state.toVisualizeIndex].name;
            }
        },

        toVisualizeAlgo(state) {
            return state.mode == 'Pathfinding' ? state.PF_algorithms[state.toVisualizeIndex] : state.sorting_algorithms[state.toVisualizeIndex];
        },

        toVisualizeIndex(state) {
            return state.toVisualizeIndex;
        },

        dijkstar(state) {
            return state.dijkstar;
        },

        astar(state) {
            return state.astar;
        },

        nodes(state) {
            return state.nodes;
        },

        columns(state) {
            return state.columns;
        },

        rowsColsCreated(state) {
            return state.rowsColsCreated;
        },

        isGridLocked(state) {
            return state.isGridLocked;
        },

        PF_algorithms(state) {
            return state.PF_algorithms;
        },

        maze_algorithms(state) {
            return state.maze_algorithms;
        },

        sorting_algorithms(state) {
            return state.sorting_algorithms;
        },

        pathArr(state) {
            return state.pathArr;
        },

        drawMode(state) {
            return state.drawMode;
        },

        paused(state) {
            return state.paused;
        },

        pausedAt(state) {
            return state.pausedAt;
        },

        sortingArr(state) {
            return state.sortingArr;
        },

        sortingArrLength(state) {
            return state.sortingArrLength;
        },

        sortingOptions(state) {
            return state.sortingOptions;
        },

        navMinWidth(state) {
            return state.navMinWidth;
        },

        creatingMaze(state) {
            return state.creatingMaze;
        },
    },

    mutations: {
        setMode(state, payload) {
            state.mode = payload;
        },

        mouseDown(state) {
            state.isMouseDown = true;
        },

        mouseUp(state) {
            state.isMouseDown = false;
        },

        setDrawState(state, payload) {
            state.drawState = payload;
        },

        setAnimationSpeed(state, payload) {
            state.animationSpeed = payload;
        },

        setStartNode(state, payload) {
            if(payload === null) {
                if(state.startNode) {
                    state.startNode.isStartNode = false;
                }
            }
            state.startNode = payload;
        },

        setEndNode(state, payload) {
            if(payload === null) {
                if(state.endNode) {
                    state.endNode.isEndNode = false;
                }
            }
            state.endNode = payload;
        },

        addNode(state, payload) {
            state.nodes[payload.id] = payload;
        },

        addColumn(state, payload) {
            state.columns.push(payload);
        },

        setRowsColsCreated(state, payload) {
            state.rowsColsCreated = payload;
        },

        setGridLock(state, payload) {
            state.isGridLocked = payload;
        },

        setToVisualize(state, payload) {
            
            if(payload.algorithm) {
                state.toVisualizeName = payload.algorithm.name;
            }
            
            if(payload.index !== null && payload.index !== undefined) {
                state.toVisualizeIndex = payload.index;
            }

            if(payload.default == 'Pathfinding') {
                state.toVisualizeName = state.PF_algorithms[payload.index].name;
                state.pathArr = [];
            } else if(payload.default == 'Sorting') {
                state.sortingOptions.resumes = {};
                state.toVisualizeName = state.sorting_algorithms[payload.index].name;
            }

        },

        setPathArr(state, payload) {
            state.pathArr = payload;
        },

        setDrawMode(state, payload) {
            state.drawMode = payload;
        },

        setPaused(state, payload) {
            state.paused = payload;
        },

        setPausedAt(state, payload) {
            state.pausedAt = payload;
        },

        generateNewSortingArr(state, payload) {
            if(payload) {
                state.generatingOptions = payload;
            } else {
                payload = state.generatingOptions;
                let newArr = generateNewSortingArr(payload);
                for(let i = 0; i < newArr.length; i++) {
                    state.columns[i].height = newArr[i];
                }
                return;
            }
            state.columns = [];
            state.sortingArrLength = payload.length;
            state.maxColumnHeight = payload.max;
            state.sortingArr = generateNewSortingArr(payload);
        },

        setSortingArr(state, payload) {
            state.sortingArr = payload;
        },

        resetSortingOptions(state, payload) {
            state.sortingOptions.paused = false;
            state.sortingOptions.started = false;
            state.sortingOptions.resumes = {}
        },

        setNavMinWidth(state, payload) {
            state.navMinWidth = payload;
        },

        setCreatingMaze(state, payload) {
            state.creatingMaze = payload;
        },
    },

    actions: {
        setMode(context, payload) {
            context.commit('setMode', payload);
            var defaultAlgo = {
                default: payload,
                index: 0
            }

            context.commit('setToVisualize', defaultAlgo);
        },

        mouseDown(context) {
            context.commit('mouseDown');
        },

        mouseUp(context) {
            context.commit('mouseUp');
        },

        setDrawState(context, payload) {
            context.commit('setDrawState', payload);
        },

        setAnimationSpeed(context, payload) {
            context.commit('setAnimationSpeed', payload);
        },

        setStartNode(context, payload) {
            context.commit('setStartNode', payload);
        },

        setEndNode(context, payload) {
            context.commit('setEndNode', payload);
        },

        addNode(context, payload) {
            context.commit('addNode', payload);
        },

        addColumn(context, payload) {
            context.commit('addColumn', payload);
        },

        setRowsColsCreated(context, payload) {
            context.commit('setRowsColsCreated', payload);
        },

        setGridLock(context, payload) {
            context.commit('setGridLock', payload);
        },

        setToVisualize(context, payload) {
            context.commit('setToVisualize', payload);
        },

        setPathArr(context, payload) {
            context.commit('setPathArr', payload);
        },

        setDrawMode(context, payload) {
            context.commit('setDrawMode', payload);
        },

        setPaused(context, payload) {
            context.commit('setPaused', payload);
        },

        setPausedAt(context, payload) {
            context.commit('setPausedAt', payload);
        },

        generateNewSortingArr(context, payload) {
            context.commit('resetSortingOptions');
            context.commit('generateNewSortingArr', payload);
        },

        resetSortingOptions(context, payload) {
            context.commit('resetSortingOptions');
        },

        setSortingArr(context, payload) {
            context.commit('setSortingArr', payload);
        },

        setNavMinWidth(context, payload) {
            context.commit('setNavMinWidth', payload);
        },

        setCreatingMaze(context, payload) {
            context.commit('setCreatingMaze', payload);
        },

    }
});