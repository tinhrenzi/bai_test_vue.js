<template>
    <div
        v-if="totalPages > 1"
        class="d-flex justify-content-center align-items-center gap-3 mt-4 mb-3">
        <DxButton
            class="m3-btn-pill"
            text="Trước"
            icon="chevronleft"
            styling-mode="outlined"
            :disabled="currentPage <= 1"
            @click="chuyenTrang(currentPage - 1)" />
        <span class="small fw-semibold text-muted">
            Trang {{ currentPage }} / {{ totalPages }}
        </span>
        <DxButton
            class="m3-btn-pill"
            text="Sau"
            icon="chevronright"
            styling-mode="outlined"
            :disabled="currentPage >= totalPages"
            @click="chuyenTrang(currentPage + 1)" />
    </div>
</template>

<script>
import { DxButton } from "devextreme-vue/button";

export default {
    name: "AppPagination",
    components: {
        DxButton,
    },
    props: {
        currentPage: {
            type: Number,
            required: true,
            default: 1,
        },
        totalPages: {
            type: Number,
            required: true,
            default: 1,
        },
    },
    emits: ["page-change", "update:currentPage"],
    methods: {
        chuyenTrang(newPage) {
            if (newPage >= 1 && newPage <= this.totalPages) {
                this.$emit("update:currentPage", newPage);
                this.$emit("page-change", newPage);
            }
        },
    },
};
</script>
