import mongoose from 'mongoose';
import 'dotenv/config';
import User from './models/User.js';
import Character from './models/Character.js';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ascension2');
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    console.log('\nClearing existing data...');
    await User.deleteMany({});
    await Character.deleteMany({});
    console.log('✓ Cleared users and characters');

    // Create test users
    console.log('\nCreating test users...');
    
    const user1 = await User.create({
      username: 'highlevel',
      email: 'highlevel@test.com',
      password: 'password123',
      isEmailVerified: true
    });
    console.log('✓ Created user: highlevel');

    const user2 = await User.create({
      username: 'midlevel',
      email: 'midlevel@test.com',
      password: 'password123',
      isEmailVerified: true
    });
    console.log('✓ Created user: midlevel');

    const user3 = await User.create({
      username: 'beginner',
      email: 'beginner@test.com',
      password: 'password123',
      isEmailVerified: true
    });
    console.log('✓ Created user: beginner');

    // Helper function to create resources
    const createResources = (tier) => {
      const resources = [];
      // Add resources for each tier up to current tier
      for (let t = 0; t <= tier; t++) {
        resources.push(
          { type: 'gathering', tier: t, count: Math.floor(Math.random() * 50) + 20 },
          { type: 'minion', tier: t, count: Math.floor(Math.random() * 30) + 10 },
          { type: 'boss', tier: t, count: Math.floor(Math.random() * 20) + 5 }
        );
      }
      return resources;
    };

    // Helper function to create equipment
    const createEquipment = (tier) => {
      return {
        ring: {
          tier: tier,
          infused: tier >= 2,
          infusionLevel: tier >= 2 ? Math.min(tier - 1, 3) : 0
        },
        cloak: {
          tier: tier,
          infused: tier >= 2,
          infusionLevel: tier >= 2 ? Math.min(tier - 1, 3) : 0
        },
        belt: {
          tier: tier,
          infused: tier >= 2,
          infusionLevel: tier >= 2 ? Math.min(tier - 1, 3) : 0
        }
      };
    };

    console.log('\nCreating characters...');

    // High level user characters (Tiers 5, 4, 3)
    const char1 = await Character.create({
      userId: user1._id,
      name: 'DragonMaster',
      currentTier: 5,
      equipment: createEquipment(5),
      resources: createResources(5),
      stats: {
        totalBattles: 150,
        totalGathers: 200,
        totalBosses: 45,
        wins: 120,
        losses: 30
      }
    });
    user1.characters.push(char1._id);

    const char2 = await Character.create({
      userId: user1._id,
      name: 'ShadowLord',
      currentTier: 4,
      equipment: createEquipment(4),
      resources: createResources(4),
      stats: {
        totalBattles: 100,
        totalGathers: 150,
        totalBosses: 30,
        wins: 80,
        losses: 20
      }
    });
    user1.characters.push(char2._id);

    const char3 = await Character.create({
      userId: user1._id,
      name: 'FireKnight',
      currentTier: 3,
      equipment: createEquipment(3),
      resources: createResources(3),
      stats: {
        totalBattles: 60,
        totalGathers: 90,
        totalBosses: 15,
        wins: 45,
        losses: 15
      }
    });
    user1.characters.push(char3._id);
    
    await user1.save();
    console.log('✓ Created 3 characters for highlevel (Tiers 5, 4, 3)');

    // Mid level user characters (Tiers 2, 1)
    const char4 = await Character.create({
      userId: user2._id,
      name: 'IceMage',
      currentTier: 2,
      equipment: createEquipment(2),
      resources: createResources(2),
      stats: {
        totalBattles: 40,
        totalGathers: 60,
        totalBosses: 8,
        wins: 30,
        losses: 10
      }
    });
    user2.characters.push(char4._id);

    const char5 = await Character.create({
      userId: user2._id,
      name: 'StormCaller',
      currentTier: 1,
      equipment: createEquipment(1),
      resources: createResources(1),
      stats: {
        totalBattles: 20,
        totalGathers: 35,
        totalBosses: 3,
        wins: 15,
        losses: 5
      }
    });
    user2.characters.push(char5._id);

    const char6 = await Character.create({
      userId: user2._id,
      name: 'EarthWarden',
      currentTier: 2,
      equipment: createEquipment(2),
      resources: createResources(2),
      stats: {
        totalBattles: 35,
        totalGathers: 50,
        totalBosses: 6,
        wins: 25,
        losses: 10
      }
    });
    user2.characters.push(char6._id);

    await user2.save();
    console.log('✓ Created 3 characters for midlevel (Tiers 2, 1, 2)');

    // Beginner user characters (Tier 0)
    const char7 = await Character.create({
      userId: user3._id,
      name: 'Apprentice',
      currentTier: 0,
      equipment: createEquipment(0),
      resources: createResources(0),
      stats: {
        totalBattles: 5,
        totalGathers: 15,
        totalBosses: 0,
        wins: 3,
        losses: 2
      }
    });
    user3.characters.push(char7._id);

    const char8 = await Character.create({
      userId: user3._id,
      name: 'Novice',
      currentTier: 0,
      equipment: createEquipment(0),
      resources: createResources(0),
      stats: {
        totalBattles: 8,
        totalGathers: 20,
        totalBosses: 1,
        wins: 5,
        losses: 3
      }
    });
    user3.characters.push(char8._id);

    await user3.save();
    console.log('✓ Created 2 characters for beginner (Tier 0)');

    // Create one more advanced user with mixed tiers
    const user4 = await User.create({
      username: 'veteran',
      email: 'veteran@test.com',
      password: 'password123',
      isEmailVerified: true
    });

    const char9 = await Character.create({
      userId: user4._id,
      name: 'VeteranSlayer',
      currentTier: 5,
      equipment: createEquipment(5),
      resources: createResources(5),
      stats: {
        totalBattles: 200,
        totalGathers: 250,
        totalBosses: 60,
        wins: 170,
        losses: 30
      }
    });
    user4.characters.push(char9._id);

    const char10 = await Character.create({
      userId: user4._id,
      name: 'CasualAlt',
      currentTier: 1,
      equipment: createEquipment(1),
      resources: createResources(1),
      stats: {
        totalBattles: 15,
        totalGathers: 25,
        totalBosses: 2,
        wins: 10,
        losses: 5
      }
    });
    user4.characters.push(char10._id);

    await user4.save();
    console.log('✓ Created user: veteran with 2 characters (Tiers 5, 1)');

    console.log('\n========================================');
    console.log('✓ Seed completed successfully!');
    console.log('========================================\n');
    console.log('Test Accounts Created:');
    console.log('-----------------------------------');
    console.log('1. Email: highlevel@test.com');
    console.log('   Password: password123');
    console.log('   Characters: DragonMaster (T5), ShadowLord (T4), FireKnight (T3)');
    console.log('');
    console.log('2. Email: midlevel@test.com');
    console.log('   Password: password123');
    console.log('   Characters: IceMage (T2), StormCaller (T1), EarthWarden (T2)');
    console.log('');
    console.log('3. Email: beginner@test.com');
    console.log('   Password: password123');
    console.log('   Characters: Apprentice (T0), Novice (T0)');
    console.log('');
    console.log('4. Email: veteran@test.com');
    console.log('   Password: password123');
    console.log('   Characters: VeteranSlayer (T5), CasualAlt (T1)');
    console.log('========================================\n');

    await mongoose.connection.close();
    console.log('✓ Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('✗ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();

