var Barrier = function(game, opts) {
  var record = this.record = opts.record;

  this.angleFromCenter = 0;

  this.size = {
    x: record.recordRadius - record.labelRadius,
    y: 2
  };

  this.center = {};
  var r = (this.record.labelRadius + this.record.recordRadius) / 2;
  this.center.x = record.center.x + r * Math.sin(this.angleFromCenter);
  this.center.y = record.center.y + r * Math.cos(this.angleFromCenter);
  this.angle = (-this.angleFromCenter) * (180/Math.PI) + 90;
};

Barrier.prototype.draw = function(ctx) {
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(this.center.x - this.size.x / 2, this.center.y - this.size.y / 2, this.size.x, this.size.y);
};

export default Barrier;
