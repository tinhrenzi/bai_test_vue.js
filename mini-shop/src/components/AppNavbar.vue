<template>
    <div>
        <ThemeToggle />
        <DxToolbar class="m3-app-bar">
            <DxItem location="before">
                <DxMenu @item-click="xuLyChonMenu">
                    <DxItem icon="home" text="Mini Shop" />
                    <DxItem icon="cart" text="Giỏ hàng" />
                </DxMenu>
            </DxItem>

            <DxItem location="after">
                <div class="d-flex align-items-center gap-2">
                    <DxTextBox
                        v-if="showSearch"
                        class="m3-search-box d-none d-md-block"
                        :value="keyword"
                        placeholder="Tìm kiếm sản phẩm..."
                        :showClearButton="true"
                        mode="text"
                        :width="240"
                        styling-mode="outlined"
                        @value-changed="xuLyNhapTuKhoa"
                        @enterKey="xuLyTimKiem" />

                    <router-link
                        to="/cart"
                        class="btn btn-outline-primary m3-btn-pill position-relative d-inline-flex align-items-center px-3"
                        style="height: 36px"
                        title="Xem giỏ hàng">
                        <i class="dx-icon-cart me-1"></i>
                        <span class="d-none d-sm-inline">Giỏ</span>
                        <span
                            v-if="cartCount > 0"
                            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                            style="font-size: 11px">
                            {{ cartCount }}
                        </span>
                    </router-link>

                    <DxButton
                        v-if="isAdmin"
                        class="m3-btn-pill"
                        text="Thêm mới"
                        icon="plus"
                        type="default"
                        styling-mode="contained"
                        @click="$emit('open-add-modal')" />

                    <DxButton
                        v-if="!isLoggedIn"
                        class="m3-btn-pill"
                        text="Đăng nhập"
                        icon="user"
                        styling-mode="outlined"
                        @click="$router.push('/login')" />

                    <div v-else class="d-flex align-items-center gap-2">
                        <router-link
                            v-if="isAdmin"
                            to="/admin/products"
                            class="btn btn-sm btn-outline-primary m3-btn-pill"
                            title="Vào trang quản trị">
                            <i class="dx-icon-preferences me-1"></i> Quản trị
                        </router-link>
                        <span
                            v-if="isAdmin"
                            class="badge bg-danger-subtle text-danger border border-danger-subtle">
                            Admin
                        </span>
                        <span
                            v-else
                            class="badge bg-primary-subtle text-primary border border-primary-subtle">
                            Khách hàng
                        </span>
                        <span
                            class="small fw-semibold text-dark d-none d-sm-inline">
                            {{ user?.username }}
                        </span>
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

        <div v-if="showSearch" class="d-block d-md-none mb-3">
            <DxTextBox
                class="m3-search-box w-100"
                :value="keyword"
                placeholder="Tìm kiếm sản phẩm..."
                :showClearButton="true"
                mode="text"
                styling-mode="outlined"
                @value-changed="xuLyNhapTuKhoa"
                @enterKey="xuLyTimKiem" />
        </div>
    </div>
</template>

<script>
import DxToolbar, { DxItem } from "devextreme-vue/toolbar";
import DxMenu from "devextreme-vue/menu";
import { DxTextBox } from "devextreme-vue/text-box";
import { DxButton } from "devextreme-vue/button";
import notify from "devextreme/ui/notify";
import { debounce } from "../utils/debounce";
import ThemeToggle from "./ThemeToggle.vue";

export default {
    name: "AppNavbar",
    components: {
        DxToolbar,
        DxItem,
        DxMenu,
        DxTextBox,
        DxButton,
        ThemeToggle,
    },
    props: {
        keyword: {
            type: String,
            default: "",
        },
        showSearch: {
            type: Boolean,
            default: true,
        },
    },
    emits: ["search", "update:keyword", "open-add-modal"],
    created() {
        this.timKiemDebounce = debounce(() => {
            this.$emit("search", this.keyword);
        }, 400);
    },
    computed: {
        cartCount() {
            return this.$store.getters["cart/count"] || 0;
        },
        isLoggedIn() {
            return this.$store.getters["auth/daDangNhap"];
        },
        user() {
            return this.$store.getters["auth/thongTinUser"];
        },
        isAdmin() {
            return this.$store.getters["auth/laAdmin"];
        },
    },
    methods: {
        xuLyNhapTuKhoa(e) {
            const val = e.value || "";
            this.$emit("update:keyword", val);
            this.timKiemDebounce();
        },
        xuLyTimKiem() {
            if (this.timKiemDebounce && this.timKiemDebounce.cancel) {
                this.timKiemDebounce.cancel();
            }
            this.$emit("search", this.keyword);
        },
        xuLyChonMenu(e) {
            if (
                e.itemData &&
                (e.itemData.icon === "home" || e.itemData.text === "Mini Shop")
            ) {
                this.$router.push("/");
            }
            if (
                e.itemData &&
                (e.itemData.icon === "cart" || e.itemData.text === "Giỏ hàng")
            ) {
                this.$router.push("/cart");
            }
        },
        dangXuat() {
            this.$store.dispatch("auth/dangXuat");
            notify("Đã đăng xuất!", "info", 1500);
            if (this.$route.meta?.yeuCauDangNhap) {
                this.$router.push("/login");
            }
        },
    },
};
</script>
