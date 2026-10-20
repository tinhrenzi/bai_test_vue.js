<template>
    <div class="m3-login-wrapper">
        <div class="m3-login-card">
            <div class="m3-login-header">
                <h2 class="m3-login-title">Đăng ký tài khoản</h2>
                <p class="m3-login-subtitle">Tạo tài khoản mới tại Mini Shop</p>
            </div>

            <form @submit.prevent="xuLyDangKy" class="m3-login-form">
                <div class="row g-2">
                    <div class="col-6">
                        <label class="form-label">Họ</label>
                        <DxTextBox
                            class="m3-input"
                            v-model:value="form.lastName"
                            placeholder="Họ..." />
                    </div>
                    <div class="col-6">
                        <label class="form-label">Tên</label>
                        <DxTextBox
                            class="m3-input"
                            v-model:value="form.firstName"
                            placeholder="Tên..." />
                    </div>
                </div>

                <div class="m3-form-group">
                    <label class="form-label">Tên đăng nhập</label>
                    <DxTextBox
                        class="m3-input"
                        v-model:value="form.username"
                        placeholder="Nhập username..." />
                </div>

                <div class="m3-form-group">
                    <label class="form-label">Email</label>
                    <DxTextBox
                        class="m3-input"
                        v-model:value="form.email"
                        placeholder="Nhập email..."
                        mode="email" />
                </div>

                <div class="m3-form-group">
                    <label class="form-label">Mật khẩu</label>
                    <DxTextBox
                        class="m3-input"
                        v-model:value="form.password"
                        placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)..."
                        mode="password" />
                </div>

                <div class="m3-form-group">
                    <label class="form-label">Xác nhận mật khẩu</label>
                    <DxTextBox
                        class="m3-input"
                        v-model:value="form.confirmPassword"
                        placeholder="Nhập lại mật khẩu..."
                        mode="password" />
                </div>

                <div class="m3-form-group">
                    <label class="form-label">Loại tài khoản</label>
                    <select
                        class="form-select"
                        v-model="form.role"
                        style="border-radius: 12px; font-size: 14px">
                        <option value="customer">Khách hàng (mua sắm)</option>
                        <option value="admin">Quản trị viên (Admin)</option>
                    </select>
                </div>

                <div v-if="loi" class="alert alert-danger py-2 px-3 small">
                    {{ loi }}
                </div>

                <DxButton
                    class="m3-btn-pill w-100 mt-2"
                    text="Đăng ký"
                    type="default"
                    styling-mode="contained"
                    :disabled="dangTai"
                    :use-submit-behavior="true" />

                <div class="text-center mt-2">
                    <span class="small text-muted">Đã có tài khoản? </span>
                    <router-link
                        to="/login"
                        class="small fw-semibold text-primary text-decoration-none">
                        Đăng nhập ngay
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
    name: "DangKy",
    components: {
        DxTextBox,
        DxButton,
    },
    data() {
        return {
            form: {
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "customer",
            },
            loi: null,
        };
    },
    computed: {
        dangTai() {
            return this.$store.state.auth.dangTai;
        },
    },
    methods: {
        async xuLyDangKy() {
            this.loi = null;
            try {
                await this.$store.dispatch("auth/dangKy", { ...this.form });
                notify("Đăng ký tài khoản thành công!", "success", 1500);
                this.$router.push("/login");
            } catch (err) {
                this.loi = err.message || "Đăng ký thất bại, vui lòng thử lại!";
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
    max-width: 460px;
    background: #ffffff;
    border-radius: 24px;
    border: 1px solid #e0e2ec;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    padding: 32px 28px;
}

.m3-login-header {
    text-align: center;
    margin-bottom: 20px;
}

.m3-login-title {
    font-size: 24px;
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
    gap: 14px;
}

.m3-form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-label {
    font-size: 13px;
    font-weight: 600;
    color: #444746;
    margin: 0;
}

.m3-input {
    border-radius: 12px !important;
}
</style>
