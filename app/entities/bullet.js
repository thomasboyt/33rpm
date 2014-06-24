import c from '../constants';
import RecordMixin from '../record_mixin';

var Bullet = function(game, opts) {
  this.game = game;

  this.record = opts.record;
  this.lane = opts.lane;
  this.angleFromCenter = opts.angleFromCenter;

  this.size = {
    x: 15,
    y: 10
  };

  this.setPosition();
};

_.extend(Bullet.prototype, RecordMixin);

Bullet.prototype.update = function(step) {
  var overflow = 360 * (Math.PI/180);
  this.angleFromCenter = (this.angleFromCenter + (c.FORTY_FIVE * step)) % overflow;
  this.setPosition();
};

Bullet.prototype.draw = function(ctx) {
  ctx.fillStyle = 'pink';

  // draw a triangle
  ctx.beginPath();
  ctx.moveTo(this.center.x + this.size.x / 2, this.center.y);
  ctx.lineTo(this.center.x - this.size.x / 2, this.center.y + this.size.y / 2);
  ctx.lineTo(this.center.x - this.size.x / 2, this.center.y - this.size.y / 2);
  ctx.fill();
  ctx.closePath();
};

export default Bullet;
