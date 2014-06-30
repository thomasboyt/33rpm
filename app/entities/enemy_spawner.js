import random from '../util/random';
import SpawnerMixin from './mixins/spawner_mixin';
import Enemy from './enemy';

var EnemySpawner = function(game, opts) {
  this.game = game;

  this.spawnerSetup({
    spawnEntity: Enemy,
    spawnOffset: opts.spawnOffset,
    spawnOffsetVariance: opts.spawnOffsetVariance
  });
};

_.extend(EnemySpawner.prototype, SpawnerMixin);

EnemySpawner.prototype.update = function() {
  this.spawnerUpdate();
};

EnemySpawner.prototype.spawn = function() {
  var lanes = [0, 1, 2, 3];
  var numToSpawn = random(1, 2);
  var spawnLanes = _.sample(lanes, numToSpawn);

  this.spawnForLanes(spawnLanes);
};

export default EnemySpawner;
