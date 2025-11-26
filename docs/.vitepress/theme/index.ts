import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';

import FlowCard from './component/FlowCard.vue';
import FlowCards from './component/FlowCards.vue';

import './style.css';

export default {
    extends: DefaultTheme,

    enhanceApp({app}) {
        app.component('FlowCard', FlowCard);
        app.component('FlowCards', FlowCards);
    }
} satisfies Theme;
