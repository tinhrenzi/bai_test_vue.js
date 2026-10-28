<template>
    <div class="m3-login-wrapper">
        <ThemeToggle />
        <div class="m3-login-card">
            <div class="m3-login-header">
                <h2 class="m3-login-title">Đăng nhập</h2>
                <p class="m3-login-subtitle">Hệ thống quản lý Mini Shop</p>
            </div>
            <DxValidationGroup ref="formValidation">
                <div class="m3-form-group">
                    <DxTextBox
                        label="Tên đăng nhập (*)"
                        class="m3-input"
                        v-model:value="username"
                        mode="text"
                        :showClearButton="true">
                        <DxValidator ref="validate">
                            <DxRequiredRule
                                message="Không được bỏ trống tên đăng nhập!" />
                        </DxValidator>
                    </DxTextBox>
                </div>

                <div class="m3-form-group">
                    <DxTextBox
                        label="Mật khẩu (*)"
                        class="m3-input"
                        v-model:value="password"
                        mode="password"
                        :showClearButton="true"
                        @enter-key="xuLyDangNhap">
                        <DxValidator ref="validate">
                            <DxRequiredRule
                                message="Không được bỏ trống mật khẩu!" />
                        </DxValidator>
                    </DxTextBox>
                </div>

                <div class="m3-form-group">
                    <div class="form-check form-switch mt-1">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            id="checkExpires1"
                            v-model="hetHan1Phut" />
                        <label
                            class="form-check-label small text-muted"
                            for="checkExpires1">
                            Hết hạn sau <strong>1 phút</strong> (kiểm thử 401 &
                            refresh token)
                        </label>
                    </div>
                </div>

                <div
                    v-if="loiDangNhap"
                    class="alert alert-danger py-2 px-3 small">
                    {{ loiDangNhap }}
                </div>

                <div class="m3-demo-box flex-column gap-2">
                    <div
                        class="d-flex justify-content-between align-items-center w-100">
                        <span class="small text-muted">
                            Admin (API): <strong>emilys</strong> /
                            <strong>emilyspass</strong></span
                        >
                        <button
                            type="button"
                            class="btn btn-link btn-sm p-0 text-decoration-none"
                            @click="dienMauEmilys">
                            Điền
                        </button>
                    </div>
                    <div
                        class="d-flex justify-content-between align-items-center w-100 border-top pt-2">
                        <span class="small text-muted">
                            Khách (API): <strong>michaelw</strong> /
                            <strong>michaelwpass</strong></span
                        >
                        <button
                            type="button"
                            class="btn btn-link btn-sm p-0 text-decoration-none"
                            @click="dienMauMichael">
                            Điền
                        </button>
                    </div>
                    <div
                        class="d-flex justify-content-between align-items-center w-100 border-top pt-2">
                        <span class="small text-muted">
                            Nội bộ: <strong>admin</strong> /
                            <strong>admin</strong> (hoặc admin123)</span
                        >
                        <button
                            type="button"
                            class="btn btn-link btn-sm p-0 text-decoration-none"
                            @click="dienMauAdmin">
                            Điền
                        </button>
                    </div>
                </div>

                <DxButton
                    id="btn-dang-nhap"
                    class="m3-btn-pill w-100 mt-3"
                    text="Đăng nhập"
                    type="default"
                    styling-mode="contained"
                    :disabled="dangTai"
                    @click="xuLyDangNhap()" />
                <DxPopover
                    target="#btn-dang-nhap"
                    v-model:visible="hienPopover"
                    :show-title="true"
                    title="Thông báo hệ thống"
                    position="top"
                    :width="320"
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
                            Đăng nhập thành công!
                        </h6>
                        <p class="text-muted small mb-3">
                            Xin chào
                            <strong>{{
                                thongTinUser?.firstName ||
                                thongTinUser?.username
                            }}</strong>
                        </p>
                        <button
                            type="button"
                            class="btn btn-primary btn-sm m3-btn-pill w-100"
                            @click="chuyenTrang">
                            Vào trang ngay
                            <i class="dx-icon-chevronnext ms-1"></i>
                        </button>
                    </div>
                </DxPopover>
                <div class="text-center mt-2">
                    <span class="small text-muted">Chưa có tài khoản? </span>
                    <router-link
                        to="/register"
                        class="small fw-semibold text-primary text-decoration-none">
                        Đăng ký ngay
                    </router-link>
                </div>
            </DxValidationGroup>
        </div>
    </div>
</template>

<script>
import { DxTextBox } from "devextreme-vue/text-box";
import { DxButton } from "devextreme-vue/button";
import ThemeToggle from "../components/ThemeToggle.vue";
import { DxValidationGroup } from "devextreme-vue/validation-group";
import { DxRequiredRule, DxValidator } from "devextreme-vue/validator";
import { DxPopover } from "devextreme-vue/popover";

export default {
    name: "DangNhap",
    components: {
        DxPopover,
        DxTextBox,
        DxButton,
        ThemeToggle,
        DxValidationGroup,
        DxValidator,
        DxRequiredRule,
    },
    data() {
        return {
            username: "",
            password: "",
            hetHan1Phut: false,
            hienPopover: false,
            thongTinUser: null,
        };
    },
    computed: {
        dangTai() {
            return this.$store.state.auth.dangTai;
        },
        loiDangNhap() {
            return this.$store.state.auth.loi;
        },
    },
    methods: {
        dienMauEmilys() {
            this.username = "emilys";
            this.password = "emilyspass";
        },
        dienMauMichael() {
            this.username = "michaelw";
            this.password = "michaelwpass";
        },
        dienMauAdmin() {
            this.username = "admin";
            this.password = "admin";
        },
        dienMauKhachHang() {
            this.username = "khachhang";
            this.password = "123456";
        },
        async xuLyDangNhap() {
            const ketQua = this.$refs.formValidation?.instance?.validate();
            if (!ketQua || !ketQua.isValid) {
                this.hienPopover = false;
                return;
            }

            try {
                const user = await this.$store.dispatch("auth/dangNhap", {
                    username: this.username,
                    password: this.password,
                    expiresInMins: this.hetHan1Phut ? 1 : 30,
                });

                this.thongTinUser = user;
                // Hiển thị popover với nền mờ tối khi đăng nhập thành công
                this.hienPopover = true;
            } catch (err) {
                this.hienPopover = false;
                console.log("🚀 ~ err:", err);
            }
        },
        chuyenTrang() {
            this.hienPopover = false;
            const redirect = this.$route.query.redirect;
            if (redirect) {
                this.$router.push(redirect);
            } else if (
                this.thongTinUser &&
                this.thongTinUser.role === "admin"
            ) {
                this.$router.push("/admin/products");
            } else {
                this.$router.push("/");
            }
        },
    },
};
</script>

<style scoped>
.m3-login-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: var(--md-sys-color-background, #f8fafd);
}

.m3-login-card {
    width: 100%;
    max-width: 420px;
    background: var(--md-sys-color-surface);
    border-radius: 24px;
    border: 1px solid var(--md-sys-color-outline-variant);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    padding: 32px 28px;
}

.m3-login-header {
    text-align: center;
    margin-bottom: 24px;
}

.m3-login-title {
    font-size: 26px;
    font-weight: 700;
    color: var(--md-sys-color-text-main);
    margin: 0 0 6px 0;
}

.m3-login-subtitle {
    font-size: 14px;
    color: var(--md-sys-color-text-muted);
    margin: 0;
}

.m3-login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.m3-form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.m3-form-group .form-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--md-sys-color-text-muted);
    margin: 0;
}

.m3-input {
    border-radius: 12px !important;
}

.m3-demo-box {
    background-color: var(--md-sys-color-surface-container);
    border-radius: 10px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
