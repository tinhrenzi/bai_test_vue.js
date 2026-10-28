<template>
    <div class="m3-login-wrapper">
        <ThemeToggle />
        <div class="m3-login-card">
            <div class="m3-login-header">
                <h2 class="m3-login-title">Đăng ký tài khoản</h2>
                <p class="m3-login-subtitle">Tạo tài khoản mới tại Mini Shop</p>
            </div>
            <DxValidationGroup ref="formValidation">
                <form @submit.prevent="xuLyDangKy" class="m3-login-form">
                    <div class="row g-2">
                        <div class="col-6">
                            <DxTextBox
                                label="Họ (*)"
                                class="m3-input"
                                v-model:value="form.lastName">
                                <DxValidator ref="validate">
                                    <DxRequiredRule
                                        message="Không được bỏ trống họ!" /> </DxValidator
                            ></DxTextBox>
                        </div>
                        <div class="col-6">
                            <DxTextBox
                                label="Tên (*)"
                                class="m3-input"
                                v-model:value="form.firstName">
                                <DxValidator ref="validate">
                                    <DxRequiredRule
                                        message="Không được bỏ trống tên!" />
                                </DxValidator>
                            </DxTextBox>
                        </div>
                    </div>

                    <div class="m3-form-group">
                        <DxTextBox
                            label="Tên đăng nhập (*)"
                            class="m3-input"
                            v-model:value="form.username">
                            <DxValidator ref="validate">
                                <DxRequiredRule
                                    message="Không được bỏ trống tên đăng nhập!" />
                            </DxValidator>
                        </DxTextBox>
                    </div>

                    <div class="m3-form-group">
                        <DxTextBox
                            label="Email (*)"
                            class="m3-input"
                            v-model:value="form.email"
                            mode="email">
                            <DxValidator ref="validate">
                                <DxRequiredRule
                                    message="Không được bỏ trống email!" />
                                <DxEmailRule
                                    message="Email không đúng định dạng!" />
                            </DxValidator>
                        </DxTextBox>
                    </div>

                    <div class="m3-form-group">
                        <DxTextBox
                            label="Mật khẩu (*)"
                            class="m3-input"
                            v-model:value="form.password"
                            mode="password">
                            <DxValidator ref="validate">
                                <DxRequiredRule
                                    message="Không được bỏ trống mật khẩu!" />
                                <DxStringLengthRule
                                    :min="6"
                                    message="Mật khẩu không được dưới 6 kí tự!" />
                            </DxValidator>
                        </DxTextBox>
                    </div>

                    <div class="m3-form-group">
                        <DxTextBox
                            label="Xác nhận mật khẩu (*)"
                            class="m3-input"
                            v-model:value="form.confirmPassword"
                            mode="password">
                            <DxValidator ref="validate">
                                <DxRequiredRule
                                    message="Vui lòng nhập lại mật khẩu!" />
                                <DxCompareRule
                                    :comparison-target="soSanhMatKhau"
                                    message="Mật khẩu không khớp!" />
                            </DxValidator>
                        </DxTextBox>
                    </div>

                    <div class="m3-form-group">
                        <select
                            label="Loại tài khoản (*)"
                            class="form-select"
                            v-model="form.role"
                            style="border-radius: 12px; font-size: 14px">
                            <option value="customer">
                                Khách hàng (mua sắm)
                            </option>
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
import {
    DxValidator,
    DxRequiredRule,
    DxCompareRule,
    DxEmailRule,
    DxStringLengthRule,
} from "devextreme-vue/validator";

export default {
    name: "DangKy",
    components: {
        DxValidator,
        DxValidationGroup,
        DxTextBox,
        DxButton,
        DxRequiredRule,
        DxEmailRule,
        DxCompareRule,
        DxStringLengthRule,
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
        soSanhMatKhau() {
            return this.form.password;
        },
        async xuLyDangKy() {
            // 1. Kích hoạt kiểm tra toàn bộ rule
            const group = this.$refs.formValidation?.instance;
            const ketQua = group ? group.validate() : { isValid: true };
            // 2. Nếu có lỗi (thiếu email, pass < 6 ký tự, pass không khớp) ➔ Dừng lại ngay!
            if (!ketQua.isValid) {
                return;
            }
            this.loi = null;
            try {
                await this.$store.dispatch("auth/dangKy", { ...this.form });
                notify("Đăng ký tài khoản thành công!", "success", 1500);
                this.$router.push("/login");
            } catch (err) {
                console.log("🚀 ~ err:", err);
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
    background: var(--md-sys-color-surface);
    border-radius: 24px;
    border: 1px solid var(--md-sys-color-outline-variant);
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
    color: var(--md-sys-color-text-muted);
    margin: 0;
}

.m3-input {
    border-radius: 12px !important;
}
</style>
