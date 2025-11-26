<template>
    <div :class="className">
        <div
            v-if="type !== 'trigger'"
            :class="$style.flowCardConnectorStart"/>

        <template v-if="type === 'condition'">
            <div :class="$style.flowCardConnectorTrue"/>
            <div :class="$style.flowCardConnectorFalse"/>
        </template>

        <div
            v-else
            :class="$style.flowCardConnectorContinue"/>

        <div :class="$style.flowCardIcon"/>

        <div :class="$style.flowCardApp">
            FlowBits
        </div>

        <div :class="$style.flowCardContent">
            <slot/>
        </div>
    </div>
</template>

<script
    lang="ts"
    setup>
    import { computed, useCssModule } from 'vue';

    const {
        type
    } = defineProps<{
        readonly type: 'action' | 'condition' | 'trigger';
    }>();

    const $style = useCssModule();

    const className = computed(() => {
        if (type === 'action') {
            return $style.flowCardAction;
        } else if (type === 'condition') {
            return $style.flowCardCondition;
        } else {
            return $style.flowCardTrigger;
        }
    });
</script>

<style module>
    .flowCard {
        position: relative;
        display: grid;
        padding: 12px;
        align-items: center;
        align-self: center;
        gap: 1px 12px;
        grid-template-columns: 48px 1fr;
        grid-template-rows: auto auto;
        background: var(--vp-c-bg);
        border: 1px solid var(--vp-c-gray-3);
        border-radius: 15px;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.035), 0 1px 4px rgba(0, 0, 0, 0.035);
        line-height: 1.4;
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
            background: var(--vp-c-gray-3);
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
        background: url(/assets/logo-white.svg) no-repeat center center / 27px 27px var(--vp-c-brand-1);
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
</style>
