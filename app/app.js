(function(global) {

  var degToRad = function(deg) {
    return deg * (Math.PI/180);
  };

  var radToDeg = function(rad) {
    return deg * (180/Math.PI);
  };

  var THIRTY_THREE = 0.003456;  // http://www.wolframalpha.com/input/?i=33rpm+in+radians%2Fms
  var THIRTY_THREE_DEG = 0.198;  // http://www.wolframalpha.com/input/?i=33rpm+in+degrees%2Fms
  var FORTY_FIVE = 0.004712;  // http://www.wolframalpha.com/input/?i=45rpm+in+radians%2Fms


  var Game = function() {
    this.c = new Coquette(this, 'canvas', 700, 600, 'silver');

    this.fsm = StateMachine.create({
      initial: 'attract',
      events: [
        { name: 'start', from: ['attract', 'dead'], to: 'playing' },
        { name: 'died', from: 'playing', to: 'dead' },
        { name: 'pause', from: 'playing', to: 'paused' },
        { name: 'unpause', from: 'paused', to: 'playing' }
      ],
      callbacks: {
        onenterplaying: this.start.bind(this),
        ondied: this.died.bind(this),
        onenterstate: function(e, f, t) {
          console.log('event:', e, '; transition:', f, '=>', t);
        }
      }
    });

    this.record = this.c.entities.create(Record, {});
    this.label = this.c.entities.create(Label, {
      record: this.record,
      paused: true
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
    if (this.barrier) {
      this.c.entities.destroy(this.barrier);
    }

    this.score = 0;
    this.label.paused = false;
    this.label.angle = 0;

    var player = this.c.entities.create(Player, {
      record: this.record
    });
    this.barrier = this.c.entities.create(Barrier, {
      record: this.record
    });

    this.spawner = setInterval(function() {
      this.c.entities.create(Enemy, {
        record: this.record,
        lane: Math.floor(Math.random() * 4),
        angle: this.barrier.angleFromCenter * (Math.PI/180)
      });
    }.bind(this), 1000);
  };

  Game.prototype.destroyAll = function() {
    [Player, Enemy, Bullet].forEach(function(constructor) {
      var items = this.c.entities.all(constructor);
      items.forEach(function(item) {
        this.c.entities.destroy(item);
      }.bind(this));
    }.bind(this));
  };

  Game.prototype.died = function() {
    // pause action so you can see that you messed up
    this.destroyAll();
    clearInterval(this.spawner);
    this.label.paused = true;
  };


  var RecordMixin = {
    setPosition: function() {
      if (!this.center) { this.center = {}; }

      var record = this.record;
      var laneOffset = record.recordRadius - (record.laneOffset * this.lane);

      // origin x/y
      var r = laneOffset - (record.laneOffset / 2);

      this.center.x = record.center.x + r * Math.sin(this.angleFromCenter);
      this.center.y = record.center.y + r * Math.cos(this.angleFromCenter);
      this.angle = -this.angleFromCenter * (180/Math.PI);
    }
  };


  var Player = function(game, opts) {
    this.game = game;
    this.record = opts.record;

    this.lane = 0;
    this.angleFromCenter = -310 * (Math.PI/180);

    this.size = {
      x: 20,
      y: this.record.laneOffset / 2
    };

    this.center = {};
    this.setPosition();
  };

  _.extend(Player.prototype, RecordMixin);

  Player.prototype.update = function(step) {
    var inputter = this.game.c.inputter;

    if (inputter.isPressed(inputter.LEFT_ARROW) || inputter.isPressed(inputter.A)) {
      this.lane += 1;
      if (this.lane > 3) { this.lane = 3; }
    } else if (inputter.isPressed(inputter.RIGHT_ARROW) || inputter.isPressed(inputter.D)) {
      this.lane -= 1;
      if (this.lane < 0) { this.lane = 0; }
    } else if (inputter.isPressed(inputter.SPACE)) {
      this.shoot();
    }

    this.setPosition();
  };

  Player.prototype.draw = function(ctx) {
    ctx.fillStyle = 'limegreen';

    // draw a triangle
    ctx.beginPath();
    ctx.moveTo(this.center.x + this.size.x / 2, this.center.y);
    ctx.lineTo(this.center.x - this.size.x / 2, this.center.y + this.size.y / 2);
    ctx.lineTo(this.center.x - this.size.x / 2, this.center.y - this.size.y / 2);
    ctx.fill();
    ctx.closePath();
  };

  Player.prototype.shoot = function() {
    var bullet = this.game.c.entities.create(Bullet, {
      record: this.record,
      lane: this.lane,
      angleFromCenter: this.angleFromCenter + 5 * (Math.PI/180)
    });
  };


  var Bullet = function(game, opts) {
    this.game = game;

    this.record = opts.record;
    this.lane = opts.lane;
    this.angleFromCenter = opts.angleFromCenter;

    this.size = {
      x: 15,
      y: 10
    };

    this.setPosition();
  };

  _.extend(Bullet.prototype, RecordMixin);

  Bullet.prototype.update = function(step) {
    var overflow = 360 * (Math.PI/180);
    this.angleFromCenter = (this.angleFromCenter + (FORTY_FIVE * step)) % overflow;
    this.setPosition();
  };

  Bullet.prototype.draw = function(ctx) {
    ctx.fillStyle = 'pink';

    // draw a triangle
    ctx.beginPath();
    ctx.moveTo(this.center.x + this.size.x / 2, this.center.y);
    ctx.lineTo(this.center.x - this.size.x / 2, this.center.y + this.size.y / 2);
    ctx.lineTo(this.center.x - this.size.x / 2, this.center.y - this.size.y / 2);
    ctx.fill();
    ctx.closePath();
  };

  Bullet.prototype.collision = function(other) {
    if ( other instanceof Enemy ) {
      this.game.c.entities.destroy(other);
      this.game.c.entities.destroy(this);
    } else if ( other instanceof Barrier ) {
      this.game.c.entities.destroy(this);
    }
  };


  var Enemy = function(game, opts) {
    this.game = game;
    this.record = opts.record;

    this.lane = opts.lane;
    this.angleFromCenter = degToRad(opts.angle);

    this.size = {
      x: 20,
      y: 20
    };

    // hack that prevents collision detect with barrier right when spawned
    this.spawnImmunity = true;

    this.center = {};
    this.setPosition();
  };

  _.extend(Enemy.prototype, RecordMixin);

  Enemy.prototype.update = function(step) {
    var overflow = 360 * (Math.PI/180);
    this.angleFromCenter = (this.angleFromCenter - (THIRTY_THREE * step)) % overflow;
    if ( this.angleFromCenter < -1 ) {
      this.spawnImmunity = false;
    }
    this.setPosition();
  };

  Enemy.prototype.draw = function(ctx) {
    ctx.fillStyle = 'red';

    // draw a triangle
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, 10, 0, 360);
    ctx.fill();
    ctx.closePath();
  };

  Enemy.prototype.collision = function(other, type) {
    if ( other instanceof Player ) {
      this.game.fsm.died();
    } else if ( other instanceof Barrier ) {
      if ( !this.spawnImmunity ) {
        this.game.c.entities.destroy(this);
      }
    }
  };


  var Barrier = function(game, opts) {
    var record = this.record = opts.record;

    this.angleFromCenter = 0;

    this.size = {
      x: record.recordRadius - record.labelRadius,
      y: 2
    };

    this.center = {};
    var r = (this.record.labelRadius + this.record.recordRadius) / 2;
    this.center.x = record.center.x + r * Math.sin(this.angleFromCenter);
    this.center.y = record.center.y + r * Math.cos(this.angleFromCenter);
    this.angle = (-this.angleFromCenter) * (180/Math.PI) + 90;
  };

  Barrier.prototype.draw = function(ctx) {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(this.center.x - this.size.x / 2, this.center.y - this.size.y / 2, this.size.x, this.size.y);
  };


  var Record = function(game, opts) {
    this.center = {
      x: 300,
      y: 300
    };

    this.recordRadius = 250;
    this.labelRadius = 83;
    this.laneOffset = (this.recordRadius - this.labelRadius) / 4;

    this.zindex = -1;
  };

  Record.prototype.draw = function(ctx) {
    var cx = this.center.x;
    var cy = this.center.y;

    // draw containing "record"
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(cx, cy, this.recordRadius, 0, 360);
    ctx.fill();
    ctx.closePath();

    // draw inner vinyl hole
    ctx.fillStyle = 'silver';
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, 360);
    ctx.fill();
    ctx.closePath();

    // draw lanes
    for (var i=1; i < 4; i++) {
      var radius = this.recordRadius - (this.laneOffset * i);
      ctx.strokeStyle = 'silver';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 360);
      ctx.stroke();
      ctx.closePath();
    }
  };


  var Label = function(game, opts) {
    this.center = opts.record.center;
    this.paused = opts.paused;

    this.imageObj = new Image();
    this.imageObj.src = 'data/33rpm_1x.png';
    this.angle = 0;
  };

  Label.prototype.update = function(step) {
    if (!this.paused) {
      var overflow = 360;
      this.angle = (this.angle + (THIRTY_THREE_DEG * step)) % overflow;
    }
  };

  Label.prototype.draw = function(ctx) {
    ctx.drawImage(this.imageObj, this.center.x - this.imageObj.width / 2 + 0.5, this.center.y - this.imageObj.height / 2 + 0.5);
  };

  global.Game = Game;
})(window);
