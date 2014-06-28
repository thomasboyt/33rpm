var UI = function(game) {
  this.game = game;

  this.muteImage = game.assets.images['mute'];
};

UI.prototype.draw = function(ctx) {
  ctx.fillStyle = 'black';
  ctx.font = '24px Helvetica, sans-serif';

  if ( this.game.fsm.is('playing') ) {
    this.drawScore(ctx);
  } else if ( this.game.fsm.is('attract') ) {
    ctx.textAlign = 'center';
    ctx.fillText('[space] to start', 300, 580);
  } else if ( this.game.fsm.is('dead') ) {
    ctx.textAlign = 'center';
    ctx.fillText('game over :( press [R] to restart', 300, 580);
    this.drawScore(ctx);
  }

  this.drawMute(ctx);
};

UI.prototype.drawScore = function(ctx) {
  ctx.textAlign = 'right';
  var score = this.game.score !== undefined ? this.game.score + '' : '';
  ctx.fillText(score, 585, 580);
};

UI.prototype.drawMute = function(ctx) {
  if ( this.game.musicManager.isMuted() ) {
    ctx.drawImage(this.muteImage, 10, 545);
  }
};

export default UI;
