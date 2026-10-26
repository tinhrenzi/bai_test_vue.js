<template>
    <div class="m3-page-container">
        <ThemeToggle />
        <div class="mb-3 d-flex align-items-center gap-2">
            <router-link
                to="/"
                class="btn btn-outline-secondary m3-btn-pill btn-sm">
                <i class="dx-icon-chevronleft me-1"></i> Quay lại
            </router-link>
            <span class="text-muted small">/</span>
            <span class="text-muted small">{{
                sanPham?.category || "Sản phẩm"
            }}</span>
            <span class="text-muted small">/</span>
                <span
                    class="text-dark small fw-semibold text-truncate"
                style="max-width: 250px">
                {{ sanPham?.title }}
            </span>
        </div>

        <div v-if="dangTai" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
            </div>
            <p class="mt-2 text-muted small">
                Đang tải thông tin chi tiết sản phẩm...
            </p>
        </div>

        <div v-else-if="loi" class="alert alert-danger py-4 text-center">
            <h5>Không thể tải chi tiết sản phẩm!</h5>
            <p class="mb-3">{{ loi }}</p>
            <button
                type="button"
                class="btn btn-outline-danger m3-btn-pill btn-sm"
                @click="taiChiTiet">
                Thử lại
            </button>
        </div>

        <div v-else-if="sanPham" class="m3-detail-card">
            <div class="row g-4 g-lg-5">
                <div class="col-12 col-md-6">
                    <div class="m3-main-img-wrap mb-3">
                        <img
                            :src="anhHienThi || sanPham.thumbnail"
                            :alt="sanPham.title"
                            class="m3-main-img" />
                    </div>

                    <div
                        v-if="sanPham.images && sanPham.images.length > 1"
                        class="d-flex gap-2 overflow-auto pb-2">
                        <div
                            v-for="(img, idx) in sanPham.images"
                            :key="idx"
                            class="m3-thumb-item"
                            :class="{ active: anhHienThi === img }"
                            @click="anhHienThi = img">
                            <img :src="img" alt="" class="m3-thumb-img" />
                        </div>
                    </div>
                </div>
                <div
                    class="col-12 col-md-6 d-flex flex-column justify-content-between">
                    <div>
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="m3-card-badge">{{
                                sanPham.category
                            }}</span>
                            <span v-if="sanPham.brand" class="small text-muted">
                                Thương hiệu:
                                <strong>{{ sanPham.brand }}</strong>
                            </span>
                        </div>

                        <h1 class="m3-detail-title mb-2">
                            {{ sanPham.title }}
                        </h1>

                        <div class="d-flex align-items-center gap-3 mb-3">
                            <span class="m3-detail-rating">
                                ★ {{ sanPham.rating }}
                            </span>
                            <span class="small text-muted">|</span>
                            <span class="small text-muted">
                                Tình trạng:
                                <strong
                                    :class="
                                        sanPham.stock > 0
                                            ? 'text-success'
                                            : 'text-danger'
                                    ">
                                    {{
                                        sanPham.stock > 0
                                            ? `Còn hàng (${sanPham.stock} sản phẩm)`
                                            : "Hết hàng"
                                    }}
                                </strong>
                            </span>
                        </div>

                        <div class="m3-detail-price-box mb-3">
                            <span class="m3-detail-price"
                                >${{ sanPham.price }}</span
                            >
                            <span
                                v-if="sanPham.discountPercentage"
                                class="badge bg-danger-subtle text-danger ms-2">
                                Giảm {{ sanPham.discountPercentage }}%
                            </span>
                        </div>

                        <div class="m3-detail-desc mb-4">
                            <h5 class="fw-semibold fs-6 mb-2">
                                Mô tả sản phẩm:
                            </h5>
                            <p class="text-muted mb-0">
                                {{ sanPham.description }}
                            </p>
                        </div>
                    </div>

                    <div class="border-top pt-4">
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <span class="fw-semibold small">Số lượng:</span>
                            <div class="m3-qty-control">
                                <button
                                    type="button"
                                    class="m3-qty-btn"
                                    :disabled="soLuong <= 1"
                                    @click="soLuong--">
                                    
                                </button>
                                <span class="m3-qty-val">{{ soLuong }}</span>
                                <button
                                    type="button"
                                    class="m3-qty-btn"
                                    :disabled="soLuong >= sanPham.stock"
                                    @click="soLuong++">
                                    +
                                </button>
                            </div>
                        </div>

                        <div class="d-flex flex-wrap gap-2">
                            <button
                                type="button"
                                class="btn btn-outline-primary m3-btn-pill px-4 py-2 flex-grow-1"
                                :disabled="sanPham.stock <= 0"
                                @click="themVaoGio(false)">
                                <i class="dx-icon-cart me-1"></i> Thêm vào giỏ
                            </button>
                            <button
                                type="button"
                                class="btn btn-primary m3-btn-pill px-4 py-2 flex-grow-1"
                                :disabled="sanPham.stock <= 0"
                                @click="themVaoGio(true)">
                                Mua ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import notify from "devextreme/ui/notify";
import ThemeToggle from "../components/ThemeToggle.vue";

export default {
    name: "SanPhamChiTiet",
    components: { ThemeToggle },
    data() {
        return {
            anhHienThi: null,
            soLuong: 1,
        };
    },
    computed: {
        sanPham() {
            return this.$store.state.products.chiTiet;
        },
        dangTai() {
            return this.$store.state.products.dangTai;
        },
        loi() {
            return this.$store.state.products.loi;
        },
    },
    created() {
        this.taiChiTiet();
    },
    methods: {
        async taiChiTiet() {
            const id = this.$route.params.id;
            if (!id) return;
            try {
                const data = await this.$store.dispatch(
                    "products/taiChiTietSanPham",
                    id,
                );
                if (data && data.thumbnail) {
                    this.anhHienThi = data.thumbnail;
                }
            } catch (err) {
                console.error("Lỗi tải chi tiết sản phẩm:", err);
            }
        },
        themVaoGio(muaNgay = false) {
            if (!this.sanPham || this.sanPham.stock <= 0) {
                notify("Sản phẩm đã hết hàng!", "warning", 1500);
                return;
            }

            this.$store.dispatch("cart/themVaoGio", {
                sanPham: this.sanPham,
                soLuong: this.soLuong,
            });

            notify(
                `Đã thêm ${this.soLuong} "${this.sanPham.title}" vào giỏ hàng!`,
                "success",
                1500,
            );

            if (muaNgay) {
                this.$router.push("/cart");
            }
        },
    },
};
</script>

<style scoped>
.m3-detail-card {
    background: var(--md-sys-color-surface, #ffffff);
    border-radius: var(--md-sys-shape-corner-large, 16px);
    border: 1px solid var(--md-sys-color-outline-variant, #e0e2ec);
    box-shadow: var(--md-sys-elevation-1, 0 1px 3px rgba(0, 0, 0, 0.05));
    padding: 32px 24px;
}

.m3-main-img-wrap {
    width: 100%;
    height: 360px;
    background-color: var(--md-sys-color-surface-container, #f0f4f9);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.m3-main-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 16px;
    transition: transform 0.3s;
}

.m3-thumb-item {
    width: 64px;
    height: 64px;
    min-width: 64px;
    background: var(--md-sys-color-surface-container, #f0f4f9);
    border-radius: 10px;
    padding: 4px;
    border: 2px solid transparent;
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.2s;
}

.m3-thumb-item.active {
    border-color: var(--md-sys-color-primary, #0b57d0);
}

.m3-thumb-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.m3-detail-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--md-sys-color-text-main, #1f1f1f);
    line-height: 1.3;
}

.m3-detail-rating {
    font-size: 14px;
    font-weight: 600;
    color: var(--md-sys-color-warning, #e37400);
}

.m3-detail-price-box {
    background: var(--md-sys-color-surface-container, #f0f4f9);
    padding: 12px 18px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
}

.m3-detail-price {
    font-size: 26px;
    font-weight: 700;
    color: var(--md-sys-color-primary, #0b57d0);
}

.m3-qty-control {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--md-sys-color-outline-variant, #e0e2ec);
    border-radius: var(--md-sys-shape-corner-full, 9999px);
    background: var(--md-sys-color-surface, #ffffff);
    overflow: hidden;
}

.m3-qty-btn {
    width: 34px;
    height: 32px;
    border: none;
    background: transparent;
    font-size: 16px;
    font-weight: 600;
    color: var(--md-sys-color-text-main, #1f1f1f);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s;
}

.m3-qty-btn:hover:not(:disabled) {
    background: var(--md-sys-color-surface-container, #f0f4f9);
}

.m3-qty-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.m3-qty-val {
    padding: 0 14px;
    font-size: 15px;
    font-weight: 600;
    min-width: 36px;
    text-align: center;
}

@media (max-width: 576px) {
    .m3-detail-card {
        padding: 16px 12px;
    }
    .m3-main-img-wrap {
        height: 240px;
    }
}
</style>
