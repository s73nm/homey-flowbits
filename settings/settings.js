'use strict';

(function () {
    const {computed, createApp, defineComponent, onMounted, reactive, ref, unref, watch} = Vue;

    let Homey = null;

    function useColors() {
        const items = ref([]);
        const isLoading = ref(true);

        const load = async () => {
            isLoading.value = true;
            items.value = await Homey.api('GET', '/colors');
            isLoading.value = false;
        };

        return {
            isLoading,
            items,
            load
        };
    }

    function useFlags() {
        const items = ref([]);
        const isLoading = ref(true);

        const load = async () => {
            isLoading.value = true;
            items.value = await Homey.api('GET', '/flags');
            isLoading.value = false;
        };

        return {
            isLoading,
            items,
            load
        };
    }

    function useIcons() {
        const items = ref([]);
        const isLoading = ref(true);

        const load = async () => {
            isLoading.value = true;
            items.value = await Homey.api('GET', '/icons');
            isLoading.value = false;
        };

        return {
            isLoading,
            items,
            load
        };
    }

    function useModes() {
        const items = ref([]);
        const isLoading = ref(true);

        const load = async () => {
            isLoading.value = true;
            items.value = await Homey.api('GET', '/modes');
            isLoading.value = false;
        };

        return {
            isLoading,
            items,
            load
        };
    }

    const FormGroup = defineComponent({
        props: ['title', 'description'],

        template: `
            <fieldset class="homey-form-fieldset">
                <legend class="homey-form-legend">{{ title }}</legend>
                <div v-if="description" class="homey-form-group" style="margin-top: 6px">{{ description }}</div>
                <div v-if="$slots.before" class="homey-form-group"><slot name="before"/></div>
                <div class="homey-form-group"><slot/></div>
            </fieldset>
        `
    });

    const ColorSelect = defineComponent({
        components: {
            FormGroup
        },

        emits: ['update:modelValue'],
        props: ['modelValue'],

        template: `
            <FormGroup :title="t('settings.edit.color')">
                <div class="color-select">
                    <div
                        v-for="item of items"
                        class="color-select-item"
                        :class="{'active': selection === item.hex}"
                        :style="{'--color': item.hex}"
                        :title="item.label"
                        @click="selection = item.hex"/>
                </div>
            </FormGroup>
        `,

        setup({modelValue}, {emit}) {
            const selection = ref(modelValue);
            const {items, load} = useColors();

            onMounted(load);

            watch(selection, value => emit('update:modelValue', value));
            watch(() => modelValue, value => selection.value = value);

            return {
                items,
                selection
            };
        }
    });

    const IconSelect = defineComponent({
        components: {
            FormGroup
        },

        emits: ['update:modelValue'],
        props: ['modelValue'],

        template: `
            <FormGroup :title="t('settings.edit.icon')">
                <template #before>
                    <label class="homey-form-label" for="search">{{ t('settings.search') }}</label>
                    <input class="homey-form-input" id="search" type="text" v-model="search"/>
                </template>
                
                <div class="icon-select">
                    <div
                        v-for="item of items"
                        class="icon-select-item flowbits-icon"
                        :class="{'active': selection === item.unicode}"
                        :style="{'--icon': JSON.stringify(item.unicode), '--icon-secondary': JSON.stringify(item.unicode + item.unicode)}"
                        :title="item.name"
                        @click="selection = item.unicode"/>
                </div>
            </FormGroup>
        `,

        setup({modelValue}, {emit}) {
            const search = ref('');
            const selection = ref(modelValue);
            const {items, load} = useIcons();

            const filtered = computed(() => {
                const normalizedQuery = unref(search).toLowerCase().trim();

                return items.value
                    .filter(item => (normalizedQuery.length > 0 && item.name.toLowerCase().includes(normalizedQuery)) || (normalizedQuery.length === 0 && item.unicode === selection.value))
                    .slice(0, 54);
            });

            onMounted(load);

            watch(selection, value => emit('update:modelValue', value));
            watch(() => modelValue, value => selection.value = value);

            return {
                items: filtered,
                search,
                selection
            };
        }
    });

    const Edit = defineComponent({
        components: {
            ColorSelect,
            IconSelect
        },

        emits: ['close', 'save'],
        props: ['name', 'color', 'icon', 'saving'],

        template: `
            <div class="edit-overlay">
                <div class="edit">
                    <div class="edit-icon flowbits-icon" :style="{'--color': form.color, '--icon': iconPrimary, '--icon-secondary': iconSecondary}"></div>
                    <div class="edit-name">{{ name }}</div>

                    <ColorSelect v-model="form.color"/>
                    <IconSelect v-model="form.icon"/>

                    <button class="homey-button-primary-full" :class="{'is-loading': saving}" @click="save()">{{ t('settings.save') }}</button>
                    <button class="homey-button-transparent" @click="close()">{{ t('settings.close') }}</button>
                </div>
            </div>
        `,

        setup({color, icon}, {emit}) {
            const form = reactive({
                color,
                icon
            });

            const iconPrimary = computed(() => JSON.stringify(form.icon));
            const iconSecondary = computed(() => JSON.stringify(`${form.icon}${form.icon}`));

            const {items: icons, load: loadIcons} = useIcons();

            onMounted(async () => {
                await loadIcons();
            });

            const save = async () => emit('save', form);
            const close = () => emit('close');

            return {
                close,
                save,
                form,
                icons,
                iconPrimary,
                iconSecondary
            };
        }
    });

    const Item = defineComponent({
        emits: ['click'],
        props: ['name', 'color', 'icon'],

        template: `
            <div class="item" @click="onClick()">
                <div class="item-icon flowbits-icon" :style="{'--color': color, '--icon': iconPrimary, '--icon-secondary': iconSecondary}"></div>
                <div class="item-caption">{{ name }}</div>
                <div class="item-icon-edit flowbits-icon"></div>
            </div>
        `,

        setup(props, {emit}) {
            const onClick = () => emit('click');

            const iconPrimary = computed(() => JSON.stringify(props.icon));
            const iconSecondary = computed(() => JSON.stringify(`${props.icon}${props.icon}`));

            return {
                onClick,
                iconPrimary,
                iconSecondary
            };
        }
    });

    const Flags = defineComponent({
        components: {
            FormGroup,
            Item
        },

        props: ['items'],

        template: `
            <FormGroup :title="t('settings.flags.title')" :description="t('settings.flags.description')">
                <div v-if="items.length > 0" class="items">
                    <Item
                        v-for="item of items"
                        :active="item.active"
                        :name="item.name"
                        :color="item.color"
                        :icon="item.icon"
                        @click="onClick(item)"/>
                </div>
                
                <div v-else class="items-empty">
                    {{ t('settings.flags.empty') }}
                </div>
            </FormGroup>
        `,

        setup(_, {emit}) {
            const onClick = flag => emit('edit', flag);

            return {
                onClick
            };
        }
    });

    const Modes = defineComponent({
        components: {
            FormGroup,
            Item
        },

        props: ['items'],

        template: `
            <FormGroup :title="t('settings.modes.title')" :description="t('settings.modes.description')">
                <div v-if="items.length > 0" class="items">
                    <Item
                        v-for="item of items"
                        :active="item.active"
                        :name="item.name"
                        :color="item.color"
                        :icon="item.icon"
                        @click="onClick(item)"/>
                </div>
                
                <div v-else class="items-empty">
                    {{ t('settings.modes.empty') }}
                </div>
            </FormGroup>
        `,

        setup(_, {emit}) {
            const onClick = mode => emit('edit', mode);

            return {
                onClick
            };
        }
    });

    const Settings = defineComponent({
        components: {
            Edit,
            Flags,
            Modes
        },

        template: `
            <header class="homey-header">
                <h1 class="homey-title">{{ t('settings.title') }}</h1>
                <p class="homey-subtitle">{{ t('settings.subtitle') }}</p>
            </header>
            
            <form class="homey-form">
                <Flags :items="flags" @edit="onEditFlag"/>
                <Modes :items="modes" @edit="onEditMode"/>
            </form>
            
            <Edit
                v-if="editingFlag"
                :name="editingFlag.name"
                :color="editingFlag.color"
                :icon="editingFlag.icon"
                :saving="isSaving"
                @close="editingFlag = null"
                @save="form => onSaveFlag(editingFlag.name, form)"/>
            
            <Edit
                v-if="editingMode"
                :name="editingMode.name"
                :color="editingMode.color"
                :icon="editingMode.icon"
                :saving="isSaving"
                @close="editingMode = null"
                @save="form => onSaveMode(editingMode.name, form)"/>
        `,

        setup() {
            const {items: flags, load: loadFlags} = useFlags();
            const {items: modes, load: loadModes} = useModes();

            const editingFlag = ref(null);
            const editingMode = ref(null);
            const isSaving = ref(false);

            onMounted(async () => {
                await loadFlags();
                await loadModes();
            });

            const onEditFlag = flag => editingFlag.value = flag;
            const onEditMode = mode => editingMode.value = mode;

            const onSaveFlag = async (name, {color, icon}) => {
                isSaving.value = true;

                await Homey.api('POST', '/flags/look', {
                    name,
                    color,
                    icon
                });

                await loadFlags();

                editingFlag.value = null;
                isSaving.value = false;
            };

            const onSaveMode = async (name, {color, icon}) => {
                isSaving.value = true;

                await Homey.api('POST', '/modes/look', {
                    name,
                    color,
                    icon
                });

                await loadModes();

                editingMode.value = null;
                isSaving.value = false;
            };

            return {
                editingFlag,
                editingMode,
                flags,
                modes,
                isSaving,
                onEditFlag,
                onEditMode,
                onSaveFlag,
                onSaveMode
            };
        }
    });

    const app = createApp({
        components: {
            Settings
        },

        template: `<Settings v-if="ready"/>`,

        setup() {
            const ready = ref(false);

            window.addEventListener('homeyReady', evt => {
                Homey = evt.detail;
                Homey.ready();
                ready.value = true;
            });

            return {ready};
        }
    });

    app.config.globalProperties.t = key => Homey.__(key);

    app.mount('#app');
})();

function onHomeyReady(Homey) {
    window.dispatchEvent(new CustomEvent('homeyReady', {detail: Homey}));
}
