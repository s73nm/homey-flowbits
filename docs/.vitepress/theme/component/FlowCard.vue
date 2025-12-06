<template>
    <svg
        v-if="!inFlow && connectorPath && connectorViewBox"
        xmlns="http://www.w3.org/2000/svg"
        height="100%"
        width="100%"
        :class="$style.flowCardConnectorSvg"
        :viewBox="connectorViewBox"
        style="position: absolute; top: 0; left: 0; overflow: visible; z-index: -1;">
        <path :d="connectorPath"/>
    </svg>

    <div
        :class="[className, inFlow && $style.flowCardInFlow]"
        :id="id"
        :style="{
            '--color': color,
            '--logo': logo ? `url(${logo})` : undefined
        }">
        <div
            v-if="type !== 'trigger'"
            :class="$style.flowCardConnectorStart"/>

        <template v-if="type === 'condition'">
            <div :class="$style.flowCardConnectorTrue"/>
            <div :class="$style.flowCardConnectorFalse"/>
        </template>

        <div
            v-else-if="type !== 'action'"
            :class="$style.flowCardConnectorContinue"/>

        <div :class="$style.flowCardIcon"/>

        <div :class="$style.flowCardApp">
            {{ app }}
        </div>

        <div :class="$style.flowCardContent">
            <slot/>
        </div>
    </div>
</template>

<script
    lang="ts"
    setup>
    import { inBrowser } from 'vitepress';
    import { computed, inject, ref, useCssModule, watch, watchEffect } from 'vue';
    import { IN_FLOW } from '../symbols';

    const {
        app = 'FlowBits',
        connectToId,
        id,
        type
    } = defineProps<{
        readonly app?: string;
        readonly color?: string;
        readonly connectToId?: string;
        readonly id?: string;
        readonly logo?: string;
        readonly type: 'action' | 'condition' | 'trigger';
    }>();

    const inFlow = inject(IN_FLOW);

    const $style = useCssModule();

    const connectorPath = ref<string | null>(null);
    const connectorViewBox = ref<string | null>(null);

    const className = computed(() => {
        if (type === 'action') {
            return $style.flowCardAction;
        } else if (type === 'condition') {
            return $style.flowCardCondition;
        } else {
            return $style.flowCardTrigger;
        }
    });

    const updateConnectorPath = () => {
        if (!connectToId || !id) {
            connectorPath.value = null;
            return;
        }

        const a = document.getElementById(id);
        const b = document.getElementById(connectToId);

        if (!a || !b) {
            connectorPath.value = null;
            return;
        }

        const isTrue = b.classList.contains($style.flowCardCondition.split(' ')[0]);

        const p = a?.parentElement!;
        const from = b.getBoundingClientRect();
        const to = a.getBoundingClientRect();
        const parent = p.getBoundingClientRect();

        // Convert to parent-relative coordinates
        const startX = from.right - parent.left;
        const startY = from.top + from.height / 2 - parent.top;
        const endX = to.left - parent.left;
        const endY = to.top + to.height / 2 - parent.top;

        const width = endX - startX;
        const height = endY - startY;
        const startYOffset = isTrue ? -12 : 0;

        let path: string;

        if (width > 0) {
            // Normal case: target is to the right
            const loopOut = 15;
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;

            const M = `M${startX},${startY + startYOffset}`;
            const C1 = `C${startX + loopOut},${startY + startYOffset} ${midX},${midY} ${midX},${midY}`;
            const C2 = `C${midX},${midY} ${endX - loopOut},${endY} ${endX},${endY}`;
            path = `${M} ${C1} ${C2}`;
        } else {
            // Backward case: target is to the left, curve around
            const loopOut = 60;
            const midY = endY - 54;

            const M = `M${startX},${startY + startYOffset}`;
            const C1 = `C${startX + loopOut},${startY + startYOffset} ${startX + loopOut},${midY} ${(startX + endX) / 2},${midY}`;
            const C2 = `C${endX - loopOut},${midY} ${endX - loopOut},${endY} ${endX},${endY}`;
            path = `${M} ${C1} ${C2}`;
        }

        connectorPath.value = path;
        connectorViewBox.value = `0 0 ${parent.width} ${parent.height}`;

        // const p = a?.parentElement!;
        // const from = b.getBoundingClientRect();
        // const to = a.getBoundingClientRect();
        // const parent = p.getBoundingClientRect();

        // const startX = from.right - parent.left;
        // const startY = from.top + from.height / 2 - parent.top;
        // const endX = to.left - parent.left;
        // const endY = to.top + to.height / 2 - parent.top;

        // Create curved path
        // const midX = (startX + endX) / 2;
        // const curve = Math.tos(endY - startY) * 0.5;
        //
        // connectorPath.value = `M ${startX} ${startY}
        //                        C ${startX + curve} ${startY},
        //                          ${endX - curve} ${endY},
        //                          ${endX} ${endY}`;
        //
        // connectorViewBox.value = `0 0 ${parent.width} ${parent.height}`;

        // export function makeConnectorPath(dimensions) {
        //     dimensions.height = dimensions.height + dimensions.offset;
        //
        //     const M = `M0, ${dimensions.offset}`;
        //     // C x1 y1, x2 y2, x y
        //     const C1 = `C ${dimensions.width * 0.25},${dimensions.offset} ${dimensions.width * 0.25},${
        //         dimensions.height
        //     } ${dimensions.width * 0.5},${dimensions.height}`;
        //     const C2 = `C ${dimensions.width * 0.75}, ${dimensions.height} ${dimensions.width * 0.75},${
        //         dimensions.offset
        //     } ${dimensions.width * 1},${dimensions.offset}`;
        //
        //     return `${M} ${C1} ${C2}`;
        // }

        // const isTrue = b.classList.contains($style.flowCardCondition.split(' ')[0]);
        //
        // const posa = {x: to.left - parent.left, y: to.top - parent.top + to.height / 2};
        // const posb = {x: from.right - parent.left, y: from.top - parent.top + from.height / 2 - (isTrue ? 12 : 0)};
        // const distx = window.innerWidth >= 768 ? (from.right > to.left ? 240 : (to.left - from.right) * 2) : 150;
        // const disty = window.innerWidth >= 768 ? (to.top > from.bottom ? 120 : 0) : 90;
        //
        // connectorPath.value = `M${posa.x},${posa.y} C${posa.x - distx},${posa.y - disty} ${posb.x + distx},${posb.y + disty} ${posb.x},${posb.y}`;
        // connectorViewBox.value = `0 0 ${parent.width} ${parent.height}`;
    };

    watch([() => connectToId, () => id], () => inBrowser && requestAnimationFrame(updateConnectorPath), {immediate: true});

    watchEffect((onCleanup) => {
        if (!inBrowser) {
            return;
        }

        window.addEventListener('resize', updateConnectorPath, {passive: true});
        onCleanup(() => window.removeEventListener('resize', updateConnectorPath));
    });
</script>

<style module>
    .flowCard {
        --color: var(--vp-c-brand-1);
        --connector-color: var(--vp-c-gray-3);
        --logo: url(/assets/logo-white.svg);

        position: relative;
        display: grid;
        padding: 12px;
        align-items: center;
        align-self: start;
        gap: 1px 12px;
        grid-template-columns: 48px 1fr;
        grid-template-rows: auto auto;
        background: var(--vp-c-bg);
        border: 1px solid var(--vp-c-gray-3);
        border-radius: 15px;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.035), 0 1px 4px rgba(0, 0, 0, 0.035);
        line-height: 1.4;
        z-index: 1;
    }

    :global(svg) + .flowCard .flowCardConnectorStart,
    .flowCard:has(+ :global(svg)) .flowCardConnectorContinue,
    .flowCard:has(+ :global(svg)) .flowCardConnectorTrue {
        --connector-color: var(--vp-c-brand-1);
    }

    .flowCardAction {
        composes: flowCard;
    }

    .flowCardCondition {
        composes: flowCard;
    }

    .flowCardTrigger {
        composes: flowCard;

        border-top-left-radius: 42px;
        border-bottom-left-radius: 42px;
    }

    .flowCardConnector {
        position: absolute;
        height: 18px;
        width: 9px;
        background: var(--vp-c-bg);
        border: 1px solid var(--vp-c-gray-3);
        border-radius: 9px;

        &::before {
            position: absolute;
            display: block;
            content: '';
            height: 6px;
            width: 6px;
            top: 5px;
            background: var(--connector-color);
            border-radius: 3px;
        }
    }

    .flowCardConnectorStart {
        composes: flowCardConnector;

        top: 50%;
        left: -9px;
        border-right: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        translate: 0 -50%;

        &::before {
            left: 5px;
        }
    }

    .flowCardConnectorContinue,
    .flowCardConnectorTrue,
    .flowCardConnectorFalse {
        composes: flowCardConnector;

        right: -9px;
        border-left: 0;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        translate: 0 -50%;

        &::before {
            right: 5px;
        }
    }

    .flowCardConnectorContinue {
        top: 50%;
    }

    .flowCardConnectorTrue {
        top: calc(50% - 12px);
    }

    .flowCardConnectorFalse {
        top: calc(50% + 12px);
    }

    .flowCardIcon {
        height: 48px;
        width: 48px;
        grid-column: 1;
        grid-row: 1 / span 2;
        background: var(--logo) no-repeat center center / 27px 27px var(--color);
        border-radius: 24px;
    }

    .flowCardApp {
        align-self: end;
        color: var(--vp-c-text-2);
        font-size: 12px;
    }

    .flowCardContent {
        align-self: start;
        font-size: 15px;
        font-weight: 500;

        :global(strong) {
            font-weight: 700;
        }
    }

    .flowCardConnectorSvg path {
        fill: none;
        stroke: var(--vp-c-gray-3);
        stroke-width: 3px;
    }

    .flowCardInFlow {
        align-self: unset;
        border-radius: 15px;
    }

    .flowCardInFlow .flowCardConnector {
        display: none;
    }
</style>
