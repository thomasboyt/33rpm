import c from '../constants';

var Label = function(game, opts) {
  this.center = opts.record.center;
  this.paused = opts.paused;

  this.imageObj = new Image();
  this.imageObj.src = 'data/33rpm_1x.png';
  this.angle = 0;
};

Label.prototype.update = function(step) {
  if (!this.paused) {
    var overflow = 360;
    this.angle = (this.angle + (c.THIRTY_THREE_DEG * step)) % overflow;
  }
};

Label.prototype.draw = function(ctx) {
  ctx.drawImage(this.imageObj, this.center.x - this.imageObj.width / 2 + 0.5, this.center.y - this.imageObj.height / 2 + 0.5);
};

export default Label;
