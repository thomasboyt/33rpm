import RecordMixin from './mixins/record_mixin';

import Barrier from './barrier';
import Bullet from './bullet';

var Enemy = function(game, opts) {
  this.game = game;
  this.record = game.record;

  this.lane = opts.lane;
  this.angleFromCenter = opts.angle * (Math.PI/180);

  this.size = {
    x: 20,
    y: 20
  };

  // hack that prevents collision detect with barrier right when spawned
  this.hitImmunity = true;

  this.center = {};
  this.setPosition();
};

_.extend(Enemy.prototype, RecordMixin);

var OVERFLOW = 360 * (Math.PI/180);

Enemy.prototype.update = function(step) {
  this.angleFromCenter = (this.angleFromCenter - (this.game.targetSpeedRad * step)) % OVERFLOW;

  if ( this.angleFromCenter < -1 ) {
    this.hitImmunity = false;
  }

  this.handleLaneMovement();

  this.setPosition();
};

Enemy.prototype.draw = function(ctx) {
  ctx.fillStyle = 'skyblue';

  // draw a triangle
  ctx.beginPath();
  ctx.arc(this.center.x, this.center.y, 10, 0, 360);
  ctx.fill();
  ctx.closePath();
};

Enemy.prototype.collision = function(other) {

  if ( other instanceof Barrier ) {
    if ( !this.hitImmunity ) {
      if ( this.lane === 3 ) {
        this.game.c.entities.destroy(this);

        if ( !this.game.godMode ) {
          this.game.fsm.died();
        }
      } else {
        this.moveUpALane();
      }
    }

  } else if ( other instanceof Bullet ) {
    this.game.c.entities.destroy(this);
    this.game.c.entities.destroy(other);
    this.game.score += 1;
    this.game.player.resetFireThrottle();
  }
};

var curve = BezierEasing(0.42, 0.0, 0.58, 1.0);

Enemy.prototype.moveUpALane = function() {
  // continued hackery :|
  this.hitImmunity = true;
  this.moveLaneWithEasingCurve(this.LANE_UP, 200, curve);
};

export default Enemy;
