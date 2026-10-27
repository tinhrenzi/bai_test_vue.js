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
                        :showClearButton="true">
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
                    class="m3-btn-pill w-100 mt-3"
                    text="Đăng nhập"
                    type="default"
                    styling-mode="contained"
                    :disabled="dangTai"
                    :use-submit-behavior="true" />

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
import notify from "devextreme/ui/notify";
import ThemeToggle from "../components/ThemeToggle.vue";
import { DxValidationGroup } from "devextreme-vue/validation-group";
import { DxRequiredRule, DxValidator } from "devextreme-vue/validator";

export default {
    name: "DangNhap",
    components: {
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
                return; // Dừng lại nếu chưa điền đầy đủ
            }

            try {
                const user = await this.$store.dispatch("auth/dangNhap", {
                    username: this.username,
                    password: this.password,
                    expiresInMins: this.hetHan1Phut ? 1 : 30,
                });

                notify("Đăng nhập thành công!", "success", 1500);
                const redirect = this.$route.query.redirect;
                if (redirect) {
                    this.$router.push(redirect);
                } else if (user && user.role === "admin") {
                    this.$router.push("/admin/products");
                } else {
                    this.$router.push("/");
                }
            } catch (err) {
                notify(err.message || "Đăng nhập thất bại!", "error", 2000);
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
