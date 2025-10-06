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
    default: 'earth_mage',
    enum: ['earth_mage', 'fire_mage', 'water_mage', 'lightning_mage', 'ice_mage', 'shadow_mage']
  },
  currentTier: {
    type: Number,
    default: 0,
    min: 0,
    max: 6
  },
  equipment: {
    ring: {
      tier: {
        type: Number,
        default: 0,
        min: 0,
        max: 6
      },
      infused: {
        type: Boolean,
        default: false
      },
      infusionLevel: {
        type: Number,
        default: 0,
        min: 0,
        max: 18
      }
    },
    cloak: {
      tier: {
        type: Number,
        default: 0,
        min: 0,
        max: 6
      },
      infused: {
        type: Boolean,
        default: false
      },
      infusionLevel: {
        type: Number,
        default: 0,
        min: 0,
        max: 18
      }
    },
    belt: {
      tier: {
        type: Number,
        default: 0,
        min: 0,
        max: 6
      },
      infused: {
        type: Boolean,
        default: false
      },
      infusionLevel: {
        type: Number,
        default: 0,
        min: 0,
        max: 18
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
      max: 6
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
    masterKills: {
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

// Virtual for totalWins (alias for stats.wins)
characterSchema.virtual('stats.totalWins').get(function() {
  return this.stats.wins;
});

// Transform resources array to object format for frontend
characterSchema.methods.toJSON = function() {
  const obj = this.toObject({ virtuals: true });
  
  // Transform resources array to object format
  const resourcesObj = {
    gathering: {},
    minion: {},
    boss: {}
  };
  
  if (this.resources && Array.isArray(this.resources)) {
    this.resources.forEach(resource => {
      if (resourcesObj[resource.type]) {
        resourcesObj[resource.type][resource.tier] = resource.count;
      }
    });
  }
  
  obj.resources = resourcesObj;
  obj.stats.totalWins = this.stats.wins;
  
  return obj;
};

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

// Method to recalculate currentTier based on all equipment tiers
characterSchema.methods.recalculateCurrentTier = function() {
  if (!this.equipment) {
    this.currentTier = 0;
    return 0;
  }
  
  const allEquipmentTiers = Object.values(this.equipment).map(equip => equip.tier || 0);
  const minTier = Math.min(...allEquipmentTiers);
  this.currentTier = minTier;
  
  return this.currentTier;
};

export default mongoose.model('Character', characterSchema);
