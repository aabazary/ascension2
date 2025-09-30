# Ascension2 Testing Suite

This comprehensive testing suite covers all aspects of the Ascension2 game backend, including endpoint testing, battle success rate analysis, and game balance testing.

## Test Structure

### Basic Endpoint Tests
- **`auth.test.js`** - Authentication endpoints (register, login, me)
- **`characters.test.js`** - Character CRUD operations
- **`gathering.test.js`** - Gathering mini-game system
- **`upgrade.test.js`** - Equipment upgrade system

### Battle Analysis Tests
- **`battle-analysis.test.js`** - Battle success rate analysis and equipment upgrade calculations
- **`battle-simulation.test.js`** - Comprehensive battle simulations with different equipment tiers

## Running Tests

### Individual Test Suites
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:auth
npm run test:characters
npm run test:gathering
npm run test:upgrade
npm run test:battle

# Run with coverage
npm run test:coverage
```

### Battle Analysis
```bash
# Run battle analysis tests
npm run test:battle

# Run specific analysis
node tests/run-analysis.js battle-analysis
node tests/run-analysis.js battle-simulation
```

## Test Coverage

The tests cover:
- ✅ **Authentication**: Registration, login, token validation
- ✅ **Character Management**: CRUD operations, validation
- ✅ **Gathering System**: Skill-based mini-game, resource rewards
- ✅ **Upgrade System**: Equipment upgrades, resource requirements
- ✅ **Battle System**: Success rates, equipment impact, spell comparison
- ✅ **Game Balance**: Progression analysis, resource costs

## Battle Success Rate Analysis

The battle analysis tests provide detailed insights into:

### Minion Battles
- Win rates for different equipment tiers
- Average damage and turns needed
- Critical hit and miss rates
- Equipment impact on performance

### Boss Battles
- Higher difficulty analysis
- Equipment requirements for success
- Resource farming efficiency

### Equipment Upgrade Analysis
- Resource costs for each tier
- Total resources needed for progression
- Time estimation for upgrades

## Game Balance Testing

The tests help determine:
- **Success Rates**: How often players win battles at each tier
- **Resource Requirements**: How many battles needed for upgrades
- **Progression Time**: Estimated time to complete each tier
- **Equipment Impact**: How much equipment improves performance

## Sample Output

When running battle analysis tests, you'll see output like:

```
=== MINION BATTLE SIMULATION (Tier 0, No Equipment) ===
Enemy: Tier 0 Dragonling (50 HP, 5 DMG)
Blast - Win Rate: 45.2%, Avg Damage: 8.3, Avg Turns: 6.1
Nova - Win Rate: 38.7%, Avg Damage: 12.1, Avg Turns: 4.2
Bolt - Win Rate: 52.1%, Avg Damage: 7.8, Avg Turns: 6.4

=== EQUIPMENT UPGRADE ANALYSIS ===
Tier 0 -> 1 (1 infusions needed):
  Belt: 5 gathering resources
  Cloak: 5 gathering + 3 minion resources
  Ring: 5 gathering + 3 minion + 2 boss resources
```

## Configuration

Tests use:
- **Jest** for test framework
- **Supertest** for HTTP testing
- **MongoDB Memory Server** for database testing
- **In-memory database** for isolated tests

## Game Balance Recommendations

Based on test results, you can adjust:

1. **Battle Config** (`utils/battleConfig.js`):
   - Enemy health and damage
   - Spell damage and accuracy
   - Equipment bonuses

2. **Upgrade Config** (`utils/upgradeConfig.js`):
   - Resource costs per tier
   - Infusion requirements
   - Equipment requirements

3. **Gathering Config** (`utils/gatheringConfig.js`):
   - Success thresholds
   - Resource rewards
   - Difficulty progression

## Continuous Testing

Run tests regularly to ensure:
- Game balance remains fair
- New features don't break existing functionality
- Performance metrics stay within acceptable ranges
- Resource economy is balanced

This testing suite provides the data needed to fine-tune the game for optimal player experience!
