var config = {

  enemySpeedRad: 0.003456,
  labelSpeedRad: 0.003456,
  targetSpeedRad: 0.003456,
  bulletSpeedRad: 0.004712,

  barrierStartingSpawnOffset: 1100,
  barrierSpawnOffsetVariance: 0,

  targetStartingSpawnOffset: 2000,
  targetSpawnOffsetVariance: 0,

  speedUpPer: 7,

  godMode: false,

  musicConfig: {
    bpm: 129,

    // only one of these is used for now, but I keep the rest around for funsies
    intros: [
      [20, 24],
      [52, 56],
      [92, 96]
    ],

    loops: [
      [24, 36],
      [96, 112],
      [112, 128]
    ]
  }

};

export default config;
