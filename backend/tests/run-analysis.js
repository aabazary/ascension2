#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testSuites = {
  'auth': 'auth.test.js',
  'characters': 'characters.test.js',
  'gathering': 'gathering.test.js',
  'upgrade': 'upgrade.test.js',
  'battle-analysis': 'battle-analysis.test.js',
  'battle-simulation': 'battle-simulation.test.js',
  'all': '**/*.test.js'
};

const suite = process.argv[2] || 'all';

if (!testSuites[suite]) {
  console.log('Available test suites:');
  Object.keys(testSuites).forEach(key => {
    console.log(`  ${key}: ${testSuites[key]}`);
  });
  process.exit(1);
}

console.log(`Running test suite: ${suite}`);
console.log(`Test file: ${testSuites[suite]}`);
console.log('');

try {
  const command = `npx jest ${testSuites[suite]} --verbose`;
  execSync(command, { 
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  });
} catch (error) {
  console.error('Test execution failed:', error.message);
  process.exit(1);
}
