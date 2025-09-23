import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  avatar: {
    type: String,
    default: 'default',
    enum: ['default', 'fire', 'water', 'earth', 'air', 'lightning', 'ice', 'shadow']
  },
  currentTier: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  equipment: {
    ring: {
      tier: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      infused: {
        type: Boolean,
        default: false
      },
      infusionLevel: {
        type: Number,
        default: 0,
        min: 0,
        max: 3
      }
    },
    cloak: {
      tier: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      infused: {
        type: Boolean,
        default: false
      },
      infusionLevel: {
        type: Number,
        default: 0,
        min: 0,
        max: 3
      }
    },
    belt: {
      tier: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      infused: {
        type: Boolean,
        default: false
      },
      infusionLevel: {
        type: Number,
        default: 0,
        min: 0,
        max: 3
      }
    }
  },
  resources: [{
    type: {
      type: String,
      enum: ['gathering', 'minion', 'boss'],
      required: true
    },
    tier: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  }],
  stats: {
    totalBattles: {
      type: Number,
      default: 0
    },
    totalGathers: {
      type: Number,
      default: 0
    },
    totalBosses: {
      type: Number,
      default: 0
    },
    wins: {
      type: Number,
      default: 0
    },
    losses: {
      type: Number,
      default: 0
    }
  },
  elementalProgress: {
    fire: { defeated: Boolean, tier: Number },
    water: { defeated: Boolean, tier: Number },
    earth: { defeated: Boolean, tier: Number },
    air: { defeated: Boolean, tier: Number },
    lightning: { defeated: Boolean, tier: Number },
    ice: { defeated: Boolean, tier: Number },
    shadow: { defeated: Boolean, tier: Number }
  },
  unlockedAvatars: [{
    type: String,
    enum: ['fire', 'water', 'earth', 'air', 'lightning', 'ice', 'shadow']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
characterSchema.index({ userId: 1 });
characterSchema.index({ currentTier: 1 });

// Virtual for success rate
characterSchema.virtual('successRate').get(function() {
  const total = this.stats.wins + this.stats.losses;
  return total > 0 ? (this.stats.wins / total) * 100 : 0;
});

// Method to get resource count by type and tier
characterSchema.methods.getResourceCount = function(type, tier) {
  const resource = this.resources.find(r => r.type === type && r.tier === tier);
  return resource ? resource.count : 0;
};

// Method to add resources
characterSchema.methods.addResource = function(type, tier, amount) {
  const resourceIndex = this.resources.findIndex(r => r.type === type && r.tier === tier);
  
  if (resourceIndex >= 0) {
    this.resources[resourceIndex].count += amount;
  } else {
    this.resources.push({ type, tier, count: amount });
  }
  
  return this.save();
};

// Method to spend resources
characterSchema.methods.spendResource = function(type, tier, amount) {
  const resourceIndex = this.resources.findIndex(r => r.type === type && r.tier === tier);
  
  if (resourceIndex >= 0 && this.resources[resourceIndex].count >= amount) {
    this.resources[resourceIndex].count -= amount;
    return this.save();
  }
  
  throw new Error('Insufficient resources');
};

export default mongoose.model('Character', characterSchema);
