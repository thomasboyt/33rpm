import random from '../util/random';
import SpawnerMixin from './mixins/spawner_mixin';
import Enemy from './enemy';

var EnemySpawner = function(game) {
  this.game = game;

  this.spawnerSetup({
    spawnEntity: Enemy,
    startingSpawnOffset: 1200,
    spawnOffsetVariance: 0
  });
};

_.extend(EnemySpawner.prototype, SpawnerMixin);

EnemySpawner.prototype.update = function() {
  this.spawnerUpdate();

  if ( this.game.score > this._lastIncrease &&
       this.game.score % 5 === 0 &&
       this._baseSpawnOffset > 500 ) {
    this._baseSpawnOffset -= 100;
    this._lastIncrease = this.game.score;
  }
};

EnemySpawner.prototype.isIllegalSpawn = function(spawnLanes) {
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

EnemySpawner.prototype.spawn = function(lastSpawnOffset) {
  var lanes = [0, 1, 2, 3];
  var numToSpawn = random(2, 3);
  var spawnLanes = _.sample(lanes, numToSpawn);

  if ( lastSpawnOffset < 700 ) {
    if ( this.illegalSpawn(spawnLanes) ) {
      this.spawn(lastSpawnOffset);
      return;
    }
  }

  this.spawnForLanes(spawnLanes);
};

export default EnemySpawner;
