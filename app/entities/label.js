import c from '../constants';

var Label = function(game, opts) {
  this.center = opts.record.center;
  this.paused = opts.paused;

  this.imageObj = new Image();
  // TODO: load retina when appropriate
  this.imageObj.src = 'data/33rpm_1x.png';
  this.angle = 0;

  this.rotSpeed = 0;
  this.rotSpeedMax = c.THIRTY_THREE_DEG;
  this.rotAccel = 0.6 / 1000;
  this.rotDeaccel = 0.3 / 1000;
};

// TODO: this is HELLA gross but I'm too fried to improve at the moment
Label.prototype.start = function() {
  this.accel = true;
  this.deaccel = false;
};

Label.prototype.stop = function() {
  this.accel = false;
  this.deaccel = true;
};

Label.prototype.update = function(step) {
  if ( this.accel ) {
    this.rotSpeed += this.rotAccel * step;
    if ( this.rotSpeed > this.rotSpeedMax ) {
      this.rotSpeed = this.rotSpeedMax;
      this.accel = false;
    }
  } else if ( this.deaccel ) {
    this.rotSpeed -= this.rotDeaccel * step;
    if ( this.rotSpeed < 0 ) {
      this.rotSpeed = 0;
      this.deaccel = false;
    }
  }

  this.angle = (this.angle + (this.rotSpeed * step)) % 360;
};

Label.prototype.draw = function(ctx) {
  ctx.drawImage(this.imageObj,
                // TODO: we do this calc here so that it'll Just Work once imageObj loads, but would
                // save perf if we just calc'd this once when imageObj loads and didn't draw
                // otherwise
                this.center.x - this.imageObj.width / 2 + 0.5,
                this.center.y - this.imageObj.height / 2 + 0.5);
};

export default Label;
