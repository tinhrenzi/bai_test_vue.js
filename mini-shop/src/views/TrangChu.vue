<template>
    <div class="m3-page-container">
        <DxToolbar class="m3-app-bar">
            <DxItem location="before">
                <DxMenu @item-click="onMenuItemClick">
                    <DxItem icon="home"> </DxItem>
                    <DxItem text="About" css-class="d-none d-md-inline-block">
                    </DxItem>
                    <DxItem
                        text="Products"
                        css-class="d-none d-md-inline-block">
                    </DxItem>
                    <DxItem icon="cart"> </DxItem>
                </DxMenu>
            </DxItem>
            <DxItem location="after">
                <div class="d-flex align-items-center gap-2">
                    <DxTextBox
                        class="m3-search-box d-none d-md-block"
                        v-model:value="tuKhoa"
                        placeholder="Tìm kiếm sản phẩm..."
                        :showClearButton="true"
                        mode="text"
                        :width="240"
                        styling-mode="outlined"
                        validationMessageMode="always"
                        @enterKey="xuLyTimKiem" />
                    <router-link
                        to="/cart"
                        class="btn btn-outline-primary m3-btn-pill position-relative d-inline-flex align-items-center px-3"
                        style="height: 36px"
                        title="Xem giỏ hàng">
                        <i class="dx-icon-cart me-1"></i>
                        <span class="d-none d-sm-inline">Giỏ</span>
                        <span
                            v-if="soLuongTrongGio > 0"
                            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                            style="font-size: 11px">
                            {{ soLuongTrongGio }}
                        </span>
                    </router-link>
                    <DxButton
                        v-if="laAdmin"
                        class="m3-btn-pill"
                        text="Thêm mới"
                        icon="plus"
                        type="default"
                        styling-mode="contained"
                        @click="moPopupThem" />
                    <DxButton
                        v-if="!daDangNhap"
                        class="m3-btn-pill"
                        text="Đăng nhập"
                        icon="user"
                        styling-mode="outlined"
                        @click="$router.push('/login')" />
                    <div v-else class="d-flex align-items-center gap-2">
                        <router-link
                            v-if="laAdmin"
                            to="/admin/products"
                            class="btn btn-sm btn-outline-primary m3-btn-pill"
                            title="Vào trang quản trị">
                            <i class="dx-icon-preferences me-1"></i> Quản trị
                        </router-link>
                        <span
                            v-if="laAdmin"
                            class="badge bg-danger-subtle text-danger border border-danger-subtle"
                            >Admin</span
                        >
                        <span
                            v-else
                            class="badge bg-primary-subtle text-primary border border-primary-subtle"
                            >Khách hàng</span
                        >
                        <span
                            class="small fw-semibold text-dark d-none d-sm-inline"
                            >{{ user?.username }}</span
                        >
                        <DxButton
                            class="m3-btn-pill"
                            icon="runner"
                            hint="Đăng xuất"
                            styling-mode="text"
                            @click="dangXuat" />
                    </div>
                </div>
            </DxItem>
        </DxToolbar>

        <div class="d-block d-md-none mb-3">
            <DxTextBox
                class="m3-search-box w-100"
                v-model:value="tuKhoa"
                placeholder="Tìm kiếm sản phẩm..."
                :showClearButton="true"
                mode="text"
                styling-mode="outlined"
                validationMessageMode="always"
                @enterKey="xuLyTimKiem" />
        </div>

        <div class="m3-products-container">
            <div v-if="dangTai" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                </div>
                <p class="mt-2 text-muted small">
                    Đang tải danh sách sản phẩm...
                </p>
            </div>

            <div
                v-else-if="!danhSachSanPham.length"
                class="text-center py-5 text-muted">
                Không có dữ liệu sản phẩm!
            </div>

            <div v-else>
                <div class="m3-card-grid">
                    <div
                        v-for="item in danhSachPhanTrang"
                        :key="item.id"
                        class="m3-product-card">
                        <div class="m3-card-img-wrap">
                            <img
                                :src="
                                    item.thumbnail ||
                                    'https://via.placeholder.com/200'
                                "
                                :alt="item.title"
                                class="m3-card-img" />
                        </div>
                        <div class="m3-card-body">
                            <div>
                                <span class="m3-card-badge">{{
                                    item.category
                                }}</span>
                                <h3 class="m3-card-title">{{ item.title }}</h3>
                                <div class="m3-card-meta">
                                    <span class="m3-card-price"
                                        >${{ item.price }}</span
                                    >
                                    <span class="m3-card-rating"
                                        >★ {{ item.rating }}</span
                                    >
                                </div>
                                <div class="m3-card-stock">
                                    Tồn kho: <strong>{{ item.stock }}</strong>
                                </div>
                            </div>
                            <div v-if="laAdmin" class="m3-card-actions">
                                <DxButton
                                    class="m3-btn-pill m3-table-btn"
                                    text="Sửa"
                                    icon="edit"
                                    type="default"
                                    styling-mode="outlined"
                                    @click="xuLySua(item.id, item)" />
                                <DxButton
                                    class="m3-btn-pill m3-table-btn"
                                    text="Xóa"
                                    icon="trash"
                                    type="danger"
                                    styling-mode="contained"
                                    @click="xuLyXoa(item.id)" />
                            </div>
                            <div v-else class="m3-card-actions">
                                <router-link
                                    :to="'/products/' + item.id"
                                    class="btn btn-outline-secondary m3-btn-pill btn-sm flex-grow-1 py-1">
                                    Chi tiết
                                </router-link>
                                <button
                                    type="button"
                                    class="btn btn-primary m3-btn-pill btn-sm flex-grow-1 py-1 d-inline-flex align-items-center justify-content-center gap-1"
                                    :disabled="item.stock <= 0"
                                    @click="themVaoGio(item)">
                                    <i class="dx-icon-cart"></i>
                                    <span>{{
                                        item.stock > 0 ? "Thêm giỏ" : "Hết hàng"
                                    }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-if="tongSoTrang > 1"
                    class="d-flex justify-content-center align-items-center gap-3 mt-4 mb-3">
                    <DxButton
                        class="m3-btn-pill"
                        text="Trước"
                        icon="chevronleft"
                        styling-mode="outlined"
                        :disabled="trangHienTai === 1"
                        @click="trangHienTai--" />
                    <span class="small fw-semibold text-muted">
                        Trang {{ trangHienTai }} / {{ tongSoTrang }}
                    </span>
                    <DxButton
                        class="m3-btn-pill"
                        text="Sau"
                        icon="chevronright"
                        styling-mode="outlined"
                        :disabled="trangHienTai >= tongSoTrang"
                        @click="trangHienTai++" />
                </div>
            </div>
        </div>

        <DxPopup
            v-model:visible="hienPopupThem"
            title="Thêm sản phẩm mới"
            :width="'min(460px, 92vw)'"
            :max-width="'92vw'"
            :height="'auto'">
            <div
                style="
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    padding: 10px;
                ">
                <div>
                    <label class="form-label">Tên sản phẩm:</label>
                    <DxTextBox
                        v-model:value="sanPhamMoi.title"
                        placeholder="Nhập tên..." />
                </div>
                <div>
                    <label class="form-label">Danh mục:</label>
                    <DxTextBox
                        v-model:value="sanPhamMoi.category"
                        placeholder="Nhập danh mục..." />
                </div>
                <div>
                    <label class="form-label">Giá ($):</label>
                    <DxNumberBox v-model:value="sanPhamMoi.price" :min="0" />
                </div>
                <div>
                    <label class="form-label">Tồn kho:</label>
                    <DxNumberBox v-model:value="sanPhamMoi.stock" :min="0" />
                </div>

                <div
                    style="
                        display: flex;
                        justify-content: flex-end;
                        gap: 8px;
                        margin-top: 10px;
                    ">
                    <DxButton
                        class="m3-btn-pill"
                        text="Hủy"
                        styling-mode="outlined"
                        @click="hienPopupThem = false" />
                    <DxButton
                        class="m3-btn-pill"
                        text="Lưu"
                        type="default"
                        styling-mode="contained"
                        @click="xacNhanThem" />
                </div>
            </div>
        </DxPopup>
    </div>
</template>

<script>
import { DxButton } from "devextreme-vue/button";
import { DxTextBox } from "devextreme-vue/text-box";
import { DxPopup } from "devextreme-vue/popup";
import { DxNumberBox } from "devextreme-vue/number-box";
import notify from "devextreme/ui/notify";
import DxToolbar, { DxItem } from "devextreme-vue/toolbar";
import DxMenu from "devextreme-vue/menu";

import { Them, Sua, Xoa, TimKiem } from "../ultils/CRUD";

export default {
    components: {
        DxButton,
        DxTextBox,
        DxMenu,
        DxToolbar,
        DxItem,
        DxPopup,
        DxNumberBox,
    },
    data() {
        return {
            tuKhoa: "",
            hienPopupThem: false,
            sanPhamMoi: {
                title: "",
                price: 0,
                category: "",
                stock: 0,
            },
            trangHienTai: 1,
            soLuongMoiTrang: 12,
        };
    },
    computed: {
        danhSachSanPham() {
            return this.$store.state.products.items;
        },
        danhSachPhanTrang() {
            const batDau = (this.trangHienTai - 1) * this.soLuongMoiTrang;
            return this.danhSachSanPham.slice(
                batDau,
                batDau + this.soLuongMoiTrang,
            );
        },
        tongSoTrang() {
            return (
                Math.ceil(this.danhSachSanPham.length / this.soLuongMoiTrang) ||
                1
            );
        },
        dangTai() {
            return this.$store.state.products.loading;
        },
        daDangNhap() {
            return this.$store.getters["auth/daDangNhap"];
        },
        user() {
            return this.$store.getters["auth/thongTinUser"];
        },
        laAdmin() {
            return this.$store.getters["auth/laAdmin"];
        },
        laKhachHang() {
            return this.$store.getters["auth/laKhachHang"];
        },
        soLuongTrongGio() {
            return this.$store.getters["cart/count"] || 0;
        },
    },
    mounted() {
        this.taiDuLieu();
    },
    methods: {
        moPopupThem() {
            this.sanPhamMoi = { title: "", price: 0, category: "", stock: 0 };
            this.hienPopupThem = true;
        },
        xacNhanThem() {
            if (!this.sanPhamMoi.title.trim()) {
                notify("Vui lòng nhập tên sản phẩm!", "error", 1500);
                return;
            }
            this.xuLyThem({ ...this.sanPhamMoi });
            this.hienPopupThem = false;
            notify("Thêm sản phẩm thành công!", "success", 1500);
        },
        xuLyXoa(id) {
            this.$store.commit("products/SET_Products", {
                products: Xoa(this.danhSachSanPham, id),
            });
        },

        xuLySua(id, duLieuMoi) {
            this.$store.commit("products/SET_Products", {
                products: Sua(this.danhSachSanPham, id, duLieuMoi),
            });
        },

        xuLyThem(sanPhamMoi) {
            this.$store.commit("products/SET_Products", {
                products: Them(this.danhSachSanPham, sanPhamMoi),
            });
        },
        dangXuat() {
            this.$store.dispatch("auth/dangXuat");
            notify("Đã đăng xuất!", "info", 1500);
        },
        taiDuLieu() {
            this.$store.dispatch("products/fetchProducts", {
                skip: 0,
                limit: 0,
            });
        },
        xuLyTimKiem() {
            this.trangHienTai = 1;
            if (!this.tuKhoa.trim()) return this.taiDuLieu();
            this.$store.commit("products/SET_Products", {
                products: TimKiem(this.danhSachSanPham, this.tuKhoa, [
                    "title",
                    "category",
                ]),
            });
        },
        themVaoGio(item) {
            if (item.stock <= 0) {
                notify("Sản phẩm đã hết hàng!", "warning", 1500);
                return;
            }
            this.$store.dispatch("cart/themVaoGio", {
                sanPham: item,
                soLuong: 1,
            });
            notify(`Đã thêm "${item.title}" vào giỏ hàng!`, "success", 1500);
        },
        onMenuItemClick(e) {
            if (e.itemData && e.itemData.icon === "home")
                this.$router.push("/");
            if (e.itemData && e.itemData.icon === "cart")
                this.$router.push("/cart");
        },
    },
};
</script>

<style></style>
