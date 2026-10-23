import { dangNhap, layThongTinNguoiDung, dangKy } from "../../api/apiAuth";
import { dangKyUser, dangNhapLocal } from "../../utils/auth";

export default {
    namespaced: true,
    state: () => ({
        token: localStorage.getItem("token") || null,
        refreshToken: localStorage.getItem("refreshToken") || null,
        user: JSON.parse(localStorage.getItem("user") || "null"),
        dangTai: false,
        loi: null,
    }),
    mutations: {
        SET_DANG_TAI(state, value) {
            state.dangTai = value;
        },

        SET_LOI(state, thongBaoLoi) {
            state.loi = thongBaoLoi;
        },

        DANG_NHAP_THANH_CONG(state, { token, refreshToken, user }) {
            state.token = token;
            state.refreshToken = refreshToken;
            state.user = user;
            state.loi = null;

            localStorage.setItem("token", token);
            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
            }
            localStorage.setItem("user", JSON.stringify(user));
        },

        SET_NGUOI_DUNG(state, user) {
            state.user = user;
            localStorage.setItem("user", JSON.stringify(user));
        },

        DANG_XUAT(state) {
            state.token = null;
            state.refreshToken = null;
            state.user = null;
            state.loi = null;

            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
        },
    },

    actions: {
        async dangNhap({ commit }, thongTinDangNhap) {
            commit("SET_DANG_TAI", true);
            commit("SET_LOI", null);

            try {
                const phanHoi = await dangNhap({
                    username: thongTinDangNhap.username,
                    password: thongTinDangNhap.password,
                    expiresInMins: thongTinDangNhap.expiresInMins || 30,
                });
                const data = phanHoi.data;

                const token = data.token || data.accessToken;
                const refreshToken = data.refreshToken;
                const user = {
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    image: data.image,
                    role:
                        data.username === "emilys" || data.role === "admin"
                            ? "admin"
                            : "customer",
                };
                commit("DANG_NHAP_THANH_CONG", { token, refreshToken, user });
                return user;
            } catch (error) {
                const userLocal = dangNhapLocal(
                    thongTinDangNhap.username,
                    thongTinDangNhap.password,
                );
                if (userLocal) {
                    const token = userLocal.token || `mock_token_${Date.now()}`;
                    const refreshToken = `mock_refresh_${Date.now()}`;
                    const user = {
                        id: userLocal.id,
                        username: userLocal.username,
                        email: userLocal.email,
                        firstName: userLocal.firstName || "",
                        lastName: userLocal.lastName || "",
                        image: userLocal.image || "",
                        role: userLocal.role || "customer",
                    };
                    commit("DANG_NHAP_THANH_CONG", {
                        token,
                        refreshToken,
                        user,
                    });
                    return user;
                }

                const thongBaoLoi =
                    error.message || "Đăng nhập không thành công.";
                commit("SET_LOI", thongBaoLoi);
                throw error;
            } finally {
                commit("SET_DANG_TAI", false);
            }
        },

        async dangKy({ commit }, thongTinDangKy) {
            commit("SET_DANG_TAI", true);
            commit("SET_LOI", null);

            try {
                const userMoi = dangKyUser(thongTinDangKy);
                try {
                    await dangKy(thongTinDangKy);
                } catch (e) {}
                return userMoi;
            } catch (error) {
                const thongBaoLoi =
                    error.message || "Đăng ký không thành công.";
                commit("SET_LOI", thongBaoLoi);
                throw error;
            } finally {
                commit("SET_DANG_TAI", false);
            }
        },

        async khoiPhucPhienLamViec({ commit, state }) {
            if (!state.token) return null;

            if (state.token.startsWith("mock_token_")) {
                return state.user;
            }

            try {
                const phanHoi = await layThongTinNguoiDung();
                const userApi = phanHoi.data;
                const user = {
                    ...userApi,
                    role:
                        userApi.username === "emilys" ||
                        userApi.role === "admin"
                            ? "admin"
                            : state.user?.role || "customer",
                };
                commit("SET_NGUOI_DUNG", user);
                return user;
            } catch (error) {
                commit("DANG_XUAT");
                return null;
            }
        },
        dangXuat({ commit }) {
            commit("DANG_XUAT");
        },
    },
    getters: {
        daDangNhap: (state) => !!state.token,
        thongTinNguoiDung: (state) => state.user,
        thongTinUser: (state) => state.user,
        laAdmin: (state) => state.user?.role === "admin",
        laKhachHang: (state) => state.user?.role === "customer",
        vaiTro: (state) => state.user?.role || "guest",
    },
};
