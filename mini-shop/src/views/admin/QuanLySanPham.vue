<template>
    <div class="m3-page-container">
        <!-- Header Quản trị -->
        <div class="m3-admin-header mb-4">
            <div
                class="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div>
                    <div class="d-flex align-items-center gap-2 mb-1">
                        <h2 class="m3-admin-title mb-0">Quản lý sản phẩm</h2>
                        <span
                            class="badge bg-danger-subtle text-danger border border-danger-subtle"
                            >Khu vực Admin</span
                        >
                    </div>
                    <p class="m3-admin-subtitle mb-0">
                        Quản trị danh mục và dữ liệu sản phẩm
                    </p>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <router-link
                        to="/admin/dashboard"
                        class="btn btn-outline-primary m3-btn-pill btn-sm">
                        <i class="dx-icon-chart me-1"></i> Biểu đồ thống kê
                    </router-link>
                    <router-link
                        to="/"
                        class="btn btn-outline-secondary m3-btn-pill btn-sm">
                        <i class="dx-icon-home me-1"></i> Về cửa hàng
                    </router-link>
                    <DxButton
                        class="m3-btn-pill"
                        text="Đăng xuất"
                        icon="runner"
                        styling-mode="text"
                        @click="dangXuat" />
                </div>
            </div>
        </div>

        <!-- Bảng DxDataGrid quản trị -->
        <div class="m3-table-card">
            <DxDataGrid
                class="table-page"
                :data-source="dataSource"
                :show-borders="false"
                :allow-column-resizing="true"
                :column-auto-width="true"
                :remote-operations="{ paging: true }"
                key-expr="id"
                height="calc(100vh - 180px)"
                no-data-text="Không có sản phẩm nào!"
                @exporting="onExporting">
                <DxPaging :page-size="10" />
                <DxPager
                    :visible="true"
                    :show-page-size-selector="true"
                    :allowed-page-sizes="[10, 20, 50]"
                    :show-info="true"
                    :show-navigation-buttons="true" />

                <DxEditing
                    mode="popup"
                    :allow-updating="true"
                    :allow-adding="true"
                    :allow-deleting="true"
                    :confirm-delete="true">
                    <DxPopup
                        title="Thông tin sản phẩm"
                        :show-title="true"
                        :width="'min(680px, 92vw)'"
                        :height="'auto'" />
                    <DxForm>
                        <DxItem data-field="title" :col-span="2" />
                        <DxItem data-field="category" />
                        <DxItem data-field="price" />
                        <DxItem data-field="stock" />
                    </DxForm>
                    <DxTexts
                        confirm-delete-message="Bạn có chắc chắn muốn xóa sản phẩm này không?"
                        save-row-button="Lưu"
                        cancel-row-button="Hủy"
                        delete-row="Xóa"
                        edit-row="Sửa"
                        add-row="Thêm sản phẩm" />
                </DxEditing>

                <DxExport :enabled="true" />
                <DxHeaderFilter :visible="true" />
                <DxFilterRow :visible="true" />

                <!-- Các cột dữ liệu -->
                <DxColumn
                    data-field="id"
                    caption="ID"
                    :width="70"
                    :allow-editing="false" />

                <DxColumn
                    data-field="thumbnail"
                    caption="Hình ảnh"
                    :width="90"
                    :allow-sorting="false"
                    :allow-filtering="false"
                    cell-template="anhTemplate" />
                <template #anhTemplate="{ data }">
                    <img
                        :src="data.value || 'https://via.placeholder.com/60'"
                        alt=""
                        style="
                            width: 44px;
                            height: 44px;
                            object-fit: contain;
                            border-radius: 8px;
                            background: #f0f4f9;
                        " />
                </template>

                <DxColumn data-field="title" caption="Tên sản phẩm">
                    <DxRequiredRule
                        message="Tên sản phẩm không được để trống!" />
                </DxColumn>

                <DxColumn data-field="category" caption="Danh mục" :width="180">
                    <DxLookup
                        :data-source="danhMucList"
                        value-expr="slug"
                        display-expr="name" />
                    <DxRequiredRule message="Vui lòng chọn danh mục!" />
                </DxColumn>

                <DxColumn
                    data-field="price"
                    caption="Giá ($)"
                    data-type="number"
                    format="$#,##0.00"
                    :width="130">
                    <DxRequiredRule message="Giá không được để trống!" />
                    <DxRangeRule
                        :min="0"
                        message="Giá phải lớn hơn hoặc bằng 0!" />
                </DxColumn>

                <DxColumn
                    data-field="stock"
                    caption="Tồn kho"
                    data-type="number"
                    :width="120">
                    <DxRequiredRule message="Tồn kho không được để trống!" />
                    <DxRangeRule
                        :min="0"
                        message="Tồn kho phải lớn hơn hoặc bằng 0!" />
                </DxColumn>

                <DxColumn
                    data-field="rating"
                    caption="Đánh giá"
                    data-type="number"
                    :width="110"
                    :allow-editing="false" />
            </DxDataGrid>
        </div>
    </div>
</template>

<script>
import {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxPager,
    DxEditing,
    DxPopup,
    DxForm,
    DxLookup,
    DxRequiredRule,
    DxRangeRule,
    DxExport,
    DxTexts,
    DxHeaderFilter,
    DxFilterRow,
} from "devextreme-vue/data-grid";
import { DxItem } from "devextreme-vue/form";
import { DxButton } from "devextreme-vue/button";
import CustomStore from "devextreme/data/custom_store";
import notify from "devextreme/ui/notify";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Workbook } from "exceljs";
import saveAs from "file-saver";

import {
    layDanhSachSanPham,
    themSanPham,
    suaSanPham,
    xoaSanPham,
    layDanhSachDanhMuc,
} from "../../api/apiProduct";

export default {
    name: "QuanLySanPham",
    components: {
        DxDataGrid,
        DxColumn,
        DxPaging,
        DxPager,
        DxEditing,
        DxPopup,
        DxForm,
        DxItem,
        DxLookup,
        DxRequiredRule,
        DxRangeRule,
        DxExport,
        DxTexts,
        DxHeaderFilter,
        DxFilterRow,
        DxButton,
    },
    data() {
        return {
            danhMucList: [],
            dataSource: null,
        };
    },
    created() {
        this.khoiTaoDataSource();
        this.taiDanhMuc();
    },
    methods: {
        khoiTaoDataSource() {
            this.dataSource = new CustomStore({
                key: "id",
                load: async (loadOptions) => {
                    const skip = loadOptions.skip || 0;
                    const limit = loadOptions.take || 10;
                    try {
                        const resp = await layDanhSachSanPham({
                            boQua: skip,
                            soLuong: limit,
                            truongLay:
                                "id,title,price,thumbnail,category,stock,rating",
                        });
                        return {
                            data: resp.data.products,
                            totalCount: resp.data.total,
                        };
                    } catch (error) {
                        notify(
                            error.message ||
                                "Không thể tải danh sách sản phẩm!",
                            "error",
                            2000,
                        );
                        return { data: [], totalCount: 0 };
                    }
                },
                insert: async (values) => {
                    try {
                        const resp = await themSanPham(values);
                        notify("Thêm sản phẩm thành công!", "success", 1500);
                        return resp.data;
                    } catch (error) {
                        notify(
                            error.message || "Thêm sản phẩm thất bại!",
                            "error",
                            2000,
                        );
                        throw error;
                    }
                },
                update: async (key, values) => {
                    try {
                        const resp = await suaSanPham(key, values);
                        notify(
                            "Cập nhật sản phẩm thành công!",
                            "success",
                            1500,
                        );
                        return resp.data;
                    } catch (error) {
                        notify(
                            error.message || "Cập nhật thất bại!",
                            "error",
                            2000,
                        );
                        throw error;
                    }
                },
                remove: async (key) => {
                    try {
                        await xoaSanPham(key);
                        notify("Đã xóa sản phẩm thành công!", "success", 1500);
                    } catch (error) {
                        notify(
                            error.message || "Xóa sản phẩm thất bại!",
                            "error",
                            2000,
                        );
                        throw error;
                    }
                },
            });
        },
        async taiDanhMuc() {
            try {
                const resp = await layDanhSachDanhMuc();
                this.danhMucList = resp.data;
            } catch (err) {
                console.error("Lỗi tải danh mục:", err);
            }
        },
        onExporting(e) {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet("Products");

            exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(
                        new Blob([buffer], {
                            type: "application/octet-stream",
                        }),
                        "DanhSachSanPham.xlsx",
                    );
                });
            });
            e.cancel = true;
        },
        dangXuat() {
            this.$store.dispatch("auth/dangXuat");
            notify("Đã đăng xuất!", "info", 1500);
            this.$router.push("/login");
        },
    },
};
</script>

<style scoped>
.m3-admin-header {
    background: var(--md-sys-color-surface, #ffffff);
    border-radius: var(--md-sys-shape-corner-large, 16px);
    border: 1px solid var(--md-sys-color-outline-variant, #e0e2ec);
    box-shadow: var(--md-sys-elevation-1, 0 1px 3px rgba(0, 0, 0, 0.05));
    padding: 16px 24px;
}

.m3-admin-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--md-sys-color-text-main, #1f1f1f);
}

.m3-admin-subtitle {
    font-size: 13px;
    color: var(--md-sys-color-text-muted, #74777f);
}
</style>
