import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const sourceFile = resolve(__dirname, '../src/shared/validation/fleet.schema.ts');
const targetDir = resolve(__dirname, '../../frontend/src/shared/schemas');
const targetFile = resolve(targetDir, 'fleet.ts');
const indexFile = resolve(targetDir, 'index.ts');

mkdirSync(targetDir, { recursive: true });
copyFileSync(sourceFile, targetFile);
writeFileSync(indexFile, "export * from './fleet';\n");
