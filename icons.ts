import { copyFile } from 'node:fs/promises';
import modes from './assets/modes/known.json';

const ROOT = '/Users/bas/Downloads/Assets/Font Awesome/fontawesome-pro-7.1.0-web/svgs-full/duotone-regular';
const ICONS = modes
    .map(mode => mode.icon)
    .sort();

ICONS.push('lightbulb');
ICONS.push('lightbulb-on');
ICONS.push('headphones');
ICONS.push('music');
ICONS.push('music-note');
ICONS.push('tv-music');
ICONS.push('play');

for (const icon of ICONS) {
    const src = `${ROOT}/${icon}.svg`;
    const dst = `assets/icons/${icon}.svg`;

    // @ts-ignore
    await copyFile(src, dst);

    console.log(`Copied ${icon}`);
}
