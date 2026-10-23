function khoiPhucGioHang() {
    try {
        const truyXuatDuLieu = localStorage.getItem("mini_shop_cart");
        const parsed = truyXuatDuLieu ? JSON.parse(truyXuatDuLieu) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.warn("Dữ liệu giỏ hàng bị hỏng, tự động đặt lại:", error);
        localStorage.removeItem("mini_shop_cart");
        return [];
    }
}

export default {
    namespaced: true,
    state: () => ({
        danhSach: khoiPhucGioHang() || [],
    }),

    getters: {
        danhSachSanPham: (state) => state.danhSach,

        count: (state) => {
            return state.danhSach.reduce(
                (tongSanPham, sanPham) => tongSanPham + sanPham.quantity,
                0,
            );
        },

        total: (state) => {
            const tongTien = state.danhSach.reduce(
                (tong, sanPham) => tong + sanPham.price * sanPham.quantity,
                0,
            );
            return Math.round(tongTien * 100) / 100;
        },
    },

    mutations: {
        THEM_VAO_GIO(state, { sanPham, soLuong = 1 }) {
            const spHienTai = state.danhSach.find(
                (item) => item.id === sanPham.id,
            );
            const tonKhoToiDa = sanPham.stock || 999;

            if (spHienTai) {
                const soLuongMoi = spHienTai.quantity + soLuong;
                spHienTai.quantity = Math.min(soLuongMoi, tonKhoToiDa);
            } else {
                const soLuongHopLe = Math.min(soLuong, tonKhoToiDa);
                state.danhSach.push({
                    id: sanPham.id,
                    title: sanPham.title,
                    price: sanPham.price,
                    thumbnail: sanPham.thumbnail,
                    stock: sanPham.stock,
                    quantity: soLuongHopLe,
                });
            }
            localStorage.setItem(
                "mini_shop_cart",
                JSON.stringify(state.danhSach),
            );
        },

        CAP_NHAT_SO_LUONG(state, { id, soLuong }) {
            const sp = state.danhSach.find((item) => item.id === id);

            if (!sp) return;

            if (soLuong <= 0) {
                state.danhSach = state.danhSach.filter(
                    (item) => item.id !== id,
                );
            } else {
                sp.quantity = Math.min(soLuong, sp.stock);
            }

            localStorage.setItem(
                "mini_shop_cart",
                JSON.stringify(state.danhSach),
            );
        },

        XOA_SAN_PHAM(state, id) {
            state.danhSach = state.danhSach.filter((item) => item.id !== id);
            localStorage.setItem(
                "mini_shop_cart",
                JSON.stringify(state.danhSach),
            );
        },

        XOA_TAT_CA_SAN_PHAM(state) {
            state.danhSach = [];
            localStorage.removeItem("mini_shop_cart");
        },
    },
    actions: {
        themVaoGio({ commit }, payload) {
            commit("THEM_VAO_GIO", payload);
        },
        capNhatSoLuong({ commit }, payload) {
            commit("CAP_NHAT_SO_LUONG", payload);
        },
        xoaSanPham({ commit }, id) {
            commit("XOA_SAN_PHAM", id);
        },
        xoaTatCa({ commit }) {
            commit("XOA_TAT_CA_SAN_PHAM");
        },
    },
};
