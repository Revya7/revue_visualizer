Hosted on a friend's domain https://uplody.com/visualizer/

# Revue Visualizer

> Pathfinding and Sorting visualizer made using Vue.js

## Mode: Pathfinding
In the Pathfinding Mode, you can place a start point and a target point on the grid either by:
1) Holding the left mouse button on the starting point icon for example on the grid and drag it to the desired location.
2) Hovering over Place/Draw in the navbar and choosing Start Point allowing you to place it by left click anywhere on the grid.

You can remove the start point or the end point by left clicking on it without dragging, then place them again from Place/Draw.<br>

You can draw walls freely on the grid by selecting Wall from Place/Draw and holding left mouse button on the grid and hovering around.  
You can remove walls by holding left mouse button on placed wall on the grid and hovering around removing every wall you hover on.<br>

You can choose the algorithm you want to visualize by hovering on Algorithm: in the navbar and clicking the name of one of them, they are currently:
1) Djikstar's algorithm
2) A* algorithm
3) Jump point search algorithm

You can change some configurations for a specific algorithm by hovering over the arrow on the right of the algorithm's name while choosing it.
Configurations like:
1) Enabling/disabling diagonal move for the particular algorithm
2) Change the heuristics used for the algorithm (in A* and JPS)<br>

After choosing the algorithm you can hit Start Search to start visualizing.  
You will notice the "shutdown" icon on the right the start button becomes enabled, you can cancel the running search by clicking on it.  
Or you can pause it by clicking on the Pause button allowing to change the speed of visualization using the Speed: dropdown in the navbar.<br>

The grid will be locked while the search's visualization is on so in order to change the algorithm you want to visualize or draw/edit walls and points you need to cancel it first or wait until it's done.<br>

You can create a maze by selecting an algorithm from the Maze & Pattern dropdown in the navbar which will make a solvable random maze by drawing walls and visualizing the process.<br>

You can use the Clear dropdown in the navbar to either clear all walls, all paths (drawn as a result of a Search), or the entire board including start and end points.<br>

Lastly if you have drawn a map and want to share it or save it you can Export it using the Export button in the Place/Draw dropdown to copy an object to the clipboard, you can paste it in a .txt file to save it or share it with someone.  
Which, while it's copied to the clipboard can be used by clicking the Import button to redraw the map on the grid.<br>

## Mode: Sorting
Same as pathfinding, you can choose the sorting algorithm to visualize from the Algorithm: dropdown in the navbar.  
The algorithms are:
1) Bubble Sort
2) Insertion Sort
3) Selection Sort
4) Quick Sort
5) Merge Sort
<br>

Hit Start Sort button to begin visualizing, the red "shutdown" button to cancel a running sort allowing you to choose another algorithm, or the pause button to allow changing the visualization speed from the Speed: dropdown in the navbar.<br>

You can generate a new array (new columns) by clicking the Generate new Array button inside the Actions dropdown in the navbar.<br>

## Note
This project was inspired by a youtube video made by Clément Mihailescu.<br>

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

