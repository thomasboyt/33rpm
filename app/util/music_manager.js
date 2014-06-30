var q = require('q');

var MusicManager = function(opts) {
  this.disabled = opts.disabled;

  if ( this.disabled ) {
    this._playedIntro = true;
    opts.loadedCb();
    return;
  }

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
    this.volumeNode.gain.value = 0.5;
    this._isMuted = false;
  }

  this._playedIntro = false;

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

MusicManager.prototype._playIntro = function() {
  var dfd = q.defer();

  var src = this.ctx.createBufferSource();
  src.connect(this.volumeNode);
  src.buffer = this.buf;

  var intro = this.offsetsForLoop(this.musicSettings.intros[0]);
  src.loop = false;
  src.start(0, intro[0], intro[1]-intro[0]);

  src.onended = function() {
    dfd.resolve();
  };

  this.src = src;
  this._playedIntro = true;

  return dfd.promise;
};

MusicManager.prototype._playLoop = function(loop) {
  var src = this.ctx.createBufferSource();
  src.connect(this.volumeNode);
  src.buffer = this.buf;

  var offsets = this.offsetsForLoop(loop);

  src.loop = true;
  src.loopStart = offsets[0];
  src.loopEnd = offsets[1];
  src.start(0, offsets[0]);

  this.src = src;
};

MusicManager.prototype._playNextSegment = function() {
  this._playLoop(this.musicSettings.loops[this._currentLoopIdx]);
  this._currentLoopIdx += 1;
  if ( this._currentLoopIdx > this.musicSettings.loops.length - 1 ) {
    this._currentLoopIdx = 0;
  }
};

MusicManager.prototype.start = function() {
  if ( this.disabled ) {
    return q.resolve();
  }

  if ( this._playedIntro ){
    this._playNextSegment();
    return q.resolve();
  }

  var promise = this._playIntro();
  promise.done(this._playNextSegment.bind(this));
  return promise;
};

MusicManager.prototype.stop = function() {
  if ( this.disabled ) {
    return;
  }

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
