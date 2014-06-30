import wrChoice from '../util/wr';
import SpawnerMixin from './mixins/spawner_mixin';
import Enemy from './enemy';

var EnemySpawner = function(game, opts) {
  this.game = game;

  this.spawnerSetup({
    spawnEntity: Enemy,
    spawnOffset: opts.spawnOffset,
    spawnOffsetVariance: opts.spawnOffsetVariance
  });

  this.spawnWeights = [
    ['1', 10],
    ['2', 0],
    ['3', 0]
  ];
};

_.extend(EnemySpawner.prototype, SpawnerMixin);

EnemySpawner.prototype.update = function() {
  this.spawnerUpdate();
};

EnemySpawner.prototype.updateSpawnSettingsForLevel = function(level) {
  // TODO: nice way to configure this curve

  // for levels 2-6, increase chance of a double spawning by 2
  if ( level >= 2 && level <= 6 ) {
    this.spawnWeights[1][1] += 2;
  }

  // for levels 3-12, increase chance of a triple spawning by 1
  if ( level >= 3 && level <= 12 ) {
    this.spawnWeights[2][1] += 1;
  }
};

EnemySpawner.prototype.spawn = function() {
  var lanes = [0, 1, 2, 3];
  var numToSpawn = parseInt(wrChoice(this.spawnWeights), 10);
  var spawnLanes = _.sample(lanes, numToSpawn);
  this.spawnForLanes(spawnLanes);
};

export default EnemySpawner;
