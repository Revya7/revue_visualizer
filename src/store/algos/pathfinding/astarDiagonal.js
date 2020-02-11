// Here instead of enqueing neighbors in a priority queue and get the one with lower distance, u enqueue them with an equation of distance + some heuristics d/2 here
var PriorityQueue = require('../../ds/priorityQueue');

var heuristics = require('./heuristics');

// function f(g, h) {
//     return g + h;
// }

function astar(startNode, endNode, adjancencyList, mode) {
    // g is distances in dijkstar
    // store f and h here instead of the nodes itself, just like g, key as the id, maybe pass the id as x and y and make them a string when u need to
    var fScores = new PriorityQueue();
    var g = {}
    var h = {}
    var previous = {}
    var path = [];
    var map = [];
    var alreadyVisited = {}
    let smallest;
    fScores.enqueue(startNode);

    for(var node in adjancencyList) {
        if(node === startNode) {
            g[node] = 0;
        } else {
            g[node] = Infinity;
        }

        previous[node] = null;
    }

    while(fScores.values.length > 0) {
        smallest = fScores.dequeue().val;
        if(adjancencyList[smallest].isWall && !adjancencyList[smallest].isEndNode && !adjancencyList[smallest].isStartNode) {
            continue;
        }
        
        // No need to duplicate in map make no sense to visualize twice
        if(!alreadyVisited[smallest]) {
            map.push(smallest);
            alreadyVisited[smallest] = true;
        }

        if(smallest === endNode) {
            // Done
            while(previous[smallest]) {
                path.push(smallest);
                smallest = previous[smallest];
            }

            path.push(startNode);
            break;
        }

        var o = adjancencyList[smallest].neighbors;
        var x = adjancencyList[smallest].x;
        var y = adjancencyList[smallest].y;

        for(var neighbor in o) {
            if(!adjancencyList[o[neighbor]]) continue;
            if(neighbor == 'topRight' && adjancencyList[o['top']].isWall && adjancencyList[o['right']].isWall) continue;
            if(neighbor == 'topLeft' && adjancencyList[o['top']].isWall && adjancencyList[o['left']].isWall) continue;
            if(neighbor == 'botRight' && adjancencyList[o['bot']].isWall && adjancencyList[o['right']].isWall) continue;
            if(neighbor == 'botLeft' && adjancencyList[o['bot']].isWall && adjancencyList[o['left']].isWall) continue;
            let distFromStartToThis = g[smallest] + ((x - adjancencyList[o[neighbor]].x === 0 || y - adjancencyList[o[neighbor]].y === 0) ? 1 : Math.SQRT2);
            if(!h[o[neighbor]]) {
                h[o[neighbor]] = heuristics[mode](o[neighbor], endNode);
            }

            if(distFromStartToThis < g[o[neighbor]]) {
                g[o[neighbor]] = distFromStartToThis;
                previous[o[neighbor]] = smallest;
                fScores.enqueue(o[neighbor], g[o[neighbor]] + h[o[neighbor]]);
            }
        }
    }

    return {
        path: path.reverse(),
        map : map
    }
}

module.exports = astar;