import random from '../util/random';
import SpawnerMixin from './mixins/spawner_mixin';
import Enemy from './enemy';

var EnemySpawner = function(game) {
  this.game = game;

  this.spawnerSetup({
    spawnEntity: Enemy,
    startingSpawnOffset: this.game.barrierStartingSpawnOffset,
    spawnOffsetVariance: this.game.barrierSpawnOffsetVariance
  });
};

_.extend(EnemySpawner.prototype, SpawnerMixin);

EnemySpawner.prototype.update = function() {
  this.spawnerUpdate();

  if ( this.game.score > this._lastIncrease &&
       this.game.score % this.game.speedUpPer === 0 &&
       this._baseSpawnOffset > this.game.barrierMinSpawnOffset ) {
    this._baseSpawnOffset -= 100;
    this._lastIncrease = this.game.score;
    console.log(this._baseSpawnOffset);
  }
};

EnemySpawner.prototype.spawn = function() {
  var lanes = [0, 1, 2, 3];
  var numToSpawn = random(1, 2);
  var spawnLanes = _.sample(lanes, numToSpawn);

  this.spawnForLanes(spawnLanes);
};

export default EnemySpawner;
