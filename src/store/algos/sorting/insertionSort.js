
function insertionSort(arr, i = 1, j, currentVal = null, options) {
    if(i >= arr.length || options.started == false) {
        options.resumes = {}
        options.paused = false;
        options.started = false;
        if(i >= arr.length) {
            arr.forEach(column => {
                column.bgColor = options.finished;
            });
        }
        return;
    }
    
    if(currentVal === null) { currentVal = arr[i].height }
    arr[i].bgColor = options.special;

    if(j >= 0 && arr[j].height > currentVal) {
        arr[j].bgColor = options.comparing;
        arr[j+1].bgColor = options.comparing;
        if(options.paused) {
            options.resumes.i = i;
            options.resumes.j = j;
            options.resumes.currentVal = currentVal;
            return;
        }
        arr[j+1].height = arr[j].height;
        setTimeout(() => {
            arr[j].bgColor = options.original;
            arr[j+1].bgColor = options.original;
            return insertionSort(arr, i, --j, currentVal, options);
        }, options.time)
    } else {
        setTimeout(() => {
            arr[j+1].height = currentVal;
            arr[j+1].bgColor = options.finished;
            let newJ = i; // i++ - 1
            return insertionSort(arr, ++i, newJ, null, options);  
        }, options.time);
    }
  
  }


module.exports = insertionSort;