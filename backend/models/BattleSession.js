import mongoose from 'mongoose';

const battleSessionSchema = new mongoose.Schema({
  characterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character',
    required: true
  },
  tier: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  },
  battleType: {
    type: String,
    enum: ['minion', 'boss'],
    required: true
  },
  enemyHealth: {
    type: Number,
    required: true
  },
  characterHealth: {
    type: Number,
    required: true,
    default: 100
  },
  turn: {
    type: Number,
    required: true,
    default: 1
  },
  battleLog: [{
    turn: Number,
    spellType: String,
    spellResult: {
      hit: Boolean,
      damage: Number,
      crit: Boolean,
      message: String
    }
  }],
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600
  }
});

battleSessionSchema.index({ characterId: 1 });
battleSessionSchema.index({ active: 1 });

export default mongoose.model('BattleSession', battleSessionSchema);
