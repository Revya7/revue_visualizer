// cut it horizontally not necessarly in half, has one random point to be a ma3bar and everything else is wall
// now u have 2 chambers
// verticale on each chamber
// repeat all for each chamber

var Queue = require('../../ds/queue');

var nodes = null;
var queue = null;
var map = [];
var limit = 3;

// min included, max excluded
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// horStart and verStart always the same
class Chamber {
    constructor(horStart, horEnd, verStart, verEnd) {
        this.horStart = horStart;
        this.horEnd = horEnd;
        this.verStart = verStart;
        this.verEnd = verEnd;
    }

    horLength() {
        return this.horEnd - this.horStart + 1;
    }

    verLength() {
        return this.verEnd - this.verStart + 1;
    }

    horMidPoint() {
        return Math.abs(Math.floor((this.horStart+this.horEnd)/2));
    }

    verMidPoint() {
        return Math.abs(Math.floor((this.verStart+this.verEnd)/2));
    }

    capsulate() {

        let chamber = { ...this }
        planWalls(chamber, 'h', 1, true);
        planWalls(chamber, 'v', 1, true);

        this.horStart++;
        this.verStart++;
        this.horEnd--;
        this.verEnd--;

    }
}

function recursiveDivision(horStart, horEnd, verStart, verEnd, nodesInit, initiated) {
    if(initiated) {
        queue = new Queue();
        nodes = nodesInit;
        map = [];
        let chamber = new Chamber(horStart, horEnd, verStart, verEnd);
        chamber.capsulate();
        queue.enqueue(chamber);
    }

    if(!queue.size) {
        for(let i = 0; i < map.length; i++) {
            nodes[map[i]].isWall = true;
        }

        return;
    }

    let chamber = queue.dequeue();

    let divisionPointH = randomInteger(chamber.verStart+2, chamber.verEnd-1);
    horizontalDivision(chamber, divisionPointH);

    let divisionPointV = randomInteger(chamber.horStart+2, chamber.horEnd-1);
    verticalDivision(chamber, divisionPointV, divisionPointH);

    let newTopLeftChamber = new Chamber(chamber.horStart, divisionPointV-1, chamber.verStart, divisionPointH-1);
    let newTopRightChamber = new Chamber(divisionPointV+1, chamber.horEnd, chamber.verStart, divisionPointH-1);
    let newBotLeftChamber = new Chamber(chamber.horStart, divisionPointV-1, divisionPointH+1,chamber.verEnd);
    let newBotRightChamber = new Chamber(divisionPointV+1, chamber.horEnd, divisionPointH+1,chamber.verEnd);

    // has to have if horlength or verlength
    if(newTopLeftChamber.horLength() > limit || newTopLeftChamber.verLength() > limit) {
        queue.enqueue(newTopLeftChamber);
    }
    
    if(newTopRightChamber.horLength() > limit || newTopRightChamber.verLength() > limit) {
        queue.enqueue(newTopRightChamber);
    }

    if(newBotLeftChamber.horLength() > limit || newBotLeftChamber.verLength() > limit) {
        queue.enqueue(newBotLeftChamber);
    }

    if(newBotRightChamber.horLength() > limit || newBotRightChamber.verLength() > limit) {
        queue.enqueue(newBotRightChamber);
    }

    recursiveDivision();
}

function horizontalDivision(chamber, divisionPoint) {
    if(chamber.verLength() > limit) {
        let midpoint = chamber.horMidPoint();

        if(chamber.verLength() < limit * 2) {
            let waypoint = randomInteger(chamber.horStart+1, chamber.horEnd);
            planWalls(chamber, 'h', chamber.horStart, false, divisionPoint, waypoint, chamber.horEnd+1);
            return;
        }
        
        // pick one from start to midpoint
        let firstWaypoint = randomInteger(chamber.horStart+1, midpoint);
        planWalls(chamber, 'h', chamber.horStart, false, divisionPoint, firstWaypoint, midpoint);
        
        // pick one from midpoint to end
        let secondWaypoint = randomInteger(midpoint, chamber.horEnd);
        planWalls(chamber, 'h', midpoint, false, divisionPoint, secondWaypoint, chamber.horEnd+1);
    
    }
}

function verticalDivision(chamber, divisionPoint, midpoint) {
    if(chamber.horLength() > limit) {
        // let midpoint = chamber.verMidPoint();

        if(chamber.horLength() < limit * 2) {
            let waypoint = randomInteger(chamber.verStart+1, chamber.verEnd);
            planWalls(chamber, 'v', chamber.verStart, false, divisionPoint, waypoint, chamber.verEnd+1);
            return;
        }
        
        // pick one from start to midpoint
        let firstWaypoint = randomInteger(chamber.verStart+1, midpoint);
        planWalls(chamber, 'v', chamber.verStart, false, divisionPoint, firstWaypoint, midpoint);
        
        // pick one from midpoint to end
        let secondWaypoint = randomInteger(midpoint, chamber.verEnd);
        planWalls(chamber, 'v', midpoint, false, divisionPoint, secondWaypoint, chamber.verEnd+1);

    }
}

function planWalls(chamber, dir, i, capsulate, divisionPoint, waypoint, endPoint) {
    if(capsulate) {
        if(dir == 'h') {
            while(i <= chamber.horEnd) {
                map.push(chamber.horStart + '-' + i);
                map.push(chamber.verEnd + '-' + i);
                i++;
            }
            return;
        }
    
        if(dir == 'v') {
            while(i <= chamber.verEnd) {
                map.push(i + '-' + chamber.verStart);
                map.push(i + '-' + chamber.horEnd);
                i++;
            }
            return;
        }
    } else {
        if(dir == 'h') {
            while(i < endPoint) {
                if(i != waypoint) {
                    map.push(divisionPoint + '-' + i);
                }
                i++;
            }
            return;
        }

        if(dir == 'v') {
            while(i < endPoint) {
                if(i != waypoint) {
                    map.push(i + '-' + divisionPoint);
                }
                i++;
            }
            return;
        }
    }
}

// waypoints blocked by the other division
// solution, let horizontal return a value which is maybe waypoint, feed it to vertical and make sure it's not it or something

module.exports = recursiveDivision;