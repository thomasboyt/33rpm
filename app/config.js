var config = {

  assets: {
    images: {
      label: 'data/33rpm_1x.png',
      mute: 'data/mute_1x.png'
    },
    audio: {
      mirrorball: 'data/mirrorball.mp3'
    }
  },

  enemySpeedRad: 0.003456,
  labelSpeedRad: 0.003456,
  targetSpeedRad: 0.003456,
  bulletSpeedRad: 0.004712,

  barrierStartingSpawnOffset: 1200,
  barrierMinSpawnOffset: 700,

  targetStartingSpawnOffset: 2000,
  targetMinSpawnOffset: 1000,

  offsetStepPerLevel: 100,

  pointsPerLevel: 7,

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
