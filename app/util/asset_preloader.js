var AssetPreloader = function(assets) {
  /* jshint loopfunc: true */

  this.assets = {
    'images': {},
    'audio': {}
  };

  var images = assets.images;
  var audio = assets.audio;

  this.numTotal = Object.keys(images).length + Object.keys(audio).length;
  this.numLoaded = 0;

  for ( var key in images ) {
    var img = new Image();
    img.onload = this._onAssetLoaded.bind(this);
    img.src = images[key];

    this.assets.images[key] = img;
  }

  for ( var key in audio ) {
    // IIFE to protect `xhr` from scoping shenangians
    (function() {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', audio[key], true);
      xhr.responseType = 'arraybuffer';

      xhr.onload = function() {
        this.assets.audio[key] = xhr.response;
        this._onAssetLoaded();
      }.bind(this);

      xhr.send();
    }.bind(this))();
  }
};

AssetPreloader.prototype._onAssetLoaded = function() {
  this.numLoaded += 1;

  if ( this.numTotal === this.numLoaded ) {
    this.onLoaded(this.assets);
  }
};

export default AssetPreloader;
