/*
# wr.js #
*wr.js is a weighted random implementation in Java Script based on wr.py*  
Copyright (c) 2012, Daniel Waardal 
All rights reserved.  
License: BSD


## Example ##

    var animal, data;
    data = [['cat', 60], ['dog', 30], ['bird', 10]]
    animal = wr(data)
    console.log(animal)
*/


export default function(data) {
  var count, pair, randomIndex, totalWeights, _i, _len;
  totalWeights = ((function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      pair = data[_i];
      _results.push(pair[1]);
    }
    return _results;
  })()).reduce(function(t, s) {
    return t + s;
  });
  randomIndex = Math.floor(Math.random() * totalWeights);
  count = 0;
  for (_i = 0, _len = data.length; _i < _len; _i++) {
    pair = data[_i];
    count = count + pair[1];
    if (count > randomIndex) {
      return pair[0];
    }
  }
}
