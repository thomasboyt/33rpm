import SpawnerMixin from './mixins/spawner_mixin';
import Target from './target';

var TargetSpawner = function(game) {
  this.game = game;

  this.spawnerSetup({
    spawnEntity: Target,
    startingSpawnOffset: this.game.targetStartingSpawnOffset,
    spawnOffsetVariance: this.game.targetSpawnOffsetVariance
  });
};

_.extend(TargetSpawner.prototype, SpawnerMixin);

TargetSpawner.prototype.update = function() {
  this.spawnerUpdate();
};

TargetSpawner.prototype.spawn = function() {
  var lanes = [0, 1, 2];
  var spawnLanes = _.sample(lanes, 1);
  this.spawnForLanes(spawnLanes);
};

export default TargetSpawner;
