<template>
    <div :class="$style.flowCards">
        <slot/>
    </div>
</template>

<style module>
    .flowCards {
        position: relative;
        display: grid;
        gap: 30px;
        grid-auto-rows: auto;
        grid-template-columns: 1fr;
    }

    :global(h3) + .flowCards {
        margin-top: 15px;
    }

    :global(p) + .flowCards {
        margin-top: 30px;
    }

    .flowCards + .flowCards {
        margin-top: 60px;
    }

    @media (min-width: 768px) {
        .flowCards {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>
