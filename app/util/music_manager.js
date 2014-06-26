var MusicManager = function(opts) {
  this.ctx = opts.ctx;
  this.segmentOffsets = opts.segments;
  this.currentSegmentIdx = 0;

  this.ctx.decodeAudioData(opts.audio, function(buf) {
    this.buf = buf;

    opts.loadedCb();
  }.bind(this));
};

MusicManager.prototype.playNextSegment = function() {
  var src = this.ctx.createBufferSource();
  src.connect(this.ctx.destination);
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

export default MusicManager;
