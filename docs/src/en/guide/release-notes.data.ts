import { createMarkdownRenderer } from 'vitepress';
import homeychangelog from '../../../../.homeychangelog.json';

const config = (globalThis as any)['VITEPRESS_CONFIG'];
const md = await createMarkdownRenderer(config.srcDir, config.markdown, config.site.base, config.logger);

// return html from here -- do md.render(foo)

export default {
    load() {
        const changelog = Object.fromEntries(
            Object.entries(homeychangelog)
                .toSorted(([a], [b]) => b.localeCompare(a))
                .map(([version, changes]) => [version, changes.en])
        );

        const html = Object.entries(changelog)
            .map(([version, notes]) => `## ${version}\r\n\r\n${notes}`)
            .join('\r\n\r\n');

        return {
            changelog,
            html: md.render(html)
        };
    }
};
