import c from '../constants';
import RecordMixin from '../record_mixin';

import Barrier from './barrier';
import Bullet from './bullet';
import Player from './player';

var Enemy = function(game, opts) {
  this.game = game;
  this.record = opts.record;

  this.lane = opts.lane;
  this.angleFromCenter = opts.angle * (Math.PI/180);

  this.size = {
    x: 20,
    y: 20
  };

  // hack that prevents collision detect with barrier right when spawned
  this.spawnImmunity = true;

  this.center = {};
  this.setPosition();
};

_.extend(Enemy.prototype, RecordMixin);

Enemy.prototype.update = function(step) {
  var overflow = 360 * (Math.PI/180);
  this.angleFromCenter = (this.angleFromCenter - (c.THIRTY_THREE * step)) % overflow;
  if ( this.angleFromCenter < -1 ) {
    this.spawnImmunity = false;
  }
  this.setPosition();
};

Enemy.prototype.draw = function(ctx) {
  ctx.fillStyle = 'red';

  // draw a triangle
  ctx.beginPath();
  ctx.arc(this.center.x, this.center.y, 10, 0, 360);
  ctx.fill();
  ctx.closePath();
};

Enemy.prototype.collision = function(other) {
  if ( other instanceof Player ) {
    this.game.fsm.died();
  } else if ( other instanceof Barrier ) {
    if ( !this.spawnImmunity ) {
      this.game.c.entities.destroy(this);
    }
  } else if ( other instanceof Bullet ) {
    this.game.c.entities.destroy(this);
    this.game.c.entities.destroy(other);
  }
};

export default Enemy;
