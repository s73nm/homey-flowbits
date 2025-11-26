<template>
    <div :class="$style.flowCards">
        <slot/>
    </div>
</template>

<style module>
    .flowCards {
        display: grid;
        gap: 15px 30px;
        grid-auto-rows: auto;
        grid-template-columns: 1fr;
    }

    :global(h3) + .flowCards {
        margin-top: 15px;
    }

    @media (min-width: 768px) {
        .flowCards {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>
