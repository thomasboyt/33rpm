(function(global) {
  var Game = function() {
    this.c = new Coquette(this, 'canvas', 600, 600, 'silver');

    var rotationSpeedDegrees = 0.198;  // http://www.wolframalpha.com/input/?i=33rpm+in+degrees%2Fms
    this.rotationSpeed = rotationSpeedDegrees * (Math.PI/180);  // canvas uses radians

    var record = this.c.entities.create(Record, {});
    var player = this.c.entities.create(Player, {
      record: record
    });

    var enemy = this.c.entities.create(Enemy, {
      record: record,
      lane: 1
    });

    this.score = 0;
  };

  var Player = function(game, opts) {
    this.game = game;
    this.record = opts.record;

    this.lane = 0;
    this.angleFromCenter = -320 * (Math.PI/180);

    this.size = {
      x: 20,
      y: this.record.laneOffset / 2
    };

    this.center = {};
    this.setPosition();
  };

  Player.prototype.update = function(step) {
    // var overflow = 360 * (Math.PI/180);
    // this.angleFromCenter = (this.angleFromCenter - (this.game.rotationSpeed * step)) % overflow;

    var inputter = this.game.c.inputter;

    if (inputter.isPressed(inputter.LEFT_ARROW) || inputter.isPressed(inputter.A)) {
      this.lane += 1;
      if (this.lane > 3) { this.lane = 3; }
    } else if (inputter.isPressed(inputter.RIGHT_ARROW) || inputter.isPressed(inputter.D)) {
      this.lane -= 1;
      if (this.lane < 0) { this.lane = 0; }
    }

    this.setPosition();
  };

  Player.prototype.setPosition = function() {
    var record = this.record;
    var laneOffset = record.recordRadius - (record.laneOffset * this.lane);

    // origin x/y
    var r = laneOffset - (record.laneOffset / 2);

    this.center.x = record.centerX + r * Math.sin(this.angleFromCenter);
    this.center.y = record.centerY + r * Math.cos(this.angleFromCenter);
    this.angle = -this.angleFromCenter * (180/Math.PI);
  };

  Player.prototype.draw = function(ctx) {
    ctx.fillStyle = 'limegreen';

    // draw a triangle
    ctx.beginPath();
    ctx.moveTo(this.center.x - this.size.x / 2, this.center.y);
    ctx.lineTo(this.center.x + this.size.x / 2, this.center.y + this.size.y / 2);
    ctx.lineTo(this.center.x + this.size.x / 2, this.center.y - this.size.y / 2);
    ctx.fill();
    ctx.closePath();
  };

  Player.prototype.collision = function(other) {
    console.log('bam');
  };

  var Enemy = function(game, opts) {
    this.game = game;
    this.record = opts.record;

    this.lane = opts.lane;
    this.angleFromCenter = 0;

    this.size = {
      x: 20,
      y: 20
    };

    this.center = {};
    this.setPosition();
  };

  Enemy.prototype.update = function(step) {
    var overflow = 360 * (Math.PI/180);
    this.angleFromCenter = (this.angleFromCenter + (this.game.rotationSpeed * step)) % overflow;
    this.setPosition();
  };

  Enemy.prototype.setPosition = function() {
    var record = this.record;
    var laneOffset = record.recordRadius - (record.laneOffset * this.lane);
    var r = laneOffset - (record.laneOffset / 2);

    this.center.x = record.centerX + r * Math.sin(this.angleFromCenter);
    this.center.y = record.centerY + r * Math.cos(this.angleFromCenter);
  };

  Enemy.prototype.draw = function(ctx) {
    ctx.fillStyle = 'red';

    // draw a triangle
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, 10, 0, 360);
    ctx.fill();
    ctx.closePath();
  };

  var Record = function(game, opts) {
    this.centerX = 300;
    this.centerY = 300;
    this.recordRadius = 250;
    this.labelRadius = 83;
    this.laneOffset = (this.recordRadius - this.labelRadius) / 4;

    this.zindex = -1;
  };

  Record.prototype.draw = function(ctx) {
    var cx = this.centerX;
    var cy = this.centerY;

    // draw containing "record"
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(cx, cy, this.recordRadius, 0, 360);
    ctx.fill();
    ctx.closePath();

    // draw inner label
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(cx, cy, this.labelRadius, 0, 360);
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

  global.Game = Game;
})(window);
