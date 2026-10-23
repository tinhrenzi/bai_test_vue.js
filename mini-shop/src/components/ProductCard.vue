<template>
    <div class="m3-product-card">
        <div class="m3-card-img-wrap">
            <img
                :src="product.thumbnail || 'https://via.placeholder.com/200'"
                :alt="product.title"
                class="m3-card-img"
                loading="lazy" />
        </div>
        <div class="m3-card-body">
            <div>
                <span class="m3-card-badge">{{ product.category }}</span>
                <h3 class="m3-card-title">{{ product.title }}</h3>
                <div class="m3-card-meta">
                    <span class="m3-card-price">${{ product.price }}</span>
                    <span class="m3-card-rating">★ {{ product.rating }}</span>
                </div>
                <div class="m3-card-stock">
                    Tồn kho: <strong>{{ product.stock }}</strong>
                </div>
            </div>
            <div v-if="isAdmin" class="m3-card-actions">
                <DxButton
                    class="m3-btn-pill m3-table-btn"
                    text="Sửa"
                    icon="edit"
                    type="default"
                    styling-mode="outlined"
                    @click="$emit('edit', product)" />
                <DxButton
                    class="m3-btn-pill m3-table-btn"
                    text="Xóa"
                    icon="trash"
                    type="danger"
                    styling-mode="contained"
                    @click="$emit('delete', product.id)" />
            </div>
            <div v-else class="m3-card-actions">
                <router-link
                    :to="'/products/' + product.id"
                    class="btn btn-outline-secondary m3-btn-pill btn-sm flex-grow-1 py-1">
                    Chi tiết
                </router-link>
                <button
                    type="button"
                    class="btn btn-primary m3-btn-pill btn-sm flex-grow-1 py-1 d-inline-flex align-items-center justify-content-center gap-1"
                    :disabled="product.stock <= 0"
                    @click="$emit('add-to-cart', product)">
                    <i class="dx-icon-cart"></i>
                    <span>{{
                        product.stock > 0 ? "Thêm giỏ" : "Hết hàng"
                    }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { DxButton } from "devextreme-vue/button";

export default {
    name: "ProductCard",
    components: {
        DxButton,
    },
    props: {
        product: {
            type: Object,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["add-to-cart", "edit", "delete"],
};
</script>
