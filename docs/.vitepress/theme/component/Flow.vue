<template>
    <div :class="$style.flow">
        <template v-if="slots.when">
            <div :class="$style.flowTitle">When&hellip;</div>
            <div :class="$style.flowCards">
                <slot name="when"/>
            </div>
        </template>

        <template v-if="slots.and">
            <div :class="$style.flowTitle">And&hellip;</div>
            <div :class="$style.flowCards">
                <slot name="and"/>
            </div>
        </template>

        <template v-if="slots.then">
            <div :class="$style.flowTitle">Then&hellip;</div>
            <div :class="$style.flowCards">
                <slot name="then"/>
            </div>
        </template>
    </div>
</template>

<script
    lang="ts"
    setup>
    import { provide, ref, type VNode } from 'vue';
    import { IN_FLOW } from '../symbols';

    const slots = defineSlots<{
        readonly when: VNode[];
        readonly and: VNode[];
        readonly then: VNode[];
    }>();

    provide(IN_FLOW, ref(true));
</script>

<style module>
    .flow {
        display: flex;
        max-width: 390px;
        width: 100%;
        padding: 9px;
        align-items: stretch;
        align-self: start;
        flex-flow: column;
        background: rgb(from var(--vp-c-bg-soft) r g b / .5);
        border: 1px solid rgb(from var(--vp-c-divider) r g b / .6);
        border-radius: 21px;
    }

    .flowCards {
        display: flex;
        flex-flow: column;
        align-items: stretch;
        gap: 9px;
    }

    .flowTitle {
        padding: 6px 12px 12px;
        color: var(--vp-c-text-3);
        font-size: 13px;
        font-weight: 600;
        line-height: 1;
    }

    .flowCards + .flowTitle {
        margin-top: 18px;
    }
</style>
