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
                        :disabled="khoaTamThoi"
                        :showClearButton="true">
                        <DxValidator ref="validate">
                            <DxRequiredRule
                                message="Không được bỏ trống tên đăng nhập!" />
                        </DxValidator>
                    </DxTextBox>
                </div>

                <div class="m3-form-group">
                    <DxTextBox
                        ref="passwordBox"
                        label="Mật khẩu (*)"
                        class="m3-input"
                        v-model:value="password"
                        mode="password"
                        :disabled="khoaTamThoi"
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
                    v-if="thongBaoKhoa"
                    class="alert alert-warning py-2 px-3 small d-flex align-items-center gap-2">
                    <i class="dx-icon-warning text-warning fs-5"></i>
                    <span>{{ thongBaoKhoa }}</span>
                </div>

                <div
                    v-else-if="loiDangNhap"
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
                            :disabled="khoaTamThoi"
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
                            :disabled="khoaTamThoi"
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
                            :disabled="khoaTamThoi"
                            @click="dienMauAdmin">
                            Điền
                        </button>
                    </div>
                </div>

                <DxButton
                    id="btn-dang-nhap"
                    class="m3-btn-pill w-100 mt-3"
                    :text="
                        khoaTamThoi
                            ? `Tạm khóa (${thoiGianDemNguoc}s)`
                            : 'Đăng nhập'
                    "
                    type="default"
                    styling-mode="contained"
                    :disabled="dangTai || khoaTamThoi"
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
            soLanSai: 0,
            khoaTamThoi: false,
            thoiGianDemNguoc: 0,
            timerDemNguoc: null,
            thongBaoKhoa: "",
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
    beforeUnmount() {
        if (this.timerDemNguoc) {
            clearInterval(this.timerDemNguoc);
            this.timerDemNguoc = null;
        }
    },
    methods: {
        dienMauEmilys() {
            if (this.khoaTamThoi) return;
            this.username = "emilys";
            this.password = "emilyspass";
        },
        dienMauMichael() {
            if (this.khoaTamThoi) return;
            this.username = "michaelw";
            this.password = "michaelwpass";
        },
        dienMauAdmin() {
            if (this.khoaTamThoi) return;
            this.username = "admin";
            this.password = "admin";
        },
        dienMauKhachHang() {
            if (this.khoaTamThoi) return;
            this.username = "khachhang";
            this.password = "123456";
        },
        kichHoatKhoaTamThoi(soGiay = 30) {
            this.khoaTamThoi = true;
            this.thoiGianDemNguoc = soGiay;
            this.thongBaoKhoa = `Bạn đã nhập sai 5 lần, vui lòng chờ ${this.thoiGianDemNguoc} giây hoặc liên hệ Admin`;

            if (this.timerDemNguoc) {
                clearInterval(this.timerDemNguoc);
            }

            this.timerDemNguoc = setInterval(() => {
                this.thoiGianDemNguoc--;
                if (this.thoiGianDemNguoc > 0) {
                    this.thongBaoKhoa = `Bạn đã nhập sai 5 lần, vui lòng chờ ${this.thoiGianDemNguoc} giây hoặc liên hệ Admin`;
                } else {
                    clearInterval(this.timerDemNguoc);
                    this.timerDemNguoc = null;
                    this.khoaTamThoi = false;
                    this.soLanSai = 0;
                    this.thongBaoKhoa = "";
                    this.$nextTick(() => {
                        this.$refs.passwordBox?.instance?.focus();
                    });
                }
            }, 1000);
        },
        async xuLyDangNhap() {
            if (this.khoaTamThoi) return;

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

                // Đăng nhập thành công: reset biến đếm số lần sai và thông báo khóa
                this.soLanSai = 0;
                this.thongBaoKhoa = "";
                this.thongTinUser = user;
                // Hiển thị popover với nền mờ tối khi đăng nhập thành công
                this.hienPopover = true;
            } catch (err) {
                // Đảm bảo đóng Popover để không hiện nhầm thông báo thành công
                this.hienPopover = false;
                console.log("🚀 ~ Lỗi đăng nhập:", err);

                // Lỗi mạng khi đang bấm đăng nhập
                const isLoiMang =
                    err.status === 0 ||
                    !navigator.onLine ||
                    (err.message &&
                        (err.message.toLowerCase().includes("mất kết nối") ||
                            err.message.toLowerCase().includes("lỗi kết nối") ||
                            err.message
                                .toLowerCase()
                                .includes("network error") ||
                            err.message
                                .toLowerCase()
                                .includes("failed to fetch")));

                if (isLoiMang) {
                    // Giữ nguyên toàn bộ tài khoản và mật khẩu trên form,
                    // Hiện thông báo "Lỗi kết nối, vui lòng thử lại" để người dùng chỉ việc bấm lại nút mà không bị mất dữ liệu vừa gõ
                    this.$store.commit(
                        "auth/SET_LOI",
                        "Lỗi kết nối, vui lòng thử lại",
                    );
                    return;
                }

                //  Nhập sai mật khẩu
                // Giữ nguyên tên đăng nhập, tự động xóa trắng ô mật khẩu và focus con trỏ chuột lại vào ô mật khẩu
                this.password = "";
                this.$nextTick(() => {
                    this.$refs.passwordBox?.instance?.focus();
                });

                // Đăng nhập sai quá 3 - 5 lần
                // Đếm số lần trong biến soLanSai++
                this.soLanSai++;
                if (this.soLanSai >= 5) {
                    // Nếu sai quá nhiều ➔ Hiện thông báo cảnh báo và tạm thời disable nút Đăng nhập
                    this.kichHoatKhoaTamThoi(30);
                } else if (this.soLanSai >= 3) {
                    this.$store.commit(
                        "auth/SET_LOI",
                        `Tên đăng nhập hoặc mật khẩu không chính xác! (Bạn đã nhập sai ${this.soLanSai}/5 lần)`,
                    );
                }
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
