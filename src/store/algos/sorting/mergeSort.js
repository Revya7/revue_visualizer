
let columnsArr = null;
let options = null;
let map = [];

function animate(stepIdx = 0, x = 0, realIndex) {
    if(options.resumes.resuming) {
        options.resumes.resuming = false;
        stepIdx = options.resumes.stepIdx;
        x = options.resumes.x;
        realIndex = options.resumes.realIndex;
    }

    if(stepIdx >= map.length || !options.started) {
        options.resumes = {}
        options.paused = false;
        options.started = false;
        map = [];
        columnsArr = [];
        return; 
    }

    let step = map[stepIdx];
    if(x >= step.length) { return animate(++stepIdx);}
    if(realIndex === undefined) {
        realIndex = step[0];
        x++;
    }
    
    if(realIndex >= columnsArr.length) { 
        options.resumes = {}
        options.paused = false;
        options.started = false;
        map = [];
        columnsArr = [];
        return;     
    }

    let i = step[x];
    let j = step[++x];
    let newHeight = step[++x];
    columnsArr[i].bgColor = options.comparing;

    if(j !== null) {
        columnsArr[j].bgColor = options.comparing;
    }

    if(options.paused) {
        options.resumes.stepIdx = stepIdx;
        options.resumes.x = x-2;
        options.resumes.realIndex = realIndex;
        options.resumes.resuming = true;
        return;
    }
    
    setTimeout(() => {
        if(options.started) {
            columnsArr[i].bgColor = options.finished;
            if(j !== null) {
                columnsArr[j].bgColor = options.finished;
            }
        }

        columnsArr[realIndex].height = newHeight;
        return animate(stepIdx, ++x, ++realIndex);

    }, options.time);

}


function merge(arr1, arr2) {
    let result = []
    let step = []
    let i = 0;
    let j = 0;
    let realIndex = arr1[0].index;

    while(i < arr1.length && j < arr2.length) {
        if(arr1[i].index < realIndex) {
            realIndex = arr1[i].index;
        }

        step.push(arr1[i].index, arr2[j].index);
        if(arr1[i].height < arr2[j].height) {
            result.push({height: arr1[i].height, index: arr1[i].index});
            step.push(arr1[i].height);
            i++;
        } else {
            result.push({height: arr2[j].height, index: arr2[j].index});
            step.push(arr2[j].height);
            j++;
        }
    }

    // Filling the remaining elements if one of the array is bigger than the other
    while(i < arr1.length) {
        if(arr1[i].index < realIndex) {
            realIndex = arr1[i].index;
        }

        step.push(arr1[i].index, null, arr1[i].height);
        result.push({height: arr1[i].height, index: arr1[i].index});
        i++;
    }
    while(j < arr2.length) {
        step.push(arr2[j].index, null, arr2[j].height);
        result.push({height: arr2[j].height, index: arr2[j].index});
        j++;
    }
    
    step.unshift(realIndex);
    map.push(step);

    if(map.length === columnsArr.length-1 || map.length === columnsArr.length) {
        // animating
        return mergeSort(columnsArr, true, options, map);
    }

    return result;
}

function mergeSort(arr, initiate, opts, animationMap, resume) {
    if(initiate) {
        options = opts;
        if(animationMap) {
            if(!resume) {
                globalMap = animationMap;
            }
            return animate();
        }
        columnsArr = arr; 
        map = [];
    }
    if(arr.length <= 1) { return arr };
    let mid = Math.floor(arr.length / 2)
    let left = arr.slice(0, mid);
    let right = arr.slice(mid);
    return merge(mergeSort(left),mergeSort(right));
}

module.exports = mergeSort;
