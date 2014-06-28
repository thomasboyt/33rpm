var LoadingUI = function() {
};

LoadingUI.prototype.draw = function(ctx) {
  ctx.fillStyle = 'black';
  ctx.font = '24px Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('loading...', 300, 300);
};

export default LoadingUI;
