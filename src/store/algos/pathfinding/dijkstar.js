var PriorityQueue = require('../../ds/priorityQueue');
var Queue = require('../../ds/queue');

// Straighter lines, could in very rare cases be inaccurate and give one step longer path
function dijkstarAlgo(startNode, endNode, adjancencyList) {
    var queue = new Queue();
    var topQueue = new PriorityQueue();
    var botQueue = new PriorityQueue();
    var rightQueue = new PriorityQueue();
    var leftQueue = new PriorityQueue();
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

    while(queue.size > 0 || topQueue.values.length > 0 || botQueue.values.length > 0 || leftQueue.values.length > 0 || rightQueue.values.length > 0) {
        if(queue.size === 0) {
            map.push('chunk');
            while(rightQueue.values.length > 0) {
                queue.enqueue(rightQueue.dequeue().val);
            }
            while(leftQueue.values.length > 0) {
                queue.enqueue(leftQueue.dequeue().val);
            }
            while(botQueue.values.length > 0) {
                queue.enqueue(botQueue.dequeue().val);
            }

            while(topQueue.values.length > 0) {
                queue.enqueue(topQueue.dequeue().val);
            }
            continue;
        }

        smallest = queue.dequeue();
        if(adjancencyList[smallest].isWall && !adjancencyList[smallest].isEndNode && !adjancencyList[smallest].isStartNode) {
            continue;
        }
        
        // No need to dtoplicate in map make no sense to visualize twice
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

        let distFromStartToThis = distances[smallest] + 1;
        let topNeighbor = adjancencyList[smallest].neighbors.top;
        let botNeighbor = adjancencyList[smallest].neighbors.bot;
        let rightNeighbor = adjancencyList[smallest].neighbors.right;
        let leftNeighbor = adjancencyList[smallest].neighbors.left;
        
        if(topNeighbor) {
            if(distFromStartToThis < distances[topNeighbor]) {
                distances[topNeighbor] = distFromStartToThis;
                previous[topNeighbor] = smallest;
                topQueue.enqueue(topNeighbor, distFromStartToThis);
            }
        }
        if(rightNeighbor) {
            if(distFromStartToThis < distances[rightNeighbor]) {
                distances[rightNeighbor] = distFromStartToThis;
                previous[rightNeighbor] = smallest;
                rightQueue.enqueue(rightNeighbor, distFromStartToThis);
            }
        }
        if(leftNeighbor) {
            if(distFromStartToThis < distances[leftNeighbor]) {
                distances[leftNeighbor] = distFromStartToThis;
                previous[leftNeighbor] = smallest;
                leftQueue.enqueue(leftNeighbor, distFromStartToThis);
            }
        }
        if(botNeighbor) {
            if(distFromStartToThis < distances[botNeighbor]) {
                distances[botNeighbor] = distFromStartToThis;
                previous[botNeighbor] = smallest;
                botQueue.enqueue(botNeighbor, distFromStartToThis);
            }
        }

    }

    return {
        path: path.reverse(),
        map : map
    }
}

module.exports = dijkstarAlgo;