<template>
    <div class="m3-login-wrapper">
        <ThemeToggle />
        <div class="m3-login-card">
            <div class="m3-login-header">
                <h2 class="m3-login-title">Đăng ký tài khoản</h2>
                <p class="m3-login-subtitle">Tạo tài khoản mới tại Mini Shop</p>
            </div>
            <DxValidationGroup ref="formValidation">
                <div class="m3-login-form">
                    <div class="row g-2">
                        <div class="col-6">
                            <DxTextBox
                                label="Họ (*)"
                                class="m3-input"
                                v-model:value="form.lastName"
                                :disabled="dangTai">
                                <DxValidator ref="validate">
                                    <DxRequiredRule
                                        message="Không được bỏ trống họ!" />
                                </DxValidator>
                            </DxTextBox>
                        </div>
                        <div class="col-6">
                            <DxTextBox
                                label="Tên (*)"
                                class="m3-input"
                                v-model:value="form.firstName"
                                :disabled="dangTai">
                                <DxValidator ref="validate">
                                    <DxRequiredRule
                                        message="Không được bỏ trống tên!" />
                                </DxValidator>
                            </DxTextBox>
                        </div>
                    </div>

                    <div class="m3-form-group">
                        <DxTextBox
                            ref="usernameBox"
                            label="Tên đăng nhập (*)"
                            class="m3-input"
                            v-model:value="form.username"
                            :disabled="dangTai"
                            :showClearButton="true">
                            <DxValidator ref="validate">
                                <DxRequiredRule
                                    message="Không được bỏ trống tên đăng nhập!" />
                            </DxValidator>
                        </DxTextBox>
                    </div>

                    <div class="m3-form-group">
                        <DxTextBox
                            ref="emailBox"
                            label="Email (*)"
                            class="m3-input"
                            v-model:value="form.email"
                            mode="email"
                            :disabled="dangTai"
                            :showClearButton="true">
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
                            ref="passwordBox"
                            label="Mật khẩu (*)"
                            class="m3-input"
                            v-model:value="form.password"
                            mode="password"
                            :disabled="dangTai"
                            :showClearButton="true">
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
                            ref="confirmPasswordBox"
                            label="Xác nhận mật khẩu (*)"
                            class="m3-input"
                            v-model:value="form.confirmPassword"
                            mode="password"
                            :disabled="dangTai"
                            :showClearButton="true">
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
                            :disabled="dangTai"
                            style="border-radius: 12px; font-size: 14px">
                            <option value="customer">
                                Khách hàng (mua sắm)
                            </option>
                            <option value="admin">Quản trị viên (Admin)</option>
                        </select>
                    </div>

                    <div
                        v-if="loi"
                        class="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2">
                        <i class="dx-icon-warning text-danger fs-5"></i>
                        <span>{{ loi }}</span>
                    </div>

                    <DxButton
                        id="btn-dang-ky"
                        class="m3-btn-pill w-100 mt-2"
                        :text="dangTai ? 'Đang tạo tài khoản...' : 'Đăng ký'"
                        type="default"
                        styling-mode="contained"
                        :disabled="dangTai"
                        @click="xuLyDangKy()" />

                    <DxPopover
                        target="#btn-dang-ky"
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
                                Đăng ký thành công!
                            </h6>
                            <p class="text-muted small mb-3">
                                Chào mừng
                                <strong>{{
                                    form.firstName || form.username
                                }}</strong>
                                đã tham gia hệ thống.
                            </p>
                            <button
                                type="button"
                                class="btn btn-primary btn-sm m3-btn-pill w-100"
                                @click="chuyenSangDangNhap">
                                Đăng nhập ngay
                                <i class="dx-icon-chevronnext ms-1"></i>
                            </button>
                        </div>
                    </DxPopover>

                    <div class="text-center mt-2">
                        <span class="small text-muted">Đã có tài khoản? </span>
                        <router-link
                            to="/login"
                            class="small fw-semibold text-primary text-decoration-none">
                            Đăng nhập ngay
                        </router-link>
                    </div>
                </div>
            </DxValidationGroup>
        </div>
    </div>
</template>

<script>
import { DxTextBox } from "devextreme-vue/text-box";
import { DxButton } from "devextreme-vue/button";
import { DxPopover } from "devextreme-vue/popover";
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
        DxPopover,
        DxValidator,
        DxValidationGroup,
        DxTextBox,
        DxButton,
        DxRequiredRule,
        DxEmailRule,
        DxCompareRule,
        DxStringLengthRule,
        ThemeToggle,
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
            hienPopover: false,
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
            // 2. Nếu form có lỗi validation ➔ Dừng lại ngay!
            if (!ketQua.isValid) {
                this.hienPopover = false;
                return;
            }

            this.loi = null;

            try {
                await this.$store.dispatch("auth/dangKy", { ...this.form });

                // Đăng ký thành công: hiển thị popover thông báo kèm shading tối
                this.hienPopover = true;
            } catch (err) {
                // Đảm bảo đóng Popover để không hiện nhầm thông báo thành công
                this.hienPopover = false;
                console.log("🚀 ~ Lỗi đăng ký:", err);

                const thongBaoLoi = (err.message || "").toLowerCase();

                // Lỗi mạng khi đang bấm Đăng ký
                const isLoiMang =
                    err.status === 0 ||
                    !navigator.onLine ||
                    thongBaoLoi.includes("mất kết nối") ||
                    thongBaoLoi.includes("lỗi kết nối") ||
                    thongBaoLoi.includes("network error") ||
                    thongBaoLoi.includes("failed to fetch");

                if (isLoiMang) {
                    // Hành động: Giữ nguyên 100% dữ liệu đã nhập trên form để người dùng chỉ việc bấm lại
                    this.loi = "Lỗi kết nối máy chủ, vui lòng thử lại!";
                    return;
                }

                // Tên đăng nhập đã tồn tại (Username trùng lặp)
                if (
                    thongBaoLoi.includes("tên đăng nhập") ||
                    thongBaoLoi.includes("username") ||
                    err.status === 409
                ) {
                    // Giữ lại họ tên, email, mật khẩu; xóa trắng ô username và focus lại
                    this.loi =
                        "Tên đăng nhập này đã được sử dụng! Vui lòng chọn tên khác.";
                    this.form.username = "";
                    this.$nextTick(() => {
                        this.$refs.usernameBox?.instance?.focus();
                    });
                    return;
                }

                // Email đã được đăng ký
                if (thongBaoLoi.includes("email")) {
                    // Hành động: Giữ nguyên form, focus vào ô email để người dùng kiểm tra lại hoặc chuyển sang đăng nhập
                    this.loi =
                        "Email này đã được đăng ký tài khoản! Bạn có thể sử dụng tính năng Đăng nhập.";
                    this.$nextTick(() => {
                        this.$refs.emailBox?.instance?.focus();
                    });
                    return;
                }

                // Mật khẩu không hợp lệ từ máy chủ trả về
                if (
                    thongBaoLoi.includes("mật khẩu") ||
                    thongBaoLoi.includes("password")
                ) {
                    // Giữ lại thông tin cá nhân, chỉ xóa 2 ô mật khẩu và focus lại ô mật khẩu
                    this.loi = err.message || "Mật khẩu không đáp ứng yêu cầu!";
                    this.form.password = "";
                    this.form.confirmPassword = "";
                    this.$nextTick(() => {
                        this.$refs.passwordBox?.instance?.focus();
                    });
                    return;
                }

                // Lỗi chung khác
                this.loi =
                    err.message ||
                    "Đăng ký không thành công. Vui lòng thử lại!";
            }
        },
        chuyenSangDangNhap() {
            this.hienPopover = false;
            this.$router.push("/login");
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
