
function selectionSort(arr, i = 0, j, lowestIdx = null, options) {
    if(i >= arr.length || options.started == false) {
        options.resumes = {}
        options.paused = false;
        options.started = false;
        return;
    }
    
    if(lowestIdx === null) { lowestIdx = i }
    arr[i].bgColor = options.special;
    
    if(j < arr.length) {
        arr[j].bgColor = options.comparing;
        if(options.paused) {
            options.resumes.i = i;
            options.resumes.j = j;
            options.resumes.lowestIdx = lowestIdx;
            return;
        }

        if(arr[j].height < arr[lowestIdx].height) {
            arr[j].bgColor = options.marked;
            if(lowestIdx) {
                arr[lowestIdx].bgColor = options.original;
            }
            lowestIdx = j;
        }

        setTimeout(() => {
            lowestIdx == j ? arr[j].bgColor = options.marked : arr[j].bgColor = options.original;
            return selectionSort(arr, i, ++j, lowestIdx, options);
        }, options.time)

    } else {
        setTimeout(() => {
            if(lowestIdx !== i) {
                let temp = arr[i].height;
                arr[i].height = arr[lowestIdx].height;
                arr[lowestIdx].height = temp;
                arr[lowestIdx].bgColor = options.original;
            }
            
            arr[i].bgColor = options.finished;
            let newJ = i + 2; // i++ + 1
            return selectionSort(arr, ++i, newJ, null, options);  
        }, options.time);
    }
  
  }


module.exports = selectionSort;