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
    padding: 0;
    height: auto;
}
.theme-toggle.dx-button :deep(.dx-button-content) {
    padding: 8px 14px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: inherit;
}
.theme-toggle.dx-button :deep(.dx-icon) {
    font-size: 18px;
    line-height: 1;
}
</style>
