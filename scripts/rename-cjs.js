import { rename } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cjsDir = join(__dirname, '..', 'dist', 'cjs');

async function renameFiles() {
  try {
    await rename(join(cjsDir, 'index.js'), join(cjsDir, 'index.cjs'));
    console.log('Successfully renamed CJS files');
  } catch (error) {
    console.error('Error renaming files:', error);
    process.exit(1);
  }
}

renameFiles(); 