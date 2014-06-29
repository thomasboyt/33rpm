var MusicManager = function(opts) {
  this.ctx = opts.ctx;

  this.musicSettings = opts.musicSettings;
  this._secondsPerBeat = 60 / this.musicSettings.bpm;
  this._currentLoopIdx = 0;

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

MusicManager.prototype.offsetsForLoop = function(loop) {
  return [
    this._secondsPerBeat * 4 * loop[0],
    this._secondsPerBeat * 4 * loop[1]
  ];
};

MusicManager.prototype.playNextSegment = function() {
  var src = this.ctx.createBufferSource();
  src.connect(this.volumeNode);
  src.buffer = this.buf;

  var offsets = this.offsetsForLoop(this.musicSettings.loops[this._currentLoopIdx]);

  src.loop = true;
  src.loopStart = offsets[0];
  src.loopEnd = offsets[1];
  src.start(0, offsets[0]);

  this._currentLoopIdx += 1;
  if ( this._currentLoopIdx > this.musicSettings.loops.length - 1 ) {
    this._currentLoopIdx = 0;
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
