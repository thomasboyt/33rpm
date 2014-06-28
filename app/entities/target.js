import c from '../constants';
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
  this.angleFromCenter = (this.angleFromCenter - (c.THIRTY_THREE * step)) % OVERFLOW;

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
      this.game.fsm.died();
    }

  } else if ( other instanceof Bullet ) {
    this.game.c.entities.destroy(this);
    this.game.c.entities.destroy(other);
    this.game.score += 1;
  }
};

export default Enemy;
