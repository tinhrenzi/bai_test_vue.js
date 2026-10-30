import api from "../../api/axios";

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

        coSanPhamHetHang: (state) => {
            return state.danhSach.some(
                (sp) => sp.stock <= 0 || sp.quantity > sp.stock,
            );
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
        },

        XOA_SAN_PHAM(state, id) {
            state.danhSach = state.danhSach.filter((item) => item.id !== id);
        },

        XOA_TAT_CA_SAN_PHAM(state) {
            state.danhSach = [];
        },
    },

    actions: {
        themVaoGio({ state, commit }, payload) {
            const { sanPham, soLuong = 1 } = payload || {};
            if (!sanPham || !sanPham.id) {
                throw new Error("Thông tin sản phẩm không hợp lệ!");
            }
            if (sanPham.stock <= 0) {
                throw new Error(`Sản phẩm "${sanPham.title}" hiện đã hết hàng!`);
            }

            const spHienTai = state.danhSach.find(
                (item) => item.id === sanPham.id,
            );
            const soLuongHienTai = spHienTai ? spHienTai.quantity : 0;
            const tonKhoToiDa = sanPham.stock;

            if (soLuongHienTai >= tonKhoToiDa) {
                throw new Error(
                    `Bạn đã có ${soLuongHienTai} sản phẩm trong giỏ (đạt mức tồn kho tối đa: ${tonKhoToiDa})!`,
                );
            }

            commit("THEM_VAO_GIO", payload);
            localStorage.setItem(
                "mini_shop_cart",
                JSON.stringify(state.danhSach),
            );

            if (soLuongHienTai + soLuong > tonKhoToiDa) {
                return {
                    canhBao: `Đã tự động điều chỉnh về ${tonKhoToiDa} sản phẩm do giới hạn tồn kho.`,
                };
            }
            return { thanhCong: true };
        },

        capNhatSoLuong({ state, commit }, payload) {
            const { id, soLuong } = payload || {};
            const sp = state.danhSach.find((item) => item.id === id);

            if (!sp) {
                throw new Error("Sản phẩm không có trong giỏ hàng!");
            }

            if (soLuong > sp.stock) {
                commit("CAP_NHAT_SO_LUONG", { id, soLuong: sp.stock });
                localStorage.setItem(
                    "mini_shop_cart",
                    JSON.stringify(state.danhSach),
                );
                throw new Error(
                    `Số lượng đã đạt giới hạn tồn kho (${sp.stock} sản phẩm)!`,
                );
            }

            commit("CAP_NHAT_SO_LUONG", payload);
            localStorage.setItem(
                "mini_shop_cart",
                JSON.stringify(state.danhSach),
            );
            return true;
        },

        xoaSanPham({ state, commit }, id) {
            commit("XOA_SAN_PHAM", id);
            localStorage.setItem(
                "mini_shop_cart",
                JSON.stringify(state.danhSach),
            );
        },

        xoaTatCa({ commit }) {
            commit("XOA_TAT_CA_SAN_PHAM");
            localStorage.removeItem("mini_shop_cart");
        },

        async thanhToanDonHang({ state, commit, rootState }) {
            if (!state.danhSach.length) {
                throw new Error("Giỏ hàng của bạn đang trống!");
            }

            // 1. Kiểm tra nếu có sản phẩm hết hàng hoàn toàn
            const spHetHang = state.danhSach.find((item) => item.stock <= 0);
            if (spHetHang) {
                throw new Error(
                    `Sản phẩm "${spHetHang.title}" hiện đã hết hàng. Vui lòng xóa khỏi giỏ trước khi thanh toán!`,
                );
            }

            // 2. Kiểm tra nếu có sản phẩm vượt quá tồn kho
            const spVuotTonKho = state.danhSach.find(
                (item) => item.quantity > item.stock,
            );
            if (spVuotTonKho) {
                throw new Error(
                    `Sản phẩm "${spVuotTonKho.title}" chỉ còn ${spVuotTonKho.stock} cái trong kho. Vui lòng điều chỉnh lại số lượng!`,
                );
            }

            const user = rootState.auth.user;
            const userId = user?.id || 1;

            // 3. Gửi yêu cầu tạo đơn hàng lên máy chủ
            const phanHoi = await api.post("/carts/add", {
                userId,
                products: state.danhSach.map((sp) => ({
                    id: sp.id,
                    quantity: sp.quantity,
                })),
            });

            // 4. Chỉ sau khi API thành công, tiến hành làm trống giỏ hàng
            commit("XOA_TAT_CA_SAN_PHAM");
            localStorage.removeItem("mini_shop_cart");

            return phanHoi.data;
        },
    },
};
