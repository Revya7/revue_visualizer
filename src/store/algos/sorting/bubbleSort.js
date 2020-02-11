// if u wanna remove setTimeout u have to comment all the bgColor changes
function bubbleSort(arr, i, j = 0, noSwaps = true, options) {
  if(i <= 0 || options.started == false) { 
    options.resumes = {}
    options.paused = false;
    options.started = false;
    return;
  }

  if(j >= i-1) { 
    arr[i-1].bgColor = options.finished;
    if(noSwaps) {
      while(i-1 >= 0) {
        arr[i-1].bgColor = options.finished;
        i--;
      }
      options.resumes = {}
      options.paused = false;
      options.started = false;
      return;
    }
    return bubbleSort(arr, --i, 0, true, options);
  }

  arr[j].bgColor = options.comparing;
  arr[j+1].bgColor = options.comparing;

  if(options.paused) {
    options.resumes.i = i;
    options.resumes.j = j;
    return;
  }

  if(arr[j].height > arr[j+1].height){
    var temp = arr[j].height;
    arr[j].height = arr[j+1].height;
    arr[j+1].height = temp;
    noSwaps = false;         
  }
  
  setTimeout(() => {
    arr[j].bgColor = options.original;
    arr[j+1].bgColor = options.original;
    return bubbleSort(arr, i, ++j, noSwaps, options);  
  }, options.time)

}

module.exports = bubbleSort;