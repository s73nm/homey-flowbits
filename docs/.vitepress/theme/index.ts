import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';

import Flow from './component/Flow.vue';
import FlowCard from './component/FlowCard.vue';
import FlowCardExplainer from './component/FlowCardExplainer.vue';
import FlowCards from './component/FlowCards.vue';

import './style.css';

export default {
    extends: DefaultTheme,

    enhanceApp({app}) {
        app.component('Flow', Flow);
        app.component('FlowCard', FlowCard);
        app.component('FlowCardExplainer', FlowCardExplainer);
        app.component('FlowCards', FlowCards);
    }
} satisfies Theme;
