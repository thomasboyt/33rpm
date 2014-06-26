var UI = function(game) {
  this.game = game;
};

UI.prototype.draw = function(ctx) {
  ctx.fillStyle = 'black';
  ctx.font = '24px Helvetica, sans-serif';

  if ( this.game.fsm.is('loading') ) {
    ctx.textAlign = 'center';
    ctx.fillText('loading...', 300, 300);
  } else if ( this.game.fsm.is('playing') ) {
    this.drawScore(ctx);
  } else if ( this.game.fsm.is('attract') ) {
    ctx.textAlign = 'center';
    ctx.fillText('[space] to start', 300, 580);
  } else if ( this.game.fsm.is('dead') ) {
    ctx.textAlign = 'center';
    ctx.fillText('game over :( press [R] to restart', 300, 580);
    this.drawScore(ctx);
  }
};

UI.prototype.drawScore = function(ctx) {
  ctx.textAlign = 'right';
  var score = this.game.score !== undefined ? this.game.score + '' : '';
  ctx.fillText(score, 585, 580);
};

export default UI;
