import Enemy from './enemy';

var Spawner = function(game) {
  this.c = game.c;
  this.record = game.record;
  this.barrier = game.barrier;

  this.enemySpawnFrequency = 800;

  this._spawners = [];

  var enemySpawner = setInterval(function() {
    this.createRandomEntity(Enemy);
  }.bind(this), this.enemySpawnFrequency);

  this._spawners.push(enemySpawner);
};

Spawner.prototype.clear = function() {
  this._spawners.forEach(clearInterval);
};

Spawner.prototype.createRandomEntity = function(Entity) {
  var lanesOpen = [0, 1, 2, 3];

  var numToSpawn = Math.floor(Math.random() * 3) + 1;

  for (var i = 0; i < numToSpawn; i++) {
    var lane = _.sample(lanesOpen, 1);
    lanesOpen = _.without(lanesOpen, lane);

    this.c.entities.create(Entity, {
      record: this.record,
      lane: lane,
      angle: this.barrier.angleFromCenter * (Math.PI/180)
    });
  }
};

export default Spawner;
