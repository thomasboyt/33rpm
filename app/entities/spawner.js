import Enemy from './enemy';
import Target from './target';

var Spawner = function(game, opts) {
  this.record = opts.record;

  this._spawners = [];

  var enemySpawner = setInterval(function() {
    this.createRandomEntity(Enemy);
  }.bind(this), this.targetSpawnFrequency);

  this._spawners.push(enemySpawner);

  setTimeout(function() {
    var targetSpawner = setInterval(function() {
      this.createRandomEntity(Target);
    }.bind(this), this.enemySpawnFrequency);

    this._spawners.push(targetSpawner);
  }.bind(this), this.targetSpawnOffset);
};

Spawner.prototype.clear = function() {
  this._spawners.forEach(clearInterval);
};

Spawner.prototype.createRandomEntity = function(Entity) {
  this.c.entities.create(Entity, {
    record: this.record,
    lane: Math.floor(Math.random() * 4),
    angle: this.barrier.angleFromCenter * (Math.PI/180)
  });
};

export default Spawner;
