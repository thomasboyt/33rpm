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
import assetPreloader from './util/asset_preloader';
import assets from './assets';

// Misc
import retinaFix from './util/retina_fix';
import MusicManager from './util/music_manager';


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

  assetPreloader(assets, function(assets) {
    this.assets = assets;
    var audio = this.assets.audio['mirrorball'];

    this.musicManager = new MusicManager({
      audio: audio,
      segments: [38, 104],
      ctx: this.audioCtx,
      loadedCb: this.fsm.loaded.bind(this.fsm)
    });
  }.bind(this));
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

Game.prototype.start = function() {
  this.musicManager.playNextSegment();

  if (this.barrier) {
    this.c.entities.destroy(this.barrier);
  }

  this.score = 0;
  this.label.angle = 0;
  this.label.start();

  this.player = this.c.entities.create(Player);
  this.barrier = this.c.entities.create(Barrier);
  this.spawner = this.c.entities.create(Spawner);
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
  this.musicManager.stop();
};


window.Game = Game;
