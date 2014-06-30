var UI = function(game) {
  this.game = game;

  this.muteImage = game.assets.images['mute'];
};

UI.prototype.draw = function(ctx) {
  ctx.fillStyle = 'black';
  ctx.font = '24px Helvetica, sans-serif';

  if ( this.game.fsm.is('playing') ) {
    this._drawScore(ctx);
    if ( this._showLevelNotification ) {
      this._drawLevelNotification(ctx);
    }

  } else if ( this.game.fsm.is('attract') ) {
    ctx.textAlign = 'left';
    ctx.fillText('33rpm', 20, 580);

    ctx.textAlign = 'center';
    ctx.fillText('[space] to start', 300, 580);

    if ( this.game._highScore ) {
      ctx.textAlign = 'right';
      var score = this.game._highScore;
      ctx.fillText('best: ' + score, 585, 580);
    }

  } else if ( this.game.fsm.is('dead') ) {
    ctx.textAlign = 'center';
    ctx.fillText('game over :( press [R] to restart', 300, 580);

    if ( this.game.score === this.game._highScore ) {
      ctx.textAlign = 'right';
      ctx.fillText('new best!', 585, 550);
    }

    this._drawScore(ctx);

  }

  this._drawMute(ctx);
};

UI.prototype._drawScore = function(ctx) {
  ctx.textAlign = 'right';
  var score = this.game.score !== undefined ? this.game.score + '' : '';
  ctx.fillText(score, 585, 580);
};

UI.prototype._drawMute = function(ctx) {
  if ( this.game.musicManager.isMuted() ) {
    ctx.drawImage(this.muteImage, 10, 545);
  }
};

UI.prototype._drawLevelNotification = function(ctx) {
  ctx.textAlign = 'center';
  ctx.fillText('level ' + this.game.level, 300, 580);
};

UI.prototype.displayLevelNotification = function(timeout) {
  this._showLevelNotification = true;

  setTimeout(function() {
    this._showLevelNotification = false;
  }.bind(this), timeout);
};

export default UI;
