(function(global) {

  var THIRTY_THREE = 0.003456;  // http://www.wolframalpha.com/input/?i=33rpm+in+radians%2Fms
  var THIRTY_THREE_DEG = 0.198;  // http://www.wolframalpha.com/input/?i=33rpm+in+degrees%2Fms
  var FORTY_FIVE = 0.004712;  // http://www.wolframalpha.com/input/?i=45rpm+in+radians%2Fms

  var Game = function() {
    this.c = new Coquette(this, 'canvas', 600, 600, 'silver');

    var record = this.c.entities.create(Record, {});
    var label = this.c.entities.create(Label, {
      record: record
    });

    var player = this.c.entities.create(Player, {
      record: record
    });
    var barrier = this.c.entities.create(Barrier, {
      record: record
    });

    setInterval(function() {
      this.c.entities.create(Enemy, {
        record: record,
        lane: Math.floor(Math.random() * 4),
        angle: -320 * (Math.PI/180)
      });
    }.bind(this), 1000);

    this.score = 0;
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
    this.angleFromCenter = -300 * (Math.PI/180);

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
    this.angleFromCenter = opts.angle;

    this.size = {
      x: 20,
      y: 20
    };

    this.center = {};
    this.setPosition();
  };

  _.extend(Enemy.prototype, RecordMixin);

  Enemy.prototype.update = function(step) {
    var overflow = 360 * (Math.PI/180);
    this.angleFromCenter = (this.angleFromCenter - (THIRTY_THREE * step)) % overflow;
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

  Enemy.prototype.collision = function(other) {
    if ( other instanceof Player ) {
      console.log('DEADED');
    } else if ( other instanceof Barrier ) {
      this.game.c.entities.destroy(this);
    }
  };


  var Barrier = function(game, opts) {
    var record = this.record = opts.record;

    this.angleFromCenter = -310 * (Math.PI/180);

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

    this.imageObj = new Image();
    this.imageObj.src = '/data/33rpm_1x.png';
    this.angle = 0;
  };

  Label.prototype.update = function(step) {
    var overflow = 360;
    this.angle = (this.angle + (THIRTY_THREE_DEG * step)) % overflow;
  };

  Label.prototype.draw = function(ctx) {
    ctx.drawImage(this.imageObj, this.center.x - this.imageObj.width / 2, this.center.y - this.imageObj.height / 2);
  };

  global.Game = Game;
})(window);
