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

export default RecordMixin;
