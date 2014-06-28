var MusicManager = function(opts) {
  this.ctx = opts.ctx;
  this.segmentOffsets = opts.segments;
  this.currentSegmentIdx = 0;

  this.volumeNode = this.ctx.createGain();
  this.volumeNode.connect(this.ctx.destination);

  if ( opts.muted ) {
    this.volumeNode.gain.value = 0;
    this._isMuted = true;
  } else {
    this.volumeNode.gain.value = 1;
    this._isMuted = false;
  }

  this.ctx.decodeAudioData(opts.audio, function(buf) {
    this.buf = buf;

    opts.loadedCb();
  }.bind(this));
};

MusicManager.prototype.playNextSegment = function() {
  var src = this.ctx.createBufferSource();
  src.connect(this.volumeNode);
  src.buffer = this.buf;

  src.start(0, this.segmentOffsets[this.currentSegmentIdx]);

  this.currentSegmentIdx += 1;
  if ( this.currentSegmentIdx > this.segmentOffsets.length - 1 ) {
    this.currentSegmentIdx = 0;
  }

  this.src = src;
};

MusicManager.prototype.stop = function() {
  this.src.stop();
};

MusicManager.prototype.toggleMute = function() {
  if ( this._isMuted ) {
    this.volumeNode.gain.value = 1;
    this._isMuted = false;
  } else {
    this.volumeNode.gain.value = 0;
    this._isMuted = true;
  }
};

MusicManager.prototype.isMuted = function() {
  return this._isMuted;
};

export default MusicManager;
