import Barrier from './entities/barrier';
import Bullet from './entities/bullet';
import Enemy from './entities/enemy';
import Target from './entities/target';
import Label from './entities/label';
import Player from './entities/player';
import Record from './entities/record';
import UI from './entities/ui';

import assets from './assets';
import AssetPreloader from './asset_preloader';

var Game = function() {
  this.c = new Coquette(this, 'canvas', 600, 600, 'silver');

  this.retinaFix();

  this.audioCtx = new AudioContext();

  this.fsm = StateMachine.create({
    initial: 'loading',
    events: [
      { name: 'loaded', from: ['loading'], to: 'attract' },
      { name: 'start', from: ['attract', 'dead'], to: 'playing' },
      { name: 'died', from: 'playing', to: 'dead' },
      { name: 'pause', from: 'playing', to: 'paused' },
      { name: 'unpause', from: 'paused', to: 'playing' }
    ],
    callbacks: {
      onenterattract: this.attract.bind(this),
      onenterplaying: this.start.bind(this),
      ondied: this.died.bind(this),
      onenterstate: function(e, f, t) {
        console.log('event:', e, '; transition:', f, '=>', t);
      }
    }
  });

  this.c.entities.create(UI, {});

  var preloader = new AssetPreloader(assets);
  preloader.onLoaded = function(assets) {
    this.assets = assets;

    this.audioCtx.decodeAudioData(this.assets.audio['mirrorball'], function(buf) {
      var src = this.audioCtx.createBufferSource();
      src.connect(this.audioCtx.destination);
      src.buffer = buf;

      this.songSrc = src;

      this.fsm.loaded();
    }.bind(this));
  }.bind(this);

  this.enemySpawnFrequency = 1000;
  this.targetSpawnFrequency = 2000;
  this.targetSpawnOffset = 500;
};

Game.prototype.attract = function() {
  this.record = this.c.entities.create(Record, {});
  this.label = this.c.entities.create(Label, {
    record: this.record
  });

};

Game.prototype.update = function(dt) {
  if (this.fsm.is("attract")) {
    if (this.c.inputter.isPressed(this.c.inputter.SPACE)) {
      setTimeout(this.fsm.start.bind(this.fsm), 0);
    }
  } else if (this.fsm.is("dead")) {
    if (this.c.inputter.isPressed(this.c.inputter.R)) {
      setTimeout(this.fsm.start.bind(this.fsm), 0);
    }
  }
};

Game.prototype.start = function() {
  this.songSrc.noteOn(0);
  this.songSrc.playbackRate.value = 1;

  if (this.barrier) {
    this.c.entities.destroy(this.barrier);
  }

  this.score = 0;
  this.label.angle = 0;
  this.label.start();

  var player = this.c.entities.create(Player, {
    record: this.record
  });
  this.barrier = this.c.entities.create(Barrier, {
    record: this.record
  });

  this.createSpawners();
};

Game.prototype.createSpawners = function() {
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

Game.prototype.clearSpawners = function() {
  this._spawners.forEach(clearInterval);
};

Game.prototype.createRandomEntity = function(Entity) {
  this.c.entities.create(Entity, {
    record: this.record,
    lane: Math.floor(Math.random() * 4),
    angle: this.barrier.angleFromCenter * (Math.PI/180)
  });
};

Game.prototype.destroyAll = function() {
  [Player, Enemy, Bullet, Target].forEach(function(constructor) {
    var items = this.c.entities.all(constructor);
    items.forEach(function(item) {
      this.c.entities.destroy(item);
    }.bind(this));
  }.bind(this));
};

Game.prototype.died = function() {
  // pause action so you can see that you messed up
  this.destroyAll();
  this.clearSpawners();
  this.label.stop();
};

Game.prototype.retinaFix = function() {
  if ( window.devicePixelRatio ) {
    var canvas = document.getElementById('canvas');
    var prevWidth = canvas.width;
    var prevHeight = canvas.height;

    canvas.width = prevWidth * window.devicePixelRatio;
    canvas.height = prevHeight * window.devicePixelRatio;
    canvas.style.width = prevWidth;
    canvas.style.height = prevHeight;

    canvas.getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);
  }
};


window.Game = Game;
