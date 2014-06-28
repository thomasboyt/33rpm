import Enemy from './enemy';

var Spawner = function(game) {
  this.game = game;
  this.record = game.record;
  this.barrier = game.barrier;

  this._spawnFrequency = 1200;

  this._lastSpawnTime = Date.now();
  this._active = true;
  this._lastIncrease = 0;
};

Spawner.prototype.update = function() {
  if ( this._active ) {
    var now = Date.now();
    if ( now > this._lastSpawnTime + this._spawnFrequency) {
      this._lastSpawnTime = now;
      this.spawn();
    }
  }

  if ( this.game.score > this._lastIncrease &&
       this.game.score % 5 === 0 &&
       this._spawnFrequency > 500 ) {
    this._spawnFrequency -= 100;
    this._lastIncrease = this.game.score;
    console.log(this._spawnFrequency);
  }
};

Spawner.prototype.spawn = function() {
  this.createRandomEntity(Enemy);
};

Spawner.prototype.createRandomEntity = function(Entity) {
  var lanesOpen = [0, 1, 2, 3];

  var numToSpawn = Math.floor(Math.random() * 3) + 1;

  for (var i = 0; i < numToSpawn; i++) {
    var lane = _.sample(lanesOpen, 1);
    lanesOpen = _.without(lanesOpen, lane);

    this.game.c.entities.create(Entity, {
      record: this.record,
      lane: lane,
      angle: this.barrier.angleFromCenter * (Math.PI/180)
    });
  }
};

export default Spawner;
