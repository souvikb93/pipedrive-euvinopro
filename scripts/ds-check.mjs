// Runs the design-system checker (no raw values, no raw controls, only documented imports) on every source file.
import { readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve('src');
const files = [];
const walk = (dir) => {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|css)$/.test(n) && !n.endsWith('.d.ts')) files.push(p);
  }
};
walk(root);
let failed = 0;
for (const f of files) {
  try {
    execFileSync('npm', ['--prefix', '../euvinopro-ds', 'run', '-s', 'ds', '--', 'check', f], { stdio: 'pipe' });
  } catch (e) {
    failed++;
    process.stdout.write(`${f}\n${e.stdout}`);
  }
}
console.log(failed ? `${failed} of ${files.length} files have findings` : `ok: ${files.length} files`);
process.exit(failed ? 1 : 0);
