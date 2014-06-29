var LoadingUI = function(game) {
  this.game = game;
};

LoadingUI.prototype.draw = function(ctx) {
  ctx.fillStyle = 'black';
  ctx.font = '24px Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('loading...', 300, 300);

  // progress bar
  var width = 300;
  var height = 20;

  // hack: add 1 to represent the time it'll take to decode the music
  var numTotal = this.game.preloader.numTotal + 1;
  var numLoaded = this.game.preloader.numLoaded;

  var fillPercent = numLoaded / numTotal;
  var barWidth = width * fillPercent;

  ctx.strokeStyle = 'black';
  ctx.strokeRect(150, 320, width, height);
  ctx.fillRect(150, 320, barWidth, height);
};

export default LoadingUI;
