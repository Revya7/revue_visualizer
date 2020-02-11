// cut it horizontally not necessarly in half, has one random point to be a ma3bar and everything else is wall
// now u have 2 chambers
// verticale on each chamber
// repeat all for each chamber

var Stack = require('../../ds/stack');

var nodes = null;
var waypointsObj = null;
var stack = null;
var map = [];
var limit = 4;

// both included
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
        stack = new Stack();
        nodes = nodesInit;
        waypointsObj = {}
        map = [];
        let chamber = new Chamber(horStart, horEnd, verStart, verEnd);
        chamber.capsulate();
        stack.push(chamber);
    }

    if(!stack.size) {
        return map;
    }

    let chamber = stack.pop();

    if(chamber.horLength() > chamber.verLength()) {
        verticalDivision(chamber);
    } else {
        horizontalDivision(chamber);
    }

    return recursiveDivision();
}

function horizontalDivision(chamber) {
    if(chamber.verLength() > limit) {
        let midpoint = chamber.verMidPoint();
        let waypoint = randomInteger(chamber.horStart, chamber.horEnd);
        if(waypoint == chamber.horMidPoint() || waypoint > chamber.horEnd || waypoint < chamber.horStart) {
            let arr = [chamber.horStart+1, chamber.horEnd-1];
            waypoint = arr[randomInteger(0,1)];
        }
        waypointsObj[midpoint + '-' + waypoint] = true;
        // +1 cz we want the end to be a wall if it wasnt the waypoint ofc
        planWalls(chamber, 'h', chamber.horStart, false, midpoint, waypoint, chamber.horEnd+1);
        
        let topChamber = new Chamber(chamber.horStart, chamber.horEnd, chamber.verStart, midpoint-1);
        let botChamber = new Chamber(chamber.horStart, chamber.horEnd, midpoint+1, chamber.verEnd);

        stack.push(botChamber);
        stack.push(topChamber);
    }
}

function verticalDivision(chamber) {
    if(chamber.horLength() > limit) {
        let midpoint = chamber.horMidPoint();
        let waypoint = randomInteger(chamber.verStart, chamber.verEnd);
        if(waypoint == chamber.verMidPoint() || waypoint > chamber.verEnd || waypoint < chamber.verStart) {
            let arr = [chamber.verStart+1, chamber.verEnd-1];
            waypoint = arr[randomInteger(0,1)];
        }
        waypointsObj[waypoint + '-' + midpoint] = true;
        planWalls(chamber, 'v', chamber.verStart, false, midpoint, waypoint, chamber.verEnd+1);

        let leftChamber = new Chamber(chamber.horStart, midpoint-1, chamber.verStart, chamber.verEnd);
        let rightChamber = new Chamber(midpoint+1, chamber.horEnd, chamber.verStart, chamber.verEnd);
        stack.push(rightChamber);
        stack.push(leftChamber);
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
            if(waypointsObj[divisionPoint + '-' + (i-1)]) {
                i++;
            }
            if(waypointsObj[divisionPoint + '-' + endPoint]) {
                endPoint--;
            }
            while(i < endPoint) {
                if(i != waypoint) {
                    map.push(divisionPoint + '-' + i);
                }
                i++;
            }
            return;
        }

        if(dir == 'v') {
            if(waypointsObj[i-1 + '-' + divisionPoint]) {
                i++;
            }
            if(waypointsObj[endPoint + '-' + divisionPoint]) {
                endPoint--;
            }
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

module.exports = recursiveDivision;