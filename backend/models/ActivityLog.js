import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  characterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character',
    required: true
  },
  activityType: {
    type: String,
    enum: ['gathering', 'minion', 'boss'],
    required: true
  },
  tier: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  },
  success: {
    type: Boolean,
    required: true
  },
  resourcesGained: [{
    type: {
      type: String,
      enum: ['gathering', 'minion', 'boss'],
      required: true
    },
    tier: {
      type: Number,
      required: true,
      min: 0,
      max: 6
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  equipmentUsed: {
    ring: {
      tier: Number,
      infused: Boolean,
      infusionLevel: Number
    },
    cloak: {
      tier: Number,
      infused: Boolean,
      infusionLevel: Number
    },
    belt: {
      tier: Number,
      infused: Boolean,
      infusionLevel: Number
    }
  },
  battleDetails: {
    battleLog: [{
      turn: Number,
      spellType: String,
      spellResult: {
        hit: Boolean,
        damage: Number,
        critical: Boolean
      },
      tierLevel: Number
    }],
    finalEnemyHealth: {
      type: Number,
      default: 0
    },
    finalCharacterHealth: {
      type: Number,
      default: 0
    },
    spellsUsed: [{
      type: String,
      enum: ['blast', 'nova', 'bolt']
    }],
    damageDealt: {
      type: Number,
      default: 0
    },
    damageTaken: {
      type: Number,
      default: 0
    },
    criticalHits: {
      type: Number,
      default: 0
    },
    misses: {
      type: Number,
      default: 0
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number, // Time taken in seconds
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
activityLogSchema.index({ characterId: 1, timestamp: -1 });
activityLogSchema.index({ activityType: 1, tier: 1 });
activityLogSchema.index({ success: 1 });

// Virtual for activity duration in minutes
activityLogSchema.virtual('durationMinutes').get(function() {
  return Math.round(this.duration / 60 * 100) / 100;
});

export default mongoose.model('ActivityLog', activityLogSchema);
