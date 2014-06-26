/**
 * This mixin is for any entity that exists within a single lane of the record.
 *
 * Properties:
 *   this.angleFromCenter - an angle, in Radians, from the center to rotate by
 *   this.lane - which lane of the record you're in
 */

var RecordMixin = {

  /**
   * Set center.x, center.y and angle of the entity based on angleFromCenter and which lane the
   * entitiy is in.
   *
   * Should be called within update()
   */
  setPosition: function() {
    if (!this.center) { this.center = {}; }

    var record = this.record;
    var laneOffset = record.recordRadius - (record.laneOffset * this.lane);

    // origin x/y
    var r = laneOffset - (record.laneOffset / 2);

    this.center.x = record.center.x + r * Math.sin(this.angleFromCenter);
    this.center.y = record.center.y + r * Math.cos(this.angleFromCenter);
    this.angle = -this.angleFromCenter * (180/Math.PI);
  },

  /**
   * Move the entity between lanes, given a direction (LANE_UP or LANE_DOWN), duration (in ms), and
   * a curve function generated from BezierEasing()
   */
  LANE_UP: 'up',
  LANE_DOWN: 'down',

  moveLaneWithEasingCurve: function(dir, duration, curve) {
    if ( dir !== this.LANE_UP && dir !== this.LANE_DOWN ) {
      throw new Error('please pass this.LANE_UP or this.LANE_DOWN for direction');
    }

    this._isMoving = true;
    this._direction = dir;
    this._previousLane = this.lane;
    this._startedMoving = Date.now();
    this._easingCurve = curve;
    this._movementDuration = duration;
  },

  /**
   * Handle updating the current lane based on the current lane movement speed.
   *
   * Should be called within update(), before setPosition()
   */
  handleLaneMovement: function() {
    if ( this._isMoving ) {
      var p = (Date.now() - this._startedMoving) / this._movementDuration;

      var dirMultiplier = this._direction === this.LANE_UP ? 1 : -1;
      if ( p > 1 ) {
        this.lane = this._previousLane + dirMultiplier *  1;
        this._isMoving = false;
      } else {
        this.lane = this._previousLane + dirMultiplier * this._easingCurve(p);
      }
    }
  }
};

export default RecordMixin;
