import Enemy from './enemy';
import random from '../util/random';

var Spawner = function(game) {
  this.game = game;

  this._baseSpawnOffset = window.thirtyThree.startingSpawnOffset;
  this._nextSpawnOffset = this.getNextSpawn();

  this._lastSpawnTime = Date.now();
  this._active = true;
  this._lastIncrease = 0;

  this._lastSpawn = [];
};

Spawner.prototype.getNextSpawn = function() {
  var randomWindowSize = window.thirtyThree.spawnOffsetVarianceWindow;
  var negative = random(0, 1) === 1 ? 1 : -1;
  return this._baseSpawnOffset + random(0, randomWindowSize) * negative;
};

Spawner.prototype.update = function() {
  if ( this._active ) {
    var now = Date.now();
    if ( now > this._lastSpawnTime + this._nextSpawnOffset) {
      this.spawn(this._nextSpawnOffset);
      this._lastSpawnTime = now;
      this._nextSpawnOffset = this.getNextSpawn();
    }
  }

  if ( this.game.score > this._lastIncrease &&
       this.game.score % 5 === 0 &&
       this._baseSpawnOffset > 500 ) {
    this._baseSpawnOffset -= 100;
    this._lastIncrease = this.game.score;
  }
};

Spawner.prototype.illegalSpawn = function(spawnLanes) {
  // avoid creating the following pattern:
  // ---O
  // O---
  return (
    (
      _.intersection(spawnLanes, [1,2,3]).length === 3 &&
      _.intersection(this._lastSpawn, [0,1,2]).length === 3
    ) || (
      _.intersection(spawnLanes, [0,1,2]).length === 3 &&
      _.intersection(this._lastSpawn, [1,2,3]).length === 3
    )
  );

};

Spawner.prototype.spawn = function(lastSpawnOffset) {
  var lanes = [0, 1, 2, 3];
  var numToSpawn = random(2, 3);
  var spawnLanes = _.sample(lanes, numToSpawn);

  if ( lastSpawnOffset < 700 ) {
    if ( this.illegalSpawn(spawnLanes) ) {
      this.spawn(lastSpawnOffset);
      return;
    }
  }

  spawnLanes.forEach(function(lane) {
    this.game.c.entities.create(Enemy, {
      record: this.game.record,
      lane: lane,
      angle: this.game.barrier.angleFromCenter * (Math.PI/180)
    });
  }.bind(this));

  this._lastSpawn = spawnLanes;
};

export default Spawner;
