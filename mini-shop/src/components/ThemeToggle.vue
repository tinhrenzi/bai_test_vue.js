<template>
    <DxButton
        class="theme-toggle m3-btn-pill"
        :icon="theme === 'dark' ? 'sun' : 'moon'"
        :text="theme === 'dark' ? 'Sáng' : 'Tối'"
        :hint="
            theme === 'dark'
                ? 'Chuyển sang giao diện sáng'
                : 'Chuyển sang giao diện tối'
        "
        :element-attr="{
            'aria-label':
                theme === 'dark'
                    ? 'Chuyển sang giao diện sáng'
                    : 'Chuyển sang giao diện tối',
        }"
        styling-mode="contained"
        type="normal"
        @click="chuyenTheme" />
</template>

<script>
import { DxButton } from "devextreme-vue/button";

export default {
    name: "ThemeToggle",
    components: {
        DxButton,
    },
    data() {
        return {
            theme: document.documentElement.dataset.theme || "light",
        };
    },
    methods: {
        chuyenTheme() {
            this.theme = this.theme === "dark" ? "light" : "dark";
            document.documentElement.dataset.theme = this.theme;
            localStorage.setItem("mini-shop-theme", this.theme);
        },
    },
};
</script>

<style scoped>
.theme-toggle.dx-button {
    padding: 0 !important;
    height: auto !important;
    background-color: var(--md-sys-color-surface) !important;
    color: var(--md-sys-color-text-main) !important;
    border: 1px solid var(--md-sys-color-outline-variant) !important;
    box-shadow: var(--md-sys-elevation-1) !important;
    border-radius: var(--md-sys-shape-corner-full) !important;
}

.theme-toggle.dx-button:hover,
.theme-toggle.dx-button.dx-state-hover {
    background-color: var(--md-sys-color-surface-container) !important;
    border-color: var(--md-sys-color-outline) !important;
}

.theme-toggle.dx-button :deep(.dx-button-content) {
    padding: 8px 16px !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 8px !important;
    color: var(--md-sys-color-text-main) !important;
}

.theme-toggle.dx-button :deep(.dx-button-text) {
    color: var(--md-sys-color-text-main) !important;
    font-weight: 500 !important;
    font-size: 14px !important;
}

.theme-toggle.dx-button :deep(.dx-icon) {
    color: var(--md-sys-color-text-main) !important;
    font-size: 18px !important;
    line-height: 1 !important;
}
</style>
