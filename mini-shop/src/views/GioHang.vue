<template>
    <div class="m3-page-container">
        <ThemeToggle />
        <div class="m3-cart-header mb-4">
            <div
                class="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div class="d-flex align-items-center gap-2">
                    <router-link
                        to="/"
                        class="btn btn-outline-secondary m3-btn-pill btn-sm">
                        <i class="dx-icon-chevronleft me-1"></i> Tiếp tục mua
                        hàng
                    </router-link>
                    <h2 class="m3-cart-title mb-0 ms-2">Giỏ hàng của bạn</h2>
                    <span
                        v-if="tongSoLuong > 0"
                        class="badge rounded-pill bg-primary ms-1">
                        {{ tongSoLuong }} món
                    </span>
                </div>
                <div v-if="danhSachSanPham.length > 0">
                    <button
                        type="button"
                        class="btn btn-outline-danger m3-btn-pill btn-sm"
                        @click="xacNhanXoaTatCa">
                        <i class="dx-icon-trash me-1"></i> Xóa tất cả
                    </button>
                </div>
            </div>
        </div>

        <div
            v-if="!danhSachSanPham.length"
            class="m3-empty-cart text-center py-5">
            <div class="m3-empty-icon mb-3">
                <i
                    class="dx-icon-cart"
                    style="font-size: 64px; color: #a8c7fa"></i>
            </div>
            <h3 class="fw-semibold text-dark mb-2">
                Giỏ hàng của bạn đang trống!
            </h3>
            <p class="text-muted mb-4">
                Hãy khám phá các sản phẩm tuyệt vời của chúng tôi và chọn món đồ
                bạn yêu thích.
            </p>
            <router-link to="/" class="btn btn-primary m3-btn-pill px-4 py-2">
                <i class="dx-icon-home me-1"></i> Khám phá sản phẩm ngay
            </router-link>
        </div>

        <div v-else class="row g-4">
            <div class="col-12 col-lg-8">
                <div class="m3-cart-list">
                    <div
                        v-for="item in danhSachSanPham"
                        :key="item.id"
                        class="m3-cart-item">
                        <div class="m3-cart-item-img-wrap">
                            <img
                                :src="
                                    item.thumbnail ||
                                    'https://via.placeholder.com/80'
                                "
                                :alt="item.title"
                                class="m3-cart-item-img" />
                        </div>

                        <div class="m3-cart-item-info flex-grow-1">
                            <div
                                class="d-flex justify-content-between align-items-start gap-2">
                                <div>
                                    <h4 class="m3-cart-item-title mb-1">
                                        <router-link
                                            :to="'/products/' + item.id"
                                            class="text-decoration-none text-dark">
                                            {{ item.title }}
                                        </router-link>
                                    </h4>
                                    <div class="small text-muted mb-2">
                                        Đơn giá:
                                        <strong class="text-primary"
                                            >${{ item.price }}</strong
                                        >
                                        <span class="ms-2"
                                            >| Tồn kho: {{ item.stock }}</span
                                        >
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    class="btn btn-link text-danger p-0 border-0"
                                    title="Xóa khỏi giỏ"
                                    @click="xoa(item.id)">
                                    <i class="dx-icon-trash fs-5"></i>
                                </button>
                            </div>

                            <div
                                class="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-2">
                                <div class="m3-qty-control">
                                    <button
                                        type="button"
                                        class="m3-qty-btn"
                                        :disabled="item.quantity <= 1"
                                        @click="giam(item)">
                                        −
                                    </button>
                                    <span class="m3-qty-val">{{
                                        item.quantity
                                    }}</span>
                                    <button
                                        type="button"
                                        class="m3-qty-btn"
                                        :disabled="item.quantity >= item.stock"
                                        @click="tang(item)">
                                        +
                                    </button>
                                </div>

                                <div class="text-end">
                                    <span class="small text-muted me-1"
                                        >Thành tiền:</span
                                    >
                                    <span class="m3-item-subtotal">
                                        ${{
                                            (
                                                item.price * item.quantity
                                            ).toFixed(2)
                                        }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 col-lg-4">
                <div class="m3-summary-card">
                    <h3 class="m3-summary-title mb-3">Tóm tắt đơn hàng</h3>

                    <div
                        class="d-flex justify-content-between mb-2 small text-muted">
                        <span>Tổng số lượng:</span>
                        <strong class="text-dark"
                            >{{ tongSoLuong }} sản phẩm</strong
                        >
                    </div>

                    <div
                        class="d-flex justify-content-between mb-2 small text-muted">
                        <span>Tạm tính:</span>
                        <strong class="text-dark"
                            >${{ tongTien.toFixed(2) }}</strong
                        >
                    </div>

                    <div
                        class="d-flex justify-content-between mb-3 small text-muted">
                        <span>Phí vận chuyển:</span>
                        <span class="badge bg-success-subtle text-success"
                            >Miễn phí</span
                        >
                    </div>

                    <div
                        class="border-top pt-3 mb-4 d-flex justify-content-between align-items-center">
                        <span class="fw-semibold text-dark">Tổng cộng:</span>
                        <span class="m3-summary-total"
                            >${{ tongTien.toFixed(2) }}</span
                        >
                    </div>

                    <button
                        type="button"
                        class="btn btn-primary m3-btn-pill w-100 py-2 fs-6 fw-semibold mb-2"
                        @click="tienHanhThanhToan">
                        <i class="dx-icon-check me-1"></i> Tiến hành thanh toán
                    </button>

                    <div class="text-center mt-3">
                        <span class="small text-muted">
                            <i class="dx-icon-card me-1"></i> Hỗ trợ thanh toán
                            thẻ & COD
                        </span>
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
    name: "GioHang",
    components: { ThemeToggle },
    computed: {
        danhSachSanPham() {
            return this.$store.getters["cart/danhSachSanPham"] || [];
        },
        tongSoLuong() {
            return this.$store.getters["cart/count"] || 0;
        },
        tongTien() {
            return this.$store.getters["cart/total"] || 0;
        },
    },
    methods: {
        tang(item) {
            if (item.quantity >= item.stock) {
                notify("Số lượng đã đạt giới hạn tồn kho!", "warning", 1500);
                return;
            }
            this.$store.dispatch("cart/capNhatSoLuong", {
                id: item.id,
                soLuong: item.quantity + 1,
            });
        },
        giam(item) {
            if (item.quantity <= 1) {
                this.xoa(item.id);
                return;
            }
            this.$store.dispatch("cart/capNhatSoLuong", {
                id: item.id,
                soLuong: item.quantity - 1,
            });
        },
        xoa(id) {
            this.$store.dispatch("cart/xoaSanPham", id);
            notify("Đã xóa sản phẩm khỏi giỏ!", "info", 1500);
        },
        xacNhanXoaTatCa() {
            if (
                confirm("Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?")
            ) {
                this.$store.dispatch("cart/xoaTatCa");
                notify("Đã làm trống giỏ hàng!", "info", 1500);
            }
        },
        tienHanhThanhToan() {
            if (!this.danhSachSanPham.length) return;
            notify(
                "Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại Mini Shop.",
                "success",
                2500,
            );
            this.$store.dispatch("cart/xoaTatCa");
            this.$router.push("/");
        },
    },
};
</script>

<style scoped>
.m3-cart-header {
    background: var(--md-sys-color-surface, #ffffff);
    border-radius: var(--md-sys-shape-corner-large, 16px);
    border: 1px solid var(--md-sys-color-outline-variant, #e0e2ec);
    box-shadow: var(--md-sys-elevation-1, 0 1px 3px rgba(0, 0, 0, 0.05));
    padding: 16px 20px;
}

.m3-cart-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--md-sys-color-text-main, #1f1f1f);
}

.m3-empty-cart {
    background: var(--md-sys-color-surface, #ffffff);
    border-radius: var(--md-sys-shape-corner-large, 16px);
    border: 1px solid var(--md-sys-color-outline-variant, #e0e2ec);
    padding: 60px 20px;
}

.m3-cart-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.m3-cart-item {
    background: var(--md-sys-color-surface, #ffffff);
    border-radius: var(--md-sys-shape-corner-large, 16px);
    border: 1px solid var(--md-sys-color-outline-variant, #e0e2ec);
    box-shadow: var(--md-sys-elevation-1, 0 1px 3px rgba(0, 0, 0, 0.05));
    padding: 16px;
    display: flex;
    gap: 16px;
    align-items: center;
}

.m3-cart-item-img-wrap {
    width: 80px;
    height: 80px;
    min-width: 80px;
    background-color: var(--md-sys-color-surface-container, #f0f4f9);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.m3-cart-item-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 6px;
}

.m3-cart-item-title {
    font-size: 15px;
    font-weight: 600;
    line-height: 1.3;
}

.m3-qty-control {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--md-sys-color-outline-variant, #e0e2ec);
    border-radius: var(--md-sys-shape-corner-full, 9999px);
    background: #ffffff;
    overflow: hidden;
}

.m3-qty-btn {
    width: 32px;
    height: 30px;
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
    padding: 0 12px;
    font-size: 14px;
    font-weight: 600;
    min-width: 30px;
    text-align: center;
}

.m3-item-subtotal {
    font-size: 17px;
    font-weight: 700;
    color: var(--md-sys-color-primary, #0b57d0);
}

.m3-summary-card {
    background: var(--md-sys-color-surface, #ffffff);
    border-radius: var(--md-sys-shape-corner-large, 16px);
    border: 1px solid var(--md-sys-color-outline-variant, #e0e2ec);
    box-shadow: var(--md-sys-elevation-1, 0 1px 3px rgba(0, 0, 0, 0.05));
    padding: 24px 20px;
    position: sticky;
    top: 20px;
}

.m3-summary-title {
    font-size: 17px;
    font-weight: 700;
    color: var(--md-sys-color-text-main, #1f1f1f);
}

.m3-summary-total {
    font-size: 22px;
    font-weight: 700;
    color: var(--md-sys-color-primary, #0b57d0);
}

@media (max-width: 576px) {
    .m3-cart-item {
        flex-direction: column;
        align-items: flex-start;
    }
    .m3-cart-item-img-wrap {
        width: 100%;
        height: 120px;
    }
}
</style>
