import RecordMixin from '../record_mixin';

import Bullet from './bullet';

var Player = function(game, opts) {
  this.game = game;
  this.record = opts.record;

  this.lane = 0;
  this.angleFromCenter = -310 * (Math.PI/180);

  this.size = {
    x: 20,
    y: this.record.laneOffset / 2
  };

  this.center = {};
  this.setPosition();
};

_.extend(Player.prototype, RecordMixin);

Player.prototype.update = function(step) {
  var inputter = this.game.c.inputter;

  if (inputter.isPressed(inputter.LEFT_ARROW) || inputter.isPressed(inputter.A)) {
    this.lane += 1;
    if (this.lane > 3) { this.lane = 3; }
  } else if (inputter.isPressed(inputter.RIGHT_ARROW) || inputter.isPressed(inputter.D)) {
    this.lane -= 1;
    if (this.lane < 0) { this.lane = 0; }
  } else if (inputter.isPressed(inputter.SPACE)) {
    this.shoot();
  }

  this.setPosition();
};

Player.prototype.draw = function(ctx) {
  ctx.fillStyle = 'limegreen';

  // draw a triangle
  ctx.beginPath();
  ctx.moveTo(this.center.x + this.size.x / 2, this.center.y);
  ctx.lineTo(this.center.x - this.size.x / 2, this.center.y + this.size.y / 2);
  ctx.lineTo(this.center.x - this.size.x / 2, this.center.y - this.size.y / 2);
  ctx.fill();
  ctx.closePath();
};

Player.prototype.shoot = function() {
  var bullet = this.game.c.entities.create(Bullet, {
    record: this.record,
    lane: this.lane,
    angleFromCenter: this.angleFromCenter + 5 * (Math.PI/180)
  });
};

export default Player;
