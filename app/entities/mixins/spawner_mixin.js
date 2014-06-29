import random from '../../util/random';

var SpawnerMixin = {
  spawnerSetup: function(opts) {
    this._spawnType = opts.spawnEntity;
    this._baseSpawnOffset = opts.startingSpawnOffset;
    this._spawnOffsetVariance = opts.spawnOffsetVariance;

    this._nextSpawnOffset = this._getNextSpawn();

    this._lastSpawnTime = Date.now();
    this._active = true;
    this._lastIncrease = 0;

    this._laslastSpawnOffsettSpawnLanes = [];

    if ( opts.immediate ) {
      this.spawn(this._nextSpawnOffset);
    }
  },

  _getNextSpawn: function() {
    var randomWindowSize = this._spawnOffsetVariance;
    var negative = random(0, 1) === 1 ? 1 : -1;
    return this._baseSpawnOffset + random(0, randomWindowSize) * negative;
  },

  spawnerUpdate: function() {
    if ( this._active ) {
      var now = Date.now();
      if ( now > this._lastSpawnTime + this._nextSpawnOffset) {
        this.spawn(this._nextSpawnOffset);
        this._lastSpawnTime = now;
        this._nextSpawnOffset = this._getNextSpawn();
      }
    }
  },

  spawnForLanes: function(lanes) {
    lanes.forEach(function(lane) {
      this.game.c.entities.create(this._spawnType, {
        record: this.game.record,
        lane: lane,
        angle: this.game.barrier.angleFromCenter * (Math.PI/180)
      });
    }.bind(this));

    this._lastSpawnLanes = lanes;
  }

};

export default SpawnerMixin;
