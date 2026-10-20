<template>
    <div class="m3-page-container">
        <DxToolbar class="m3-app-bar">
            <DxItem location="before">
                <DxMenu>
                    <DxItem icon="home"> </DxItem>
                    <DxItem text="About"> </DxItem>
                    <DxItem text="Products"> </DxItem>
                    <DxItem icon="cart"> </DxItem>
                </DxMenu>
            </DxItem>
            <DxItem location="after">
                <div style="display: flex; align-items: center; gap: 8px">
                    <DxTextBox
                        class="m3-search-box"
                        v-model:value="tuKhoa"
                        placeholder="Tìm kiếm sản phẩm..."
                        :showClearButton="true"
                        mode="text"
                        :width="360"
                        styling-mode="outlined"
                        validationMessageMode="always"
                        @enterKey="xuLyTimKiem" />
                    <DxButton
                        class="m3-btn-pill"
                        text="Thêm mới"
                        icon="plus"
                        type="default"
                        styling-mode="contained"
                        @click="moPopupThem" />
                </div>
            </DxItem>
        </DxToolbar>

        <div class="m3-table-card">
            <DxDataGrid
                class="table-page"
                :show-borders="false"
                :data-source="danhSachSanPham"
                :allow-column-resizing="true"
                :column-auto-width="true"
                :loadPanel="{ showIndicator: false, showPane: false, text: '' }"
                key-expr="id"
                height="calc(100vh - 140px)"
                no-data-text="Không có dữ liệu!"
                @cellHoverChanged="onCellHoverChanged">
                <DxPaging :page-size="12" />
                <DxScrolling mode="standard" row-rendering-mode="standard" />
                <DxColumnFixing :enabled="true" />
                <DxHeaderFilter :visible="true" />
                <DxColumn
                    :allowFiltering="true"
                    :allowSorting="true"
                    :fixed="true"
                    :header-filter="{ dataSource: dataSourceFilter }"
                    data-field="id"
                    caption="ID"
                    groupCellTemplate="groupCellTemplate">
                </DxColumn>
                <DxColumn
                    :allowFiltering="true"
                    :allowSorting="true"
                    :fixed="true"
                    :header-filter="{ dataSource: dataSourceFilter }"
                    data-field="title"
                    caption="Tên"
                    groupCellTemplate="groupCellTemplate">
                </DxColumn>
                <DxColumn
                    :allowFiltering="true"
                    :allowSorting="true"
                    :fixed="true"
                    :header-filter="{ dataSource: dataSourceFilter }"
                    data-field="price"
                    caption="Giá"
                    groupCellTemplate="groupCellTemplate">
                </DxColumn>
                <DxColumn
                    :allowFiltering="true"
                    :allowSorting="true"
                    :fixed="true"
                    :header-filter="{ dataSource: dataSourceFilter }"
                    data-field="category"
                    caption="Danh Mục"
                    groupCellTemplate="groupCellTemplate">
                </DxColumn>
                <DxColumn
                    :allowFiltering="true"
                    :allowSorting="true"
                    :fixed="true"
                    :header-filter="{ dataSource: dataSourceFilter }"
                    data-field="stock"
                    caption="Tồn kho"
                    groupCellTemplate="groupCellTemplate">
                </DxColumn>
                <DxColumn
                    :allowFiltering="true"
                    :allowSorting="true"
                    :fixed="true"
                    :header-filter="{ dataSource: dataSourceFilter }"
                    data-field="rating"
                    caption="Đánh giá"
                    groupCellTemplate="groupCellTemplate">
                </DxColumn>
                <DxColumn
                    caption="Hành động"
                    alignment="center"
                    :width="220"
                    cell-template="actionTemplate">
                </DxColumn>
                <template #actionTemplate="{ data }">
                    <div class="m3-action-wrapper">
                        <DxButton
                            class="m3-btn-pill m3-table-btn"
                            text="Sửa"
                            icon="edit"
                            type="default"
                            styling-mode="outlined"
                            @click="xuLySua(data.data.id, data.data)" />

                        <DxButton
                            class="m3-btn-pill m3-table-btn"
                            text="Xóa"
                            icon="trash"
                            type="danger"
                            styling-mode="contained"
                            @click="xuLyXoa(data.data.id)" />
                    </div>
                </template>
                <DxPaging :page-size="12" />
                <DxPager
                    :visible="true"
                    :show-page-size-selector="true"
                    :allowed-page-sizes="[12, 24, 36, 48]"
                    :show-info="true"
                    :show-navigation-buttons="true" />
            </DxDataGrid>
        </div>

        <DxPopup
            v-model:visible="hienPopupThem"
            title="Thêm sản phẩm mới"
            :width="480"
            :height="420">
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
import {
    DxDataGrid,
    DxPaging,
    DxScrolling,
    DxColumnFixing,
    DxHeaderFilter,
    DxFilterRow,
    DxSelection,
    DxColumn,
    DxSummary,
    DxGroupItem,
    DxPager,
} from "devextreme-vue/data-grid";
import { DxButton } from "devextreme-vue/button";
import { DxTextBox } from "devextreme-vue/text-box";
import { DxPopup } from "devextreme-vue/popup";
import { DxNumberBox } from "devextreme-vue/number-box";
import notify from "devextreme/ui/notify";
import "devextreme/ui/text_box";
import DxToolbar, { DxItem } from "devextreme-vue/toolbar";
import DxMenu from "devextreme-vue/menu";

import { Them, Sua, Xoa, TimKiem } from "../ultils/CRUD";

export default {
    components: {
        DxDataGrid,
        DxPaging,
        DxScrolling,
        DxColumnFixing,
        DxHeaderFilter,
        DxFilterRow,
        DxSelection,
        DxColumn,
        DxSummary,
        DxGroupItem,
        DxButton,
        DxTextBox,
        DxMenu,
        DxToolbar,
        DxItem,
        DxPager,
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
        };
    },
    computed: {
        danhSachSanPham() {
            return this.$store.state.products.items;
        },

        dangTai() {
            return this.$store.state.products.loading;
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
        taiDuLieu() {
            this.$store.dispatch("products/fetchProducts", {
                skip: 0,
                limit: 0,
            });
        },
        xuLyTimKiem() {
            if (!this.tuKhoa.trim()) return this.taiDuLieu();
            this.$store.commit("products/SET_Products", {
                products: TimKiem(this.danhSachSanPham, this.tuKhoa, [
                    "title",
                    "category",
                ]),
            });
        },
    },
};
</script>

<style></style>
