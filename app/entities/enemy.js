import RecordMixin from './mixins/record_mixin';

import Player from './player';

var Enemy = function(game, opts) {
  this.game = game;
  this.record = game.record;

  this.lane = opts.lane;
  this.angleFromCenter = opts.angle * (Math.PI/180);

  this.size = {
    y: this.record.laneOffset,
    x: 4
  };

  // hack that prevents collision detect with barrier right when spawned
  this.hitImmunity = true;

  this.center = {};
  this.setPosition();
};

_.extend(Enemy.prototype, RecordMixin);

var OVERFLOW = 360 * (Math.PI/180);

Enemy.prototype.update = function(step) {
  this.angleFromCenter = (this.angleFromCenter - (this.game.enemySpeedRad * step));

  if ( this.angleFromCenter < -1 ) {
    this.hitImmunity = false;
  }
  if ( this.angleFromCenter < -OVERFLOW ) {
    this.game.c.entities.destroy(this);
  }

  this.setPosition();
};

Enemy.prototype.draw = function(ctx) {
  ctx.fillStyle = 'pink';

  // draw an evil line
  ctx.beginPath();
  ctx.fillRect(this.center.x - this.size.x / 2,
               this.center.y - this.size.y / 2,
               this.size.x,
               this.size.y);
  ctx.fill();
  ctx.closePath();
};

Enemy.prototype.collision = function(other) {
  if ( other instanceof Player && ( !this.game.godMode )) {
    this.game.fsm.died();
  }
};

export default Enemy;
