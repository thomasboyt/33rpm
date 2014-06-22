(function(global) {
  var Game = function() {
    this.c = new Coquette(this, 'canvas', 600, 600, 'silver');

    var rotationSpeedDegrees = 0.198;  // http://www.wolframalpha.com/input/?i=33rpm+in+degrees%2Fms
    this.rotationSpeed = rotationSpeedDegrees * (Math.PI/180);  // canvas uses radians

    var record = this.c.entities.create(Record, {});
    var player = this.c.entities.create(Player, {
      record: record
    });
  };

  var Player = function(game, opts) {
    this.game = game;
    this.record = opts.record;

    this.lane = 0;
    this.angleFromCenter = 0;

    this.width = 20;
    this.height = this.record.laneOffset / 2;
  };

  Player.prototype.update = function(step) {
    var overflow = 360 * (Math.PI/180);
    this.angleFromCenter = (this.angleFromCenter + (this.game.rotationSpeed * step)) % overflow;

    var inputter = this.game.c.inputter;
    if (inputter.isPressed(inputter.RIGHT_ARROW)) {
      this.lane += 1;
      if (this.lane > 3) { this.lane = 3; }
    } else if (inputter.isPressed(inputter.LEFT_ARROW)) {
      this.lane -= 1;
      if (this.lane < 0) { this.lane = 0; }
    }
  };

  Player.prototype.draw = function(ctx) {
    ctx.fillStyle = 'green';
    ctx.beginPath();

    var record = this.record;
    var laneOffset = record.recordRadius - (record.laneOffset * this.lane);
    var x = record.centerX;
    var y = record.centerY + laneOffset - (record.laneOffset / 2);

    // rotate around origin point
    ctx.translate(record.centerX, record.centerY);
    ctx.rotate(this.angleFromCenter);
    ctx.translate(-record.centerX, -record.centerY);

    ctx.beginPath();
    ctx.moveTo(x - this.width / 2, y);
    ctx.lineTo(x + this.width / 2, y + this.height / 2);
    ctx.lineTo(x + this.width / 2, y - this.height / 2);
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
