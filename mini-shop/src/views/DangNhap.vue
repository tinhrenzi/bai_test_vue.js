<template>
    <div class="m3-login-wrapper">
        <div class="m3-login-card">
            <div class="m3-login-header">
                <h2 class="m3-login-title">Đăng nhập</h2>
                <p class="m3-login-subtitle">Hệ thống quản lý Mini Shop</p>
            </div>

            <form @submit.prevent="xuLyDangNhap" class="m3-login-form">
                <div class="m3-form-group">
                    <label class="form-label">Tên đăng nhập</label>
                    <DxTextBox
                        class="m3-input"
                        v-model:value="username"
                        placeholder="Nhập username (vd: emilys)"
                        mode="text"
                        :showClearButton="true" />
                </div>

                <div class="m3-form-group">
                    <label class="form-label">Mật khẩu</label>
                    <DxTextBox
                        class="m3-input"
                        v-model:value="password"
                        placeholder="Nhập mật khẩu (vd: emilyspass)"
                        mode="password"
                        :showClearButton="true" />
                </div>

                <div
                    v-if="loiDangNhap"
                    class="alert alert-danger py-2 px-3 small">
                    {{ loiDangNhap }}
                </div>

                <div class="m3-demo-box flex-column gap-2">
                    <div
                        class="d-flex justify-content-between align-items-center w-100">
                        <span class="small text-muted"
                            >Admin: <strong>admin</strong> /
                            <strong>admin123</strong></span
                        >
                        <button
                            type="button"
                            class="btn btn-link btn-sm p-0"
                            @click="dienMauAdmin">
                            Điền
                        </button>
                    </div>
                    <div
                        class="d-flex justify-content-between align-items-center w-100 border-top pt-2">
                        <span class="small text-muted"
                            >🛍️ Khách: <strong>khachhang</strong> /
                            <strong>123456</strong></span
                        >
                        <button
                            type="button"
                            class="btn btn-link btn-sm p-0"
                            @click="dienMauKhachHang">
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
            </form>
        </div>
    </div>
</template>

<script>
import { DxTextBox } from "devextreme-vue/text-box";
import { DxButton } from "devextreme-vue/button";
import notify from "devextreme/ui/notify";

export default {
    name: "DangNhap",
    components: {
        DxTextBox,
        DxButton,
    },
    data() {
        return {
            username: "",
            password: "",
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
        dienMauAdmin() {
            this.username = "admin";
            this.password = "admin123";
        },
        dienMauKhachHang() {
            this.username = "khachhang";
            this.password = "123456";
        },
        async xuLyDangNhap() {
            if (!this.username.trim() || !this.password.trim()) {
                notify(
                    "Vui lòng điền đầy đủ tài khoản và mật khẩu!",
                    "warning",
                    1500,
                );
                return;
            }

            try {
                const user = await this.$store.dispatch("auth/dangNhap", {
                    username: this.username,
                    password: this.password,
                    expiresInMins: 30,
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
    background: #ffffff;
    border-radius: 24px;
    border: 1px solid #e0e2ec;
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
    color: #1f1f1f;
    margin: 0 0 6px 0;
}

.m3-login-subtitle {
    font-size: 14px;
    color: #74777f;
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
    color: #444746;
    margin: 0;
}

.m3-input {
    border-radius: 12px !important;
}

.m3-demo-box {
    background-color: #f0f4f9;
    border-radius: 10px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
