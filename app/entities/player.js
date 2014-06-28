import RecordMixin from './mixins/record_mixin';

import Bullet from './bullet';

var Player = function(game) {
  this.game = game;
  this.record = game.record;

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

var curve = BezierEasing(0.42, 0.0, 0.58, 1.0);

Player.prototype.update = function() {
  var inputter = this.game.c.inputter;

  if (inputter.isPressed(inputter.LEFT_ARROW) || inputter.isPressed(inputter.A)) {
    if ( this.lane < 3 ) {
      this.moveLaneWithEasingCurve(this.LANE_UP, 25, curve);
    }
  } else if (inputter.isPressed(inputter.RIGHT_ARROW) || inputter.isPressed(inputter.D)) {
    if ( this.lane > 0 ){
      this.moveLaneWithEasingCurve(this.LANE_DOWN, 25, curve);
    }
  }

  this.handleLaneMovement();
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

export default Player;
