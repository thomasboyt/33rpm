// Entities
import Barrier from './entities/barrier';
import Bullet from './entities/bullet';
import Enemy from './entities/enemy';
import Label from './entities/label';
import Player from './entities/player';
import Record from './entities/record';
import Spawner from './entities/spawner';
import Target from './entities/target';
import UI from './entities/ui';

// Assets
import AssetPreloader from './util/asset_preloader';
import assets from './assets';

// Misc
import retinaFix from './util/retina_fix';


var Game = function() {
  this.c = new Coquette(this, 'canvas', 600, 600, 'silver');

  retinaFix(document.getElementById('canvas'));

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
};

Game.prototype.attract = function() {
  this.record = this.c.entities.create(Record, {});
  this.label = this.c.entities.create(Label, {
    record: this.record
  });
};

Game.prototype.update = function() {
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

Game.prototype.playMusic = function() {
  var song = this.songSrc;
  song.start();
};

Game.prototype.start = function() {
  this.playMusic();

  if (this.barrier) {
    this.c.entities.destroy(this.barrier);
  }

  this.score = 0;
  this.label.angle = 0;
  this.label.start();

  this.player = this.c.entities.create(Player, {
    record: this.record
  });
  this.barrier = this.c.entities.create(Barrier, {
    record: this.record
  });
  this.spawner = this.c.entities.create(Spawner, {
    record: this.record
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
  this.spawner.clear();
  this.label.stop();
};


window.Game = Game;
