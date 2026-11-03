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
                        <i class="dx-icon-chevronleft me-1"></i> Tiếp tục mua hàng
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
                        :disabled="dangThanhToan"
                        @click="yeuCauXoaTatCa">
                        <i class="dx-icon-trash me-1"></i> Xóa tất cả
                    </button>
                </div>
            </div>
        </div>

        <!-- Banner cảnh báo / lỗi nghiệp vụ -->
        <div
            v-if="thongBaoLoi"
            class="alert alert-danger py-2 px-3 small d-flex align-items-center justify-content-between gap-2 mb-3">
            <div class="d-flex align-items-center gap-2">
                <i class="dx-icon-warning text-danger fs-5"></i>
                <span>{{ thongBaoLoi }}</span>
            </div>
            <button
                type="button"
                class="btn-close btn-sm"
                aria-label="Đóng"
                @click="thongBaoLoi = ''"></button>
        </div>

        <div
            v-if="coSanPhamHetHang"
            class="alert alert-warning py-2 px-3 small d-flex align-items-center gap-2 mb-3">
            <i class="dx-icon-warning text-warning fs-5"></i>
            <span>Trong giỏ hàng có sản phẩm đã hết hàng hoặc số lượng vượt tồn kho. Vui lòng điều chỉnh trước khi thanh toán.</span>
        </div>

        <!-- Trạng thái giỏ rỗng -->
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

        <!-- Danh sách giỏ hàng & Tóm tắt -->
        <div v-else class="row g-4">
            <div class="col-12 col-lg-8">
                <div class="m3-cart-list">
                    <div
                        v-for="item in danhSachSanPham"
                        :key="item.id"
                        class="m3-cart-item"
                        :class="{ 'opacity-75 bg-light': item.stock <= 0 }">
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
                                        <span
                                            v-if="item.stock <= 0"
                                            class="badge bg-danger ms-2">
                                            Hết hàng
                                        </span>
                                        <span
                                            v-else-if="item.quantity > item.stock"
                                            class="badge bg-warning text-dark ms-2">
                                            Vượt tồn kho (còn {{ item.stock }})
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    class="btn btn-link text-danger p-0 border-0"
                                    title="Xóa khỏi giỏ"
                                    :disabled="dangThanhToan"
                                    @click="yeuCauXoaSanPham(item)">
                                    <i class="dx-icon-trash fs-5"></i>
                                </button>
                            </div>

                            <div
                                class="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-2">
                                <div class="m3-qty-control">
                                    <button
                                        type="button"
                                        class="m3-qty-btn"
                                        :disabled="dangThanhToan"
                                        title="Giảm số lượng"
                                        @click="giam(item)">
                                        −
                                    </button>
                                    <span class="m3-qty-val">{{
                                        item.quantity
                                    }}</span>
                                    <button
                                        type="button"
                                        class="m3-qty-btn"
                                        :disabled="item.quantity >= item.stock || dangThanhToan"
                                        title="Tăng số lượng"
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

                    <DxButton
                        id="btn-thanh-toan"
                        class="m3-btn-pill w-100 py-2 fs-6 fw-semibold mb-2"
                        :text="dangThanhToan ? 'Đang tạo đơn hàng...' : 'Tiến hành thanh toán'"
                        type="default"
                        styling-mode="contained"
                        :disabled="dangThanhToan || !danhSachSanPham.length || coSanPhamHetHang"
                        @click="tienHanhThanhToan" />

                    <!-- Popover thông báo đặt hàng thành công kèm nền mờ tối -->
                    <DxPopover
                        target="#btn-thanh-toan"
                        v-model:visible="hienPopoverThanhCong"
                        :show-title="true"
                        title="Thông báo đơn hàng"
                        position="top"
                        :width="340"
                        :shading="true"
                        shading-color="rgba(0, 0, 0, 0.6)"
                        :close-on-outside-click="false">
                        <div class="p-3 text-center">
                            <div class="mb-2">
                                <i
                                    class="dx-icon-check text-success"
                                    style="font-size: 38px"></i>
                            </div>
                            <h6 class="fw-bold text-dark mb-1">
                                Đặt hàng thành công!
                            </h6>
                            <p class="text-muted small mb-3">
                                Cảm ơn bạn đã mua sắm tại <strong>Mini Shop</strong>.
                            </p>
                            <div class="bg-light p-2 rounded mb-3 small text-start">
                                <div class="mb-1">Mã đơn: <strong>#DH-{{ thongTinDonHang?.id || Date.now().toString().slice(-6) }}</strong></div>
                                <div>Tổng thanh toán: <strong class="text-primary">${{ (thongTinDonHang?.total || tongTien).toFixed(2) }}</strong></div>
                            </div>
                            <button
                                type="button"
                                class="btn btn-primary btn-sm m3-btn-pill w-100"
                                @click="hoanTatDatHang">
                                Tiếp tục mua sắm
                                <i class="dx-icon-chevronnext ms-1"></i>
                            </button>
                        </div>
                    </DxPopover>

                    <div class="text-center mt-3">
                        <span class="small text-muted">
                            <i class="dx-icon-card me-1"></i> Hỗ trợ thanh toán
                            thẻ & COD
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Popup xác nhận xóa 1 sản phẩm -->
        <DxPopup
            v-model:visible="hienPopupXoaItem"
            :show-title="true"
            title="Xác nhận xóa sản phẩm"
            :width="360"
            :height="200"
            :shading="true"
            shading-color="rgba(0, 0, 0, 0.5)">
            <div class="p-3 text-center">
                <p class="mb-3">
                    Bạn có chắc chắn muốn xóa <strong>"{{ itemCanXoa?.title }}"</strong> khỏi giỏ hàng?
                </p>
                <div class="d-flex justify-content-center gap-2">
                    <button
                        type="button"
                        class="btn btn-outline-secondary btn-sm m3-btn-pill px-3"
                        @click="huyXoaItem">
                        Hủy
                    </button>
                    <button
                        type="button"
                        class="btn btn-danger btn-sm m3-btn-pill px-3"
                        @click="xacNhanXoaItem">
                        Xác nhận xóa
                    </button>
                </div>
            </div>
        </DxPopup>

        <!-- Popup xác nhận xóa toàn bộ giỏ hàng -->
        <DxPopup
            v-model:visible="hienPopupXoaTatCa"
            :show-title="true"
            title="Làm trống giỏ hàng"
            :width="380"
            :height="200"
            :shading="true"
            shading-color="rgba(0, 0, 0, 0.5)">
            <div class="p-3 text-center">
                <p class="mb-3">
                    Bạn có chắc muốn xóa <strong>tất cả sản phẩm</strong> trong giỏ hàng không?
                </p>
                <div class="d-flex justify-content-center gap-2">
                    <button
                        type="button"
                        class="btn btn-outline-secondary btn-sm m3-btn-pill px-3"
                        @click="huyXoaTatCa">
                        Hủy
                    </button>
                    <button
                        type="button"
                        class="btn btn-danger btn-sm m3-btn-pill px-3"
                        @click="xacNhanXoaTatCa">
                        Xóa tất cả
                    </button>
                </div>
            </div>
        </DxPopup>
    </div>
</template>

<script>
import { DxButton } from "devextreme-vue/button";
import { DxPopover } from "devextreme-vue/popover";
import { DxPopup } from "devextreme-vue/popup";
import ThemeToggle from "../components/ThemeToggle.vue";

export default {
    name: "GioHang",
    components: {
        ThemeToggle,
        DxButton,
        DxPopover,
        DxPopup,
    },
    data() {
        return {
            dangThanhToan: false,
            thongBaoLoi: "",
            hienPopoverThanhCong: false,
            thongTinDonHang: null,
            itemCanXoa: null,
            hienPopupXoaItem: false,
            hienPopupXoaTatCa: false,
        };
    },
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
        coSanPhamHetHang() {
            return this.$store.getters["cart/coSanPhamHetHang"] || false;
        },
        daDangNhap() {
            return !!this.$store.state.auth.token;
        },
    },
    methods: {
        async tang(item) {
            if (item.quantity >= item.stock) {
                this.thongBaoLoi = `Sản phẩm "${item.title}" chỉ còn tối đa ${item.stock} món trong kho!`;
                return;
            }
            try {
                this.thongBaoLoi = "";
                await this.$store.dispatch("cart/capNhatSoLuong", {
                    id: item.id,
                    soLuong: item.quantity + 1,
                });
            } catch (err) {
                this.thongBaoLoi = err.message || "Không thể cập nhật số lượng!";
            }
        },

        async giam(item) {
            if (item.quantity <= 1) {
                // Không xóa đột ngột gây hụt hẫng: Mở hộp thoại xác nhận
                this.yeuCauXoaSanPham(item);
                return;
            }
            try {
                this.thongBaoLoi = "";
                await this.$store.dispatch("cart/capNhatSoLuong", {
                    id: item.id,
                    soLuong: item.quantity - 1,
                });
            } catch (err) {
                this.thongBaoLoi = err.message || "Không thể cập nhật số lượng!";
            }
        },

        yeuCauXoaSanPham(item) {
            this.itemCanXoa = item;
            this.hienPopupXoaItem = true;
        },

        xacNhanXoaItem() {
            if (this.itemCanXoa) {
                this.$store.dispatch("cart/xoaSanPham", this.itemCanXoa.id);
                this.itemCanXoa = null;
                this.hienPopupXoaItem = false;
                this.thongBaoLoi = "";
            }
        },

        huyXoaItem() {
            this.itemCanXoa = null;
            this.hienPopupXoaItem = false;
        },

        yeuCauXoaTatCa() {
            this.hienPopupXoaTatCa = true;
        },

        xacNhanXoaTatCa() {
            this.$store.dispatch("cart/xoaTatCa");
            this.hienPopupXoaTatCa = false;
            this.thongBaoLoi = "";
        },

        huyXoaTatCa() {
            this.hienPopupXoaTatCa = false;
        },

        async tienHanhThanhToan() {
            // Tình huống 1: Chưa đăng nhập khi bấm thanh toán
            if (!this.daDangNhap) {
                this.$router.push({
                    path: "/login",
                    query: { redirect: "/cart" },
                });
                return;
            }

            // Tình huống 2: Giỏ hàng rỗng
            if (!this.danhSachSanPham.length) {
                this.thongBaoLoi = "Giỏ hàng của bạn đang trống! Hãy chọn sản phẩm trước khi thanh toán.";
                return;
            }

            // Tình huống 3: Có sản phẩm hết hàng hoặc vượt tồn kho
            if (this.coSanPhamHetHang) {
                this.thongBaoLoi = "Trong giỏ hàng có sản phẩm đã hết hàng hoặc vượt quá tồn kho. Vui lòng điều chỉnh lại trước khi thanh toán!";
                return;
            }

            this.dangThanhToan = true;
            this.thongBaoLoi = "";

            try {
                const donHang = await this.$store.dispatch("cart/thanhToanDonHang");
                this.thongTinDonHang = donHang;
                // Hiển thị Popover chúc mừng với shading tối
                this.hienPopoverThanhCong = true;
            } catch (err) {
                // Đảm bảo đóng Popover để không báo nhầm thành công
                this.hienPopoverThanhCong = false;
                if (import.meta.env.DEV) {
                    console.error("Lỗi thanh toán giỏ hàng:", err);
                }

                const thongBao = (err.message || "").toLowerCase();

                // Tình huống 4: Mất mạng hoặc lỗi kết nối khi đang bấm thanh toán
                const isLoiMang =
                    err.status === 0 ||
                    !navigator.onLine ||
                    thongBao.includes("mất kết nối") ||
                    thongBao.includes("lỗi kết nối") ||
                    thongBao.includes("network error") ||
                    thongBao.includes("failed to fetch");

                if (isLoiMang) {
                    // Hành động: Tuyệt đối giữ nguyên giỏ hàng, thông báo người dùng chỉ việc bấm thử lại
                    this.thongBaoLoi = "Mất kết nối máy chủ khi tạo đơn hàng. Giỏ hàng của bạn vẫn được lưu nguyên vẹn, vui lòng thử lại!";
                    return;
                }

                // Tình huống 5: Phiên đăng nhập hết hạn (401)
                if (err.status === 401) {
                    this.thongBaoLoi = "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại để hoàn tất đơn hàng!";
                    this.$router.push({
                        path: "/login",
                        query: { redirect: "/cart" },
                    });
                    return;
                }

                // Tình huống 6: Lỗi tồn kho từ máy chủ
                if (
                    thongBao.includes("tồn kho") ||
                    thongBao.includes("stock") ||
                    thongBao.includes("hết hàng")
                ) {
                    this.thongBaoLoi = err.message || "Tồn kho sản phẩm đã thay đổi. Vui lòng kiểm tra lại!";
                    return;
                }

                // Lỗi máy chủ khác (500, 503...)
                this.thongBaoLoi = err.message || "Tạo đơn hàng không thành công. Giỏ hàng vẫn được lưu, vui lòng thử lại sau!";
            } finally {
                this.dangThanhToan = false;
            }
        },

        hoanTatDatHang() {
            this.hienPopoverThanhCong = false;
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
