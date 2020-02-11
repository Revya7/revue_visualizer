// pivot will be recursed, it will also take rightCount LeftCount prob left or right dir
// wont work like this, needs a special treatement

const swap = (arr, idx1, idx2) => {
    let temp = arr[idx1].height;
    arr[idx1].height = arr[idx2].height;
    arr[idx2].height = temp;
};

const Stack = require('../../ds/stack');
let stack = null;
let marked = [];

function pivot(arr, start = 0, end = arr.length - 1, options) {

    if(options.resumes.resuming) {
        right(arr, options.resumes.pivot, options.resumes.i, options.resumes.pivotIdx, options.resumes.rightCount, options.resumes.start, options.resumes.end, options);
        return;
    }
  
    let pivotIdx = Math.floor((start + end) / 2);
    let pivot = arr[pivotIdx].height;
    arr[pivotIdx].bgColor = options.special;
  
    right(arr, pivot, pivotIdx + 1, pivotIdx, 0, start, end, options);
    
}

function right(arr, pivot, i , pivotIdx, rightCount = 0, start, end, options) {

    if(options.started == false) {
        options.resumes = {}
        marked.forEach(id => {
            arr[id].bgColor = options.original;
        });
        marked = []
        options.paused = false;
        return;
    }

    if(options.resumes.resuming) {
        options.resumes.resuming = false;
        if(!options.resumes.skipRight) {
            i = options.resumes.i;
            pivotIdx = options.resumes.pivotIdx;
            pivot = options.resumes.pivot;
            rightCount = options.resumes.rightCount;
            start = options.resumes.start;
            end = options.resumes.end;
        } else {
            return left(arr, options.resumes.pivot, options.resumes.j, options.resumes.leftCount, options.resumes.newIdx, options.resumes.current, options.resumes.start, options.resumes.end, options);
        }
    }

    if(i > end) {
        // call left
        let newIdx = pivotIdx + rightCount;
        swap(arr, pivotIdx, newIdx);
        marked.forEach(id => {
            arr[id].bgColor = options.original;
        });
        arr[newIdx].bgColor = options.special;
        marked = []
        arr[pivotIdx].bgColor = options.original;
        return left(arr, pivot, pivotIdx - 1, 0, newIdx, newIdx, start, end, options);
    }

    arr[i].bgColor = options.comparing;

    if(options.paused) {
        options.resumes.i = i;
        options.resumes.pivotIdx = pivotIdx;
        options.resumes.pivot = pivot;
        options.resumes.rightCount = rightCount;
        options.resumes.start = start;
        options.resumes.end = end;
        options.resumes.skipRight = false;
        options.resumes.stack = stack;
        options.resumes.resuming = true;
        return
    }

    setTimeout(() => {
        arr[i].bgColor = options.original;
        if(pivot > arr[i].height) {
            rightCount++;
            swap(arr, pivotIdx + rightCount, i);
            arr[pivotIdx + rightCount].bgColor = options.marked;
            marked.push(pivotIdx + rightCount);
        }
        return right(arr, pivot, ++i, pivotIdx, rightCount, start, end, options);
    }, options.time)


}

function left(arr, pivot, j, leftCount, newIdx, current, start, end, options) {

    if(options.started == false) {
        options.resumes = {}
        marked.forEach(id => {
            arr[id].bgColor = options.original;
        });
        marked = []
        options.paused = false;
        return;
    }

    if(j < start) {
        // call quick sort
        let finalIdx = newIdx - leftCount;
        swap(arr, newIdx, finalIdx);
        marked.forEach(id => {
            if(id === finalIdx) return;
            arr[id].bgColor = options.original;
        });
        marked = [];
        arr[newIdx].bgColor = options.original;
        arr[finalIdx].bgColor = options.finished;
        // push these to a stack
        let nextLeft = {
            arr,
            start,
            end: finalIdx - 1,
            options
        }
        let nextRight = {
            arr,
            start: finalIdx + 1,
            end,
            options
        }
        stack.push(nextLeft);
        stack.push(nextRight);
        quickSort(arr, null, null, options);
        // quickSort(arr, finalIdx + 1, end, options);
        return;
    }

    arr[j].bgColor = options.comparing;

    if(options.paused) {
        options.resumes.j = j;
        options.resumes.pivot = pivot;
        options.resumes.leftCount = leftCount;
        options.resumes.start = start;
        options.resumes.end = end;
        options.resumes.newIdx = newIdx;
        options.resumes.current = current;
        options.resumes.skipRight = true;
        options.resumes.stack = stack;
        options.resumes.resuming = true;
        return
    }

    setTimeout(() => {
        arr[j].bgColor = options.original;
        if(pivot < arr[j].height) {
            leftCount++;
            current--;
            swap(arr, current, j);
            arr[current].bgColor = options.marked;
            marked.push(current);
        }
    
        return left(arr, pivot, --j, leftCount, newIdx, current, start, end, options);
    }, options.time);

}
  
  
function quickSort(arr, start = 0, end = arr.length -1, options, initiated) {
    if(initiated) {
        if(options.resumes.stack) {
            stack = options.resumes.stack;
        } else {
            stack = new Stack();
            marked = [];
        }
        pivot(arr, start, end, options);
        return;
    }

    let obj = stack.pop();
    if(obj.start < obj.end){
        return pivot(obj.arr, obj.start, obj.end, obj.options);
    }

    if(stack.size > 0) {
        quickSort(obj.arr, null, null, options);
    } else {
        options.resumes = {}
        options.paused = false;
        options.started = false;
        arr.forEach(column => {
            column.bgColor = options.finished;
        });
    }
}

module.exports = quickSort;

