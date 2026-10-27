<template>
    <div class="m3-page-container">
        <AppNavbar
            :keyword="tuKhoa"
            @update:keyword="xuLyDoiTuKhoa"
            @search="xuLyTimKiem"
            @open-add-modal="moPopupThem" />

        <div class="m3-filter-bar mb-4 p-3 bg-white border rounded-4 shadow-sm">
            <div class="row g-2 align-items-center">
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                    <label class="form-label small fw-semibold text-muted mb-1"
                        >Danh mục:</label
                    >
                    <select
                        class="form-select form-select-sm m3-select"
                        v-model="danhMuc"
                        @change="xuLyDoiDanhMuc">
                        <option value="">-- Tất cả danh mục --</option>
                        <option
                            v-for="dm in danhSachDanhMuc"
                            :key="dm.slug || dm"
                            :value="dm.slug || dm">
                            {{ dm.name || dm }}
                        </option>
                    </select>
                </div>

                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                    <label class="form-label small fw-semibold text-muted mb-1"
                        >Sắp xếp theo:</label
                    >
                    <select
                        class="form-select form-select-sm m3-select"
                        v-model="kieuSapXep"
                        @change="xuLyDoiSapXep">
                        <option value="">Mặc định</option>
                        <option value="price_asc">Giá: Thấp đến cao</option>
                        <option value="price_desc">Giá: Cao đến thấp</option>
                        <option value="rating_desc">
                            Đánh giá: Cao đến thấp
                        </option>
                        <option value="rating_asc">
                            Đánh giá: Thấp đến cao
                        </option>
                    </select>
                </div>

                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                    <label class="form-label small fw-semibold text-muted mb-1"
                        >Giả lập mạng (delay):</label
                    >
                    <select
                        class="form-select form-select-sm m3-select"
                        v-model="doTre"
                        @change="xuLyDoiDoTre">
                        <option :value="0">Bình thường (0ms)</option>
                        <option :value="1000">Chậm 1 giây (1000ms)</option>
                        <option :value="2000">Chậm 2 giây (2000ms)</option>
                        <option :value="3000">Chậm 3 giây (3000ms)</option>
                        <option :value="5000">Chậm 5 giây (5000ms)</option>
                    </select>
                </div>

                <div
                    class="col-12 col-sm-6 col-md-12 col-lg-3 text-lg-end mt-sm-auto pt-2">
                    <button
                        v-if="coBoLocDangChon"
                        type="button"
                        class="btn btn-outline-secondary m3-btn-pill btn-sm w-100 w-lg-auto"
                        @click="xoaBoLoc">
                        <i class="dx-icon-clear me-1"></i> Xóa bộ lọc
                    </button>
                    <span v-else class="text-muted small">
                        Hiển thị {{ danhSachSanPham.length }} /
                        {{ tongSoLuong }} sản phẩm
                    </span>
                </div>
            </div>
        </div>

        <div class="m3-products-container">
            <ProductSkeleton v-if="dangTai" :count="12" />

            <div
                v-else-if="loi"
                class="alert alert-danger py-4 text-center my-3 border-0 shadow-sm rounded-4">
                <i class="dx-icon-warning fs-2 text-danger mb-2 d-block"></i>
                <h5 class="fw-semibold">Không thể tải danh sách sản phẩm</h5>
                <p class="mb-3 text-muted small">{{ loi }}</p>
                <button
                    type="button"
                    class="btn btn-outline-danger m3-btn-pill btn-sm px-4"
                    @click="taiDuLieu">
                    <i class="dx-icon-refresh me-1"></i> Thử lại
                </button>
            </div>

            <div
                v-else-if="!danhSachSanPham.length"
                class="text-center py-5 bg-white border rounded-4 my-3 shadow-sm">
                <div class="mb-3">
                    <i
                        class="dx-icon-find"
                        style="font-size: 54px; color: #a8c7fa"></i>
                </div>
                <h5 class="fw-semibold text-dark mb-1">
                    Không tìm thấy sản phẩm phù hợp!
                </h5>
                <p class="text-muted small mb-3">
                    Không có sản phẩm nào khớp với điều kiện tìm kiếm hoặc bộ
                    lọc hiện tại.
                </p>
                <button
                    type="button"
                    class="btn btn-primary m3-btn-pill btn-sm px-4"
                    @click="xoaBoLoc">
                    Đặt lại bộ lọc
                </button>
            </div>

            <div v-else>
                <div class="m3-card-grid">
                    <ProductCard
                        v-for="item in danhSachSanPham"
                        :key="item.id"
                        :product="item"
                        :is-admin="laAdmin"
                        @add-to-cart="themVaoGio"
                        @edit="xuLySua(item.id, $event)"
                        @delete="xuLyXoa(item.id)" />
                </div>

                <AppPagination
                    :current-page="trangHienTai"
                    :total-pages="tongSoTrang"
                    @page-change="xuLyDoiTrang" />
            </div>
        </div>

        <DxPopup
            v-model:visible="hienPopupThem"
            title="Thêm sản phẩm mới"
            :width="'min(460px, 92vw)'"
            :max-width="'92vw'"
            :height="'auto'">
            <DxValidationGroup ref="themSanPhamGroup">
                <div
                    style="
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                        padding: 10px;
                    ">
                    <!-- Tên sản phẩm -->
                    <div class="mb-2">
                        <DxTextBox
                            label="Tên sản phẩm (*)"
                            v-model:value="sanPhamMoi.title"
                            validationMessageMode="always">
                            <DxValidator>
                                <DxRequiredRule
                                    message="Tên sản phẩm không được để trống!" />
                            </DxValidator>
                        </DxTextBox>
                    </div>

                    <!-- Danh mục -->
                    <div style="margin-left: 1px;">
                        <DxSelectBox
                            label="Danh mục (*)"
                            v-model:value="sanPhamMoi.category"
                            :data-source="danhSachDanhMuc"
                            value-expr="slug"
                            display-expr="name"
                            validationMessageMode="always">
                            <DxValidator>
                                <DxRequiredRule
                                    message="Vui lòng chọn danh mục!" />
                            </DxValidator>
                        </DxSelectBox>
                    </div>

                    <!-- Giá sản phẩm -->
                    <div>
                        <DxNumberBox
                            label="Giá($)"
                            v-model:value="sanPhamMoi.price"
                            :min="0"
                            format="$#,##0.00"
                            validationMessageMode="always">
                            <DxValidator>
                                <DxRequiredRule
                                    message="Giá không được để trống!" />
                                <DxRangeRule
                                    :min="0.1"
                                    message="Giá sản phẩm phải lớn hơn 0!" />
                            </DxValidator>
                        </DxNumberBox>
                    </div>

                    <!-- Tồn kho -->
                    <div>
                        <DxNumberBox
                            label="Tồn kho:"
                            v-model:value="sanPhamMoi.stock"
                            :min="0"
                            validationMessageMode="always">
                            <DxValidator>
                                <DxRequiredRule
                                    message="Tồn kho không được để trống!" />
                                <DxRangeRule
                                    :min="0"
                                    message="Tồn kho phải từ 0 trở lên!" />
                            </DxValidator>
                        </DxNumberBox>
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
            </DxValidationGroup>
        </DxPopup>
    </div>
</template>

<script>
import { DxValidationGroup } from "devextreme-vue/validation-group";
import { DxButton } from "devextreme-vue/button";
import { DxTextBox } from "devextreme-vue/text-box";
import { DxPopup } from "devextreme-vue/popup";
import { DxNumberBox } from "devextreme-vue/number-box";
import notify from "devextreme/ui/notify";

import AppNavbar from "../components/AppNavbar.vue";
import ProductCard from "../components/ProductCard.vue";
import ProductSkeleton from "../components/ProductSkeleton.vue";
import AppPagination from "../components/AppPagination.vue";
import { DxSelectBox, DxValidator } from "devextreme-vue";
import { DxRangeRule, DxRequiredRule } from "devextreme-vue/cjs/data-grid";

export default {
    name: "TrangChu",
    components: {
        DxRequiredRule,
        DxValidationGroup,
        DxButton,
        DxTextBox,
        DxPopup,
        DxNumberBox,
        DxValidator,
        DxRangeRule,
        DxSelectBox,
        AppNavbar,
        ProductCard,
        ProductSkeleton,
        AppPagination,
    },
    data() {
        return {
            tuKhoa: "",
            danhMuc: "",
            kieuSapXep: "",
            doTre: 0,
            trangHienTai: 1,
            soLuongMoiTrang: 12,
            danhSachDanhMuc: [],
            hienPopupThem: false,
            sanPhamMoi: {
                title: "",
                price: 0,
                category: "",
                stock: 0,
            },
        };
    },
    computed: {
        danhSachSanPham() {
            return this.$store.state.products.danhSach || [];
        },
        tongSoLuong() {
            return this.$store.state.products.tongSo || 0;
        },
        tongSoTrang() {
            return Math.ceil(this.tongSoLuong / this.soLuongMoiTrang) || 1;
        },
        dangTai() {
            return this.$store.state.products.dangTai;
        },
        loi() {
            return this.$store.state.products.loi;
        },
        laAdmin() {
            return this.$store.getters["auth/laAdmin"];
        },
        coBoLocDangChon() {
            return !!(
                this.tuKhoa ||
                this.danhMuc ||
                this.kieuSapXep ||
                this.doTre > 0 ||
                this.trangHienTai > 1
            );
        },
    },
    watch: {
        "$route.query": {
            immediate: true,
            handler() {
                this.dongBoTuURLVaTai();
            },
        },
    },
    mounted() {
        this.taiDanhMuc();
    },
    methods: {
        async taiDanhMuc() {
            try {
                const data = await this.$store.dispatch(
                    "products/taiDanhSachDanhMuc",
                );
                this.danhSachDanhMuc = data || [];
            } catch (err) {
                console.warn("Lỗi tải danh sách danh mục:", err);
            }
        },

        dongBoTuURLVaTai() {
            const query = this.$route.query;

            this.tuKhoa = query.q || "";
            this.danhMuc = query.category || "";
            this.kieuSapXep = query.sort || "";
            this.trangHienTai = parseInt(query.page) || 1;
            this.doTre = parseInt(query.delay) || 0;

            this.taiDuLieu();
        },

        taiDuLieu() {
            let sortBy = "";
            let order = "asc";

            if (this.kieuSapXep === "price_asc") {
                sortBy = "price";
                order = "asc";
            } else if (this.kieuSapXep === "price_desc") {
                sortBy = "price";
                order = "desc";
            } else if (this.kieuSapXep === "rating_desc") {
                sortBy = "rating";
                order = "desc";
            } else if (this.kieuSapXep === "rating_asc") {
                sortBy = "rating";
                order = "asc";
            }

            const skip = (this.trangHienTai - 1) * this.soLuongMoiTrang;

            this.$store.dispatch("products/taiDanhSachSanPham", {
                limit: this.soLuongMoiTrang,
                skip,
                q: this.tuKhoa,
                category: this.danhMuc,
                sortBy,
                order,
                delay: this.doTre,
            });
        },

        capNhatURL(thayDoi = {}) {
            const queryHienTai = { ...this.$route.query, ...thayDoi };

            Object.keys(queryHienTai).forEach((k) => {
                if (
                    queryHienTai[k] === "" ||
                    queryHienTai[k] === null ||
                    queryHienTai[k] === undefined ||
                    (k === "page" && queryHienTai[k] === 1) ||
                    (k === "delay" && queryHienTai[k] === 0)
                ) {
                    delete queryHienTai[k];
                }
            });

            if (
                JSON.stringify(queryHienTai) !==
                JSON.stringify(this.$route.query)
            ) {
                this.$router.push({ query: queryHienTai });
            }
        },

        xuLyDoiTrang(newPage) {
            this.capNhatURL({ page: newPage });
        },

        xuLyDoiDanhMuc() {
            this.capNhatURL({ category: this.danhMuc || undefined, page: 1 });
        },

        xuLyDoiSapXep() {
            this.capNhatURL({ sort: this.kieuSapXep || undefined, page: 1 });
        },

        xuLyDoiDoTre() {
            this.capNhatURL({ delay: this.doTre || undefined });
        },

        xuLyDoiTuKhoa(tuKhoaMoi) {
            this.tuKhoa = tuKhoaMoi;
        },

        xuLyTimKiem(tuKhoaMoi) {
            this.capNhatURL({ q: tuKhoaMoi || undefined, page: 1 });
        },

        xoaBoLoc() {
            this.tuKhoa = "";
            this.danhMuc = "";
            this.kieuSapXep = "";
            this.doTre = 0;
            this.trangHienTai = 1;
            this.$router.push({ path: "/" });
        },

        moPopupThem() {
            this.sanPhamMoi = { title: "", price: 0, category: "", stock: 0 };
            this.$refs.themSanPhamGroup?.instance?.reset();
            this.hienPopupThem = true;
        },

        async xacNhanThem() {
            const group = this.$refs.themSanPhamGroup?.instance;
            const ketQua = group ? group.validate() : { isValid: true };

            if (!ketQua.isValid) {
                return;
            }

            try {
                await this.$store.dispatch("products/themSanPham", {
                    ...this.sanPhamMoi,
                });
                this.hienPopupThem = false;
                notify("Thêm sản phẩm thành công!", "success", 1500);
                this.taiDuLieu();
            } catch (e) {
                notify(e.message || "Thêm sản phẩm thất bại!", "error", 2000);
            }
        },

        async xuLyXoa(id) {
            if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
                try {
                    await this.$store.dispatch("products/xoaSanPham", id);
                    notify("Đã xóa sản phẩm thành công!", "success", 1500);
                    this.taiDuLieu();
                } catch (e) {
                    notify(e.message || "Xóa thất bại!", "error", 2000);
                }
            }
        },

        async xuLySua(id, duLieuMoi) {
            try {
                await this.$store.dispatch("products/suaSanPham", {
                    id,
                    duLieu: duLieuMoi,
                });
                notify("Cập nhật sản phẩm thành công!", "success", 1500);
                this.taiDuLieu();
            } catch (e) {
                notify(e.message || "Cập nhật thất bại!", "error", 2000);
            }
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
    },
};
</script>

<style scoped>
.m3-select {
    border-radius: 12px;
    border-color: var(--md-sys-color-outline-variant, #e0e2ec);
    font-size: 13px;
    padding: 6px 12px;
}
.m3-select:focus {
    border-color: var(--md-sys-color-primary, #0b57d0);
    box-shadow: 0 0 0 2px rgba(11, 87, 208, 0.15);
}
</style>
