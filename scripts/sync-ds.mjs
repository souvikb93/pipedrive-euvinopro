// Copies the EuvinoPRO design system (../euvinopro-ds) into vendor/euvino-ds so the app builds
// on its own (Vercel, fresh clones). Run after changing the design system: npm run sync-ds
import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const app = fileURLToPath(new URL('..', import.meta.url));
const src = process.env.EUVINO_DS ?? `${app}/../euvinopro-ds`;
const dest = `${app}/vendor/euvino-ds`;
if (!existsSync(`${src}/src/ds/index.ts`)) throw new Error(`Design system not found at ${src}`);

rmSync(dest, { recursive: true, force: true });
mkdirSync(`${dest}/src`, { recursive: true });
cpSync(`${src}/src/ds`, `${dest}/src/ds`, { recursive: true });
cpSync(`${src}/src/styles`, `${dest}/src/styles`, { recursive: true });

const pkg = JSON.parse(readFileSync(`${src}/package.json`, 'utf8'));
writeFileSync(
  `${dest}/package.json`,
  JSON.stringify(
    {
      name: pkg.name,
      version: pkg.version,
      private: true,
      type: 'module',
      description: `${pkg.description} Vendored copy, do not edit: change ../euvinopro-ds and run npm run sync-ds.`,
      exports: pkg.exports,
      peerDependencies: pkg.peerDependencies,
      dependencies: pkg.dependencies,
    },
    null,
    2,
  ) + '\n',
);
console.log(`Synced @euvino/ds ${pkg.version} into vendor/euvino-ds`);
