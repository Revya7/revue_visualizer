class QNode {
    constructor(value){
        this.value = value;
        this.next = null;
    }
}

class Queue {
    constructor(){
        this.first = null;
        this.last = null;
        this.size = 0;
    }
    enqueue(val){
        var newQNode = new QNode(val);
        if(!this.first){
            this.first = newQNode;
            this.last = newQNode;
        } else {
            this.last.next = newQNode;
            this.last = newQNode;
        }
        return ++this.size;
    }

    dequeue(){
        if(!this.first) return null;

        var temp = this.first;
        if(this.first === this.last) {
            this.last = null;
        }
        this.first = this.first.next;
        this.size--;
        return temp.value;
    }
}

module.exports = Queue;