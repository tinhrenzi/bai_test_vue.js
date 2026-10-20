<template>
    <div class="m3-page-container">
        <!-- Header Quản trị -->
        <div class="m3-admin-header mb-4">
            <div
                class="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div>
                    <div class="d-flex align-items-center gap-2 mb-1">
                        <h2 class="m3-admin-title mb-0">Thống kê & Báo cáo</h2>
                        <span
                            class="badge bg-danger-subtle text-danger border border-danger-subtle"
                            >Khu vực Admin</span
                        >
                    </div>
                    <p class="m3-admin-subtitle mb-0">
                        Biểu đồ tổng tồn kho và tỷ lệ sản phẩm theo danh mục
                    </p>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <router-link
                        to="/admin/products"
                        class="btn btn-outline-primary m3-btn-pill btn-sm">
                        <i class="dx-icon-columnproperties me-1"></i> Quản lý
                        sản phẩm
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

        <!-- Trạng thái tải dữ liệu -->
        <div v-if="dangTai" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
            </div>
            <p class="mt-2 text-muted small">
                Đang tổng hợp dữ liệu sản phẩm...
            </p>
        </div>

        <div v-else class="row g-4">
            <!-- 1. Biểu đồ cột: Tổng tồn kho theo danh mục (DxChart) -->
            <div class="col-12 col-xl-7">
                <div class="m3-chart-card">
                    <h3 class="m3-chart-title mb-3">
                        Tổng tồn kho theo danh mục
                    </h3>
                    <DxChart
                        :data-source="duLieuThongKe"
                        id="chart-ton-kho"
                        :palette="'Material'">
                        <DxSeries
                            argument-field="category"
                            value-field="stock"
                            name="Tồn kho"
                            type="bar"
                            color="#0b57d0">
                            <DxChartLabel :visible="true" />
                        </DxSeries>
                        <DxLegend :visible="false" />
                        <DxArgumentAxis>
                            <DxAxisLabel
                                :rotation-angle="45"
                                :overlapping-behavior="'rotate'" />
                        </DxArgumentAxis>
                        <DxChartTooltip
                            :enabled="true"
                            :customize-tooltip="tooltipTonKho" />
                    </DxChart>
                </div>
            </div>

            <!-- 2. Biểu đồ tròn: Tỷ lệ số sản phẩm theo danh mục (DxPieChart) -->
            <div class="col-12 col-xl-5">
                <div class="m3-chart-card">
                    <h3 class="m3-chart-title mb-3">
                        Tỷ lệ số lượng sản phẩm theo danh mục
                    </h3>
                    <DxPieChart
                        :data-source="duLieuThongKe"
                        id="pie-danh-muc"
                        type="doughnut"
                        :palette="'Material'">
                        <DxPieSeries
                            argument-field="category"
                            value-field="count">
                            <DxPieLabel
                                :visible="true"
                                position="columns"
                                :customize-text="customizePieLabel">
                                <DxConnector :visible="true" />
                            </DxPieLabel>
                        </DxPieSeries>
                        <DxPieLegend
                            horizontal-alignment="center"
                            vertical-alignment="bottom"
                            item-text-position="right" />
                        <DxPieTooltip
                            :enabled="true"
                            :customize-tooltip="tooltipTiLe" />
                    </DxPieChart>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    DxChart,
    DxSeries,
    DxLegend,
    DxTooltip as DxChartTooltip,
    DxArgumentAxis,
    DxLabel as DxChartLabel,
} from "devextreme-vue/chart";
import { DxLabel as DxAxisLabel } from "devextreme-vue/chart";
import {
    DxPieChart,
    DxSeries as DxPieSeries,
    DxLabel as DxPieLabel,
    DxConnector,
    DxLegend as DxPieLegend,
    DxTooltip as DxPieTooltip,
} from "devextreme-vue/pie-chart";
import { DxButton } from "devextreme-vue/button";
import notify from "devextreme/ui/notify";

import { layDanhSachSanPham } from "../../api/apiProduct";

export default {
    name: "ThongKe",
    components: {
        DxChart,
        DxSeries,
        DxLegend,
        DxChartTooltip,
        DxArgumentAxis,
        DxChartLabel,
        DxAxisLabel,
        DxPieChart,
        DxPieSeries,
        DxPieLabel,
        DxConnector,
        DxPieLegend,
        DxPieTooltip,
        DxButton,
    },
    data() {
        return {
            dangTai: false,
            duLieuThongKe: [],
        };
    },
    created() {
        this.taiDuLieuThongKe();
    },
    methods: {
        async taiDuLieuThongKe() {
            this.dangTai = true;
            try {
                // Tải toàn bộ sản phẩm bằng limit=0
                const resp = await layDanhSachSanPham({
                    soLuong: 0,
                    truongLay: "category,stock",
                });
                const sanPhams = resp.data.products || [];

                // Tính toán dữ liệu gom nhóm bằng reduce, không gọi API riêng cho từng danh mục
                const thongKeMap = sanPhams.reduce((acc, item) => {
                    const danhMuc = item.category || "Khác";
                    if (!acc[danhMuc]) {
                        acc[danhMuc] = {
                            category: danhMuc,
                            stock: 0,
                            count: 0,
                        };
                    }
                    acc[danhMuc].stock += Number(item.stock) || 0;
                    acc[danhMuc].count += 1;
                    return acc;
                }, {});

                this.duLieuThongKe = Object.values(thongKeMap);
            } catch (err) {
                notify(
                    err.message || "Không thể tải dữ liệu thống kê!",
                    "error",
                    2000,
                );
            } finally {
                this.dangTai = false;
            }
        },
        tooltipTonKho(arg) {
            return {
                text: `<b>${arg.argumentText}</b><br/>Tổng tồn kho: ${arg.valueText}`,
            };
        },
        tooltipTiLe(arg) {
            return {
                text: `<b>${arg.argumentText}</b><br/>Số sản phẩm: ${arg.valueText} (${(arg.percent * 100).toFixed(1)}%)`,
            };
        },
        customizePieLabel(arg) {
            return `${arg.argumentText}: ${(arg.percent * 100).toFixed(0)}%`;
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

.m3-chart-card {
    background: var(--md-sys-color-surface, #ffffff);
    border-radius: var(--md-sys-shape-corner-large, 16px);
    border: 1px solid var(--md-sys-color-outline-variant, #e0e2ec);
    box-shadow: var(--md-sys-elevation-1, 0 1px 3px rgba(0, 0, 0, 0.05));
    padding: 20px;
    height: 100%;
}

.m3-chart-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--md-sys-color-text-main, #1f1f1f);
}
</style>
