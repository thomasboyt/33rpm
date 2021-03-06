import config from './config';

// Entities
import Barrier from './entities/barrier';
import Bullet from './entities/bullet';
import Enemy from './entities/enemy';
import Label from './entities/label';
import Player from './entities/player';
import Record from './entities/record';
import Target from './entities/target';

import UI from './entities/ui/ui';
import LoadingUI from './entities/ui/loading_ui';

import TargetSpawner from './entities/target_spawner';
import EnemySpawner from './entities/enemy_spawner';

// Assets
import AssetPreloader from './util/asset_preloader';

// Misc
import retinaFix from './util/retina_fix';
import MusicManager from './util/music_manager';


var Game = function() {
  this.c = new Coquette(this, 'canvas', 600, 600, 'silver');

  var score = localStorage.getItem('best');
  this._highScore = score !== null ? parseInt(score, 10) : 0;

  for ( var key in config ) {
    this[key] = config[key];
  }

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

  this.loadingUI = this.c.entities.create(LoadingUI, {});

  // ?mute: mute by default
  var defaultMuted = document.location.search.match(/mute/) !== null;

  // ?disablemusic: disable music manager entirely (no music + skip intro gap)
  var disableMusicManager = document.location.search.match(/disablemusic/) !== null;

  // ?godmode: god mode, duh
  this.godMode = document.location.search.match(/godmode/) !== null;

  this.preloader = new AssetPreloader(config.assets);

  this.preloader.load().then(function(assets) {
    this.assets = assets;
    var audio = this.assets.audio['mirrorball'];

    this.musicManager = new MusicManager({
      audio: audio,
      musicSettings: this.musicConfig,
      ctx: this.audioCtx,
      loadedCb: this.loaded.bind(this),
      muted: defaultMuted,
      disabled: disableMusicManager
    });
  }.bind(this));
};

Game.prototype.loaded = function() {
  this.c.entities.destroy(this.loadingUI);
  this.ui = this.c.entities.create(UI, {});
  this.fsm.loaded();  // enter attract mode
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

  if ( this.c.inputter.isPressed(this.c.inputter.M) ) {
    this.musicManager.toggleMute();
  }

};

Game.prototype.start = function() {
  if (this.barrier) {
    this.c.entities.destroy(this.barrier);
  }

  this.score = 0;
  this.label.angle = 0;
  this.label.start();

  this.player = this.c.entities.create(Player);
  this.barrier = this.c.entities.create(Barrier);

  this.level = 1;

  this.musicManager.start()
    .done(function() {
      this.enemySpawner = this.c.entities.create(EnemySpawner, {
        spawnOffset: this.barrierStartingSpawnOffset
      });

      this.targetSpawner = this.c.entities.create(TargetSpawner, {
        spawnOffset: this.targetStartingSpawnOffset
      });
    }.bind(this));
};

Game.prototype.nextLevel = function() {
  this.level += 1;

  var timeout = 3000;
  this.ui.displayLevelNotification(timeout);

  var step = (this.level - 1) * this.offsetStepPerLevel;

  this.enemySpawner.setSpawnOffset(this.barrierStartingSpawnOffset - step);
  this.targetSpawner.setSpawnOffset(this.targetStartingSpawnOffset - step);

  this.enemySpawner.updateSpawnSettingsForLevel(this.level);
};

Game.prototype.destroyAll = function(constructors) {
  constructors.forEach(function(constructor) {
    var items = this.c.entities.all(constructor);
    items.forEach(function(item) {
      this.c.entities.destroy(item);
    }.bind(this));
  }.bind(this));
};

Game.prototype.clearBoard = function() {
  this.c.entities.destroy(this.enemySpawner);
  this.c.entities.destroy(this.targetSpawner);
  this.destroyAll([Player, Enemy, Bullet, Target]);
};

Game.prototype.died = function() {
  this.clearBoard();
  this.label.stop();
  this.musicManager.stop();

  if ( this.score > this._highScore ) {
    this._highScore = this.score;
    localStorage.setItem('best', this.score);
  }
};


window.Game = Game;
