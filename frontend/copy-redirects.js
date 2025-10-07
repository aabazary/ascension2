import { copyFileSync, existsSync } from 'fs';
import { join } from 'path';

const sourceFile = join(process.cwd(), 'public', '_redirects');
const destFile = join(process.cwd(), 'dist', '_redirects');

if (existsSync(sourceFile)) {
  copyFileSync(sourceFile, destFile);
  console.log('✅ _redirects file copied successfully');
} else {
  console.error('❌ _redirects file not found at:', sourceFile);
  process.exit(1);
}
