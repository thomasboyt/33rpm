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

export default Record;
