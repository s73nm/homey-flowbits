<template>
    <div :class="$style.flowCardExplainer">
        <div :class="$style.flowCardExplainerCard">
            <slot/>
        </div>

        <div :class="$style.flowCardExplainerContent">
            <slot
                v-if="$slots.content"
                name="content"/>

            <template v-else>
                {{ content }}
            </template>
        </div>
    </div>
</template>

<script
    lang="ts"
    setup>
    defineProps<{
        readonly content?: string;
    }>();
</script>

<style module>
    .flowCardExplainer {
        display: flex;
        align-items: stretch;
        align-content: stretch;
        flex-flow: column nowrap;
        gap: 15px;
        justify-content: flex-start;
    }

    .flowCardExplainerCard {
        position: relative;
    }

    .flowCardExplainerContent {
        padding: 0 15px;
        color: var(--vp-c-text-3);
        font-size: 14px;
        text-wrap: pretty;
    }
</style>
