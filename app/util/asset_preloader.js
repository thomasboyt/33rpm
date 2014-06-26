export default function(assetCfg, onLoadedCb) {
  /* jshint loopfunc: true */

  var assets = {
    'images': {},
    'audio': {}
  };

  var images = assetCfg.images;
  var audio = assetCfg.audio;

  var numTotal = Object.keys(images).length + Object.keys(audio).length;
  var numLoaded = 0;

  for ( var key in images ) {
    var img = new Image();
    img.onload = onAssetLoaded;
    img.src = images[key];

    assets.images[key] = img;
  }

  for ( var key in audio ) {
    // IIFE to protect `xhr` from scoping shenangians
    (function() {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', audio[key], true);
      xhr.responseType = 'arraybuffer';

      xhr.onload = function() {
        assets.audio[key] = xhr.response;
        onAssetLoaded();
      };

      xhr.send();
    })();
  }

  function onAssetLoaded() {
    numLoaded += 1;

    if ( numTotal === numLoaded ) {
      onLoadedCb(assets);
    }
  }

}
