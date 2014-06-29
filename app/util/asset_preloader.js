var q = require('q');

export default function(assetCfg) {
  /* jshint loopfunc: true */

  var dfd = q.defer();

  var assets = {
    'images': {},
    'audio': {}
  };

  var images = assetCfg.images;
  var audio = assetCfg.audio;

  var numTotal = Object.keys(images).length + Object.keys(audio).length;
  var numLoaded = 0;

  _.each(images, function(src, name) {
    var img = new Image();
    img.onload = onAssetLoaded;
    img.src = src;

    assets.images[name] = img;
  });

  _.each(audio, function(src, name) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', src, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function() {
      assets.audio[name] = xhr.response;
      onAssetLoaded();
    };

    xhr.send();
  });

  function onAssetLoaded() {
    numLoaded += 1;

    if ( numTotal === numLoaded ) {
      dfd.resolve(assets);
    }
  }

  return dfd.promise;
}
