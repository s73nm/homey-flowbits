// @ts-nocheck

import { file } from 'bun';
import { join } from 'node:path';

const ROOT = '/Users/bas/Downloads/Assets/Font Awesome/fontawesome-pro-7.1.0-web';
const TARGET = join(__dirname, 'assets');

const metadataFile = join(ROOT, 'metadata/icons.json');
const metadata = await file(metadataFile).json();
const icons = Object.entries<any>(metadata);

const minified = icons
    .filter(([, icon]) => icon.label !== '00')
    .filter(([, icon]) => icon.styles.includes('duotone'))
    .filter(([, icon]) => !icon.search.terms.some(t => t.startsWith('Digit ')))
    .filter(([, icon]) => !icon.search.terms.includes('letter'))
    .map(([id, icon]) => [
        id,
        icon.label,
        String.fromCharCode(parseInt(icon.unicode, 16))
    ]);

await file(join(TARGET, 'icons.json')).write(JSON.stringify(minified));

console.log(`Done, ${minified.length} icons.`);
