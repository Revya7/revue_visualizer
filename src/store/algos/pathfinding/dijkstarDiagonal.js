var PriorityQueue = require('../../ds/priorityQueue');
var Queue = require('../../ds/queue');

// Straighter lines, could in very rare cases be inaccurate and give one step longer path
function dijkstarAlgo(startNode, endNode, adjancencyList) {
    var priorityQueue = new PriorityQueue();
    var queue = new Queue();
    var distances = {}
    var previous = {}
    var path = [];
    var map = [];
    var alreadyVisited = {}
    let smallest;

    for(var node in adjancencyList) {
        if(node === startNode) {
            distances[node] = 0;
            queue.enqueue(node);
        } else {
            distances[node] = Infinity;
        }

        previous[node] = null;
    }

    while(queue.size > 0 || priorityQueue.values.length > 0) {
        if(queue.size === 0) {
            map.push('chunk');
            while(priorityQueue.values.length > 0) {
                queue.enqueue(priorityQueue.dequeue().val);
            }
        }

        smallest = queue.dequeue();

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
            let distFromStartToThis = distances[smallest] + ((x - adjancencyList[o[neighbor]].x === 0 || y - adjancencyList[o[neighbor]].y === 0) ? 1 : Math.SQRT2);
            if(distFromStartToThis < distances[o[neighbor]]) {
                distances[o[neighbor]] = distFromStartToThis;
                previous[o[neighbor]] = smallest;
                priorityQueue.enqueue(o[neighbor], distFromStartToThis);
            }
        }
    }

    return {
        path: path.reverse(),
        map : map
    }
}

module.exports = dijkstarAlgo;