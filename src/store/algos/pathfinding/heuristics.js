var heuristicsObj = {
    Manhattan: function(pos0, pos1) {
        pos0 = pos0.split('-');
        pos1 = pos1.split('-');
        // [0] is x and [1] is y, cz the pos is a string like '3-8'
      var dx = Math.abs(pos1[0] - pos0[0]);
      var dy = Math.abs(pos1[1] - pos0[1]);
      return dx + dy;
    },
    Euclidean: function(pos0, pos1) {
        pos0 = pos0.split('-');
        pos1 = pos1.split('-');
        var dx = Math.abs(pos1[0] - pos0[0]);
        var dy = Math.abs(pos1[1] - pos0[1]);
        return Math.sqrt(dx * dx + dy * dy);
    },
    Chebyshev: function(pos0, pos1) {
        pos0 = pos0.split('-');
        pos1 = pos1.split('-');
        var dx = Math.abs(pos1[0] - pos0[0]);
        var dy = Math.abs(pos1[1] - pos0[1]);
        return Math.max(dx, dy);
    },
    // Octile: function(pos0, pos1) {
    //     pos0 = pos0.split('-');
    //     pos1 = pos1.split('-');
    //     var dx = Math.abs(pos1[0] - pos0[0]);
    //     var dy = Math.abs(pos1[1] - pos0[1]);
    //     return Math.max(dx, dy) + Math.min(dx, dy);
    // },
    // Diagonal: function(pos0, pos1) {
    //   var D = 1;
    //   var D2 = Math.sqrt(2);
    //   var d1 = Math.abs(pos1.x - pos0.x);
    //   var d2 = Math.abs(pos1.y - pos0.y);
    //   return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
    // }
}

module.exports = heuristicsObj;