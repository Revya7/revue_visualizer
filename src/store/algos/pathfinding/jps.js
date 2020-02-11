var PriorityQueue = require('../../ds/priorityQueue');

var heuristics = require('./heuristics');

class jpsPoint {
    constructor(id, direction , g = 0, addDiagonal = false) {
        this.id = id;
        this.direction = direction;
        this.g = g;
        this.addDiagonal = addDiagonal
    }
}

var points = new PriorityQueue();
var mode = null;
var targetId = null;
var nodes = null;
var map = [];
var searchOver = false;

function verThenHor(dir1, dir2) {
    if(dir1 == 'left' || dir1 == 'right') {
        return [dir2, dir1]
    };

    return [dir1, dir2];
}

var diag = {
    topright: 'topRight',
    topleft: 'topLeft',
    botright: 'botRight',
    botleft: 'botLeft',
}

var oposite = {
    right: 'left',
    left: 'right',
    top: 'bot',
    bot: 'top',
}


function turnInfo(ver, hor, diagonalPoint) {
    let turn = {}
    let turn2 = {}
    turn.behind = nodes[diagonalPoint].neighbors[oposite[hor]];
    turn.facing = nodes[diagonalPoint].neighbors[ver];
    turn.turnPoint = nodes[diagonalPoint].neighbors[diag[ver + oposite[hor]]];
    turn.ver = ver;
    turn.hor = oposite[hor];

    
    turn2.behind = nodes[diagonalPoint].neighbors[oposite[ver]];
    turn2.facing = nodes[diagonalPoint].neighbors[hor];
    turn2.turnPoint = nodes[diagonalPoint].neighbors[diag[oposite[ver] + hor]];
    turn2.ver = oposite[ver];
    turn2.hor = hor;

    return [turn, turn2];
}

var fScores = {}
var parents = {}


var toCheckObj = {
    'right': ['top', 'bot', 'topRight', 'botRight'],
    'left': ['top', 'bot', 'topLeft', 'botLeft'],
    'top': ['left', 'right', 'topLeft', 'topRight'],
    'bot': ['left', 'right', 'botLeft', 'botRight'],
}

// the idea is handling all wall exceotions in these functions + all the kwa3
function straight(originId, dir = null,  g = 0) {

    // Nodes exist and not a wall?
    if(!nodes[originId] || nodes[originId].wall()) {
        return;
    }

    let nextId = nodes[originId].neighbors[dir];

    if(!nodes[nextId] || nodes[nextId].wall()) {
        return;
    }

    // Add the specific dir
    // f calculated for the next node but search start from the origin
    let f = g + 1 + heuristics[mode](nextId, targetId);
    points.enqueue(new jpsPoint(originId, dir, g), f);

}

function diagonal(originId, dir = [], g = 0) {

    // Nodes exist and not a wall?
    if(!nodes[originId] || nodes[originId].wall()) {
        return;

    }

    let ver = dir[0]; // ex top
    let hor = dir[1]; // ex right
    let diagonalDir = diag[ver + hor]; // ex topRight

    let verNode = nodes[nodes[originId].neighbors[ver]];
    let horNode = nodes[nodes[originId].neighbors[hor]];
    // Going to an empty space diagonally when both ver and hor are walls
    if(verNode && verNode.wall() && horNode && horNode.wall()) {
        return;
    }

    let diagonalPoint = nodes[originId].neighbors[diagonalDir];

    if(nodes[diagonalPoint] && !nodes[diagonalPoint].wall()) {

        parents[diagonalPoint] = originId;
        map.push(diagonalPoint);
        map.push('j');
        if(diagonalPoint == targetId) {
            searchOver = true;
        }

        straight(diagonalPoint, ver, g + Math.SQRT2);
        straight(diagonalPoint, hor, g + Math.SQRT2);

        // diagonal of diagonal, added to queue as prepared point for running diagonal on it and adding its straights, diagonal and ku3 if they exist
        let doubleDiagonalPoint = nodes[diagonalPoint].neighbors[diagonalDir];

        if(nodes[doubleDiagonalPoint] && !nodes[doubleDiagonalPoint].wall()) {
            let doubleDiagonalScore = g + Math.SQRT2*2 + heuristics[mode](doubleDiagonalPoint, targetId);
            if(fScores[doubleDiagonalPoint] && fScores[doubleDiagonalPoint] < doubleDiagonalScore) {
                return;
            }
            fScores[doubleDiagonalPoint] = doubleDiagonalScore;

            parents[doubleDiagonalPoint] = diagonalPoint;
            map.push(doubleDiagonalPoint);
            map.push('j');
            // When preparing u put the g of the point u'r willing to check its diagonal, so not Math.SQRT2*2
            points.enqueue(new jpsPoint(diagonalPoint, [ver, hor], g + Math.SQRT2, true), doubleDiagonalScore);
        }

        // the turn (ku3), 2 possible turns
        let turnArr = turnInfo(ver, hor, diagonalPoint);
        turnArr.forEach(turnObj => {
            let behind = turnObj.behind;
            let facing = turnObj.facing;
            let turnPoint = turnObj.turnPoint
            if(nodes[behind] && nodes[behind].wall() && nodes[turnPoint] && !nodes[turnPoint].wall() && nodes[facing] && !nodes[facing].wall()) {
                let turnScore =  g + Math.SQRT2*2 +  heuristics[mode](turnPoint, targetId);
                if(!fScores[turnPoint] || fScores[turnPoint] > turnScore) {
                    map.push(turnPoint);
                    map.push('j');
                    fScores[turnPoint] = turnScore;
                    parents[turnPoint] = diagonalPoint;
                    map.push(turnPoint);
                    map.push('j');
                    points.enqueue(new jpsPoint(diagonalPoint, [turnObj.ver, turnObj.hor], g + Math.SQRT2, true), turnScore);
                }
            }
        });

    }
}

function searchDone(pointId) {
    var path = [targetId]
    let p = targetId == pointId ? parents[pointId] : pointId;
    while(p) {
        path.push(p);
        p = parents[p];
    }

    return {
        path: path.reverse(),
        map: map
    }
}

function jps(firstNode , targetIdInit, nodesInit, modeInit, initiateSearch) {
    if(initiateSearch) {
        mode = modeInit;
        targetId = targetIdInit;
        nodes = nodesInit;
        points = new PriorityQueue();
        fScores = {}
        map = [];
        parents[firstNode] = null;
        searchOver = false;
        straight(firstNode, 'top');
        straight(firstNode, 'bot');
        straight(firstNode, 'right');
        straight(firstNode, 'left');
        diagonal(firstNode, ['top', 'right']);
        diagonal(firstNode, ['top', 'left']);
        diagonal(firstNode, ['bot', 'right']);
        diagonal(firstNode, ['bot', 'left']);
    }

    if(!points.values.length) {
        // No path found to the point, search over with no results
        return {
            path: [],
            map: map
        }
    }

    if(searchOver) {
        return searchDone(targetId);
    }

    var point = points.dequeue().val;

    if(point.id == targetId) {
        return searchDone(point.id);
    }

    map.push(point.id);
    map.push('v');

    if(point.addDiagonal) {
        diagonal(point.id, point.direction, point.g);
    }

    if(nodes[point.id].wall()) {
        return jps();
    }

    var nodeChecking = nodes[nodes[point.id].neighbors[point.direction]];
    var toCheck = toCheckObj[point.direction];
    var counter = 0;
    let found = false;

    while(nodeChecking && !nodeChecking.wall()) {
        counter++;
        // nodeChecking.isPath = true;
        map.push(nodeChecking.id);

        if(nodeChecking.id == targetId) {
            return searchDone(point.id);
        }

        let first = nodes[nodeChecking.neighbors[toCheck[0]]];
        let second = nodes[nodeChecking.neighbors[toCheck[1]]];
        let firstJumpingPotential = nodes[nodeChecking.neighbors[toCheck[2]]];
        let secondJumpingPotential = nodes[nodeChecking.neighbors[toCheck[3]]];
        let nextChecking = nodes[nodeChecking.neighbors[point.direction]];

        // maybe REFACTOR and make one function to deal with this duplicate code
        let thisScore = counter + point.g + heuristics[mode](nodeChecking.id, targetId);
        if(!fScores[nodeChecking.id] || fScores[nodeChecking.id] > thisScore) {
        

            checkForJumpPoints(first ,firstJumpingPotential, toCheck[0], point, nodeChecking, nextChecking, thisScore, counter);
            checkForJumpPoints(second ,secondJumpingPotential, toCheck[1], point, nodeChecking, nextChecking, thisScore, counter);

        }

        if(found) {
            return jps();
        } else {
            nodeChecking = nodes[nodeChecking.neighbors[point.direction]];
        }
    }

    return jps();

}

function checkForJumpPoints(node, potential, dir, point, nodeChecking, nextChecking, thisScore, counter) {
    if(node && node.wall()) {
        fScores[nodeChecking.id] = thisScore;
        if(potential && !potential.wall()) {
            map.push('j');
            found = true;
            parents[nodeChecking.id] = point.id;
            straight(nodeChecking.id, point.direction, counter + point.g);
            
            let diagonalScore = counter + point.g + Math.SQRT2 + heuristics[mode](potential.id, targetId);
            if((!fScores[potential.id] || fScores[potential.id] > diagonalScore) && !nextChecking.wall()) {
                fScores[potential.id] = diagonalScore;
                let result = verThenHor(dir, point.direction);
                if(potential.id == targetId) {
                    parents[potential.id] = nodeChecking.id;
                    parents[targetId] = potential.id;
                }
                points.enqueue(new jpsPoint(nodeChecking.id, [result[0], result[1]], counter + point.g, true), diagonalScore);
                map.push(potential.id);
                map.push('j');
            }
        }
    }
}


module.exports = jps;