import { dangNhap, layThongTinNguoiDung } from '../../api/apiAuth';
export default {
    namespaced: true,
    state: () => ({
        token: localStorage.getItem('token') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
        user: JSON.parse(localStorage.getItem('user') || null),
        dangTai: false,
        loi: null
    }),
    mutations: {
        SET_DANG_TAI(state, value) {
            state.dangTai = value;
        },

        SET_LOI(state, thongBaoLoi) {
            state.loi = thongBaoLoi
        },

        DANG_NHAP_THANH_CONG(state, { token, refreshToken, user }) {
            state.token = token,
                state.refreshToken = refreshToken,
                state.user = user,
                state.loi = null

            localStorage.setItem('token', token)
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken)
            }
            localStorage.setItem('user', JSON.stringify(user))

        },

        SET_USER(state, user) {
            state.user = user
            localStorage.setItem('user', JSON.stringify(user))
        },

        DANG_XUAT(state) {
            state.token = null;
            state.refreshToken = null;
            state.user = null;
            state.loi = null;

            // Clear LocalStorage

            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    },

    actions: {
        async dangNhap({ commit }, thongTinDangNhap) {
            commit('SET_DANG_TAI', true);
            commit('SET_LOI', null);

            try {
                const phanHoi = await dangNhap(thongTinDangNhap);
                const data = phanHoi.data;

                const token = data.token || data.accessToken;
                const refreshToken = data.refreshToken;
                const user = {
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    firstName: data.firstName,
                    image: data.image
                }
                commit('DANG_NHAP_THANH_CONG', { token, refreshToken, user });
                return user;
            } catch (error) {
                console.log("🚀 ~ error:", error)
                const thongBaoLoi = error.message || 'Đăng nhập không thành công.';
                commit('SET_LOI', thongBaoLoi);
                throw error;
            } finally {
                commit('SET_DANG_TAI', false)
            }
        },

        async khoiPhucPhienLamViec({ commit, state }) {
            if (!state.token) return null;

            try {
                const phanHoi = await layThongTinNguoiDung();
                const user = phanHoi.data;

                commit('SET_USER', user);
                return user;
            } catch (error) {
                console.log("🚀 ~ error:", error)
                commit('DANG_XUAT')
                return null
            }
        },
        dangXuat({ commit }) {
            commit('DANG_XUAT')
        }
    },
    getters: {
        daDangNhap: (state) => !!state.token,
        thongTinUser: (state) => state.user,
    },
}