import SpawnerMixin from './mixins/spawner_mixin';
import Target from './target';

var TargetSpawner = function(game, opts) {
  this.game = game;

  this.spawnerSetup({
    spawnEntity: Target,
    spawnOffset: opts.spawnOffset,
    spawnOffsetVariance: opts.spawnOffsetVariance,
    immediate: true
  });
};

_.extend(TargetSpawner.prototype, SpawnerMixin);

TargetSpawner.prototype.update = function() {
  this.spawnerUpdate();
};

TargetSpawner.prototype.spawn = function() {
  var lanes = [0, 1, 2, 3];
  var spawnLanes = _.sample(lanes, 1);
  this.spawnForLanes(spawnLanes);
};

export default TargetSpawner;
