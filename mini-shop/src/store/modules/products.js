import {
    layDanhSachSanPham,
    timKiemSanPham,
    laySanPhamTheoDanhMuc,
    layChiTietSanPham,
    themSanPham,
    suaSanPham,
    xoaSanPham,
} from "../../api/apiProduct";

const STORAGE_KEY_LOCAL_CHANGES = "mini_shop_product_changes";

function layThayDoiCucBo() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_LOCAL_CHANGES);
        return raw ? JSON.parse(raw) : { added: [], updated: {}, deleted: [] };
    } catch (e) {
        return { added: [], updated: {}, deleted: [] };
    }
}

function luuThayDoiCucBo(changes) {
    localStorage.setItem(STORAGE_KEY_LOCAL_CHANGES, JSON.stringify(changes));
}

function locSanPhamTuThem(danhSachThem = [], boLoc = {}, thayDoiCucBo = {}) {
    const { tuKhoa = "", danhMuc = "" } = boLoc;
    const { daSua = {}, daXoa = [] } = thayDoiCucBo;
    const tapHopIdDaXoa = new Set(daXoa.map((id) => String(id)));
    const tuKhoaChuanHoa = tuKhoa.trim().toLowerCase();

    return danhSachThem
        .filter((sanPham) => {
            const idChuoi = String(sanPham.id);
            if (tapHopIdDaXoa.has(idChuoi)) return false;
            if (danhMuc && sanPham.category !== danhMuc) return false;
            if (
                tuKhoaChuanHoa &&
                !sanPham.title.toLowerCase().includes(tuKhoaChuanHoa)
            ) {
                return false;
            }
            return true;
        })
        .map((sanPham) => {
            const idChuoi = String(sanPham.id);
            return daSua[idChuoi] ? { ...sanPham, ...daSua[idChuoi] } : sanPham;
        });
}

function capNhatDanhSachTuApi(danhSachApi = [], thayDoiCucBo = {}) {
    const { daSua = {}, daXoa = [] } = thayDoiCucBo;
    const tapHopIdDaXoa = new Set(daXoa.map((id) => String(id)));

    return danhSachApi
        .filter((sanPham) => !tapHopIdDaXoa.has(String(sanPham.id)))
        .map((sanPham) => {
            const idChuoi = String(sanPham.id);
            return daSua[idChuoi] ? { ...sanPham, ...daSua[idChuoi] } : sanPham;
        });
}

function gopPhanTrang({
    sanPhamTuThem,
    danhSachApi,
    tongSoApi,
    skip,
    limit,
    soLuongDaXoa,
}) {
    let danhSachKetQua = [];

    if (skip < sanPhamTuThem.length) {
        const sanPhamThemTrangNay = sanPhamTuThem.slice(skip, skip + limit);
        const soLuongLayTuApi = limit - sanPhamThemTrangNay.length;
        danhSachKetQua = [
            ...sanPhamThemTrangNay,
            ...danhSachApi.slice(0, soLuongLayTuApi),
        ];
    } else {
        danhSachKetQua = danhSachApi.slice(0, limit);
    }

    const tongSo = Math.max(0, tongSoApi + sanPhamTuThem.length - soLuongDaXoa);

    return {
        products: danhSachKetQua,
        total: tongSo,
    };
}

export default {
    namespaced: true,
    state: () => ({
        danhSach: [],
        tongSo: 0,
        chiTiet: null,
        cacheChiTiet: {},
        dangTai: false,
        loi: null,
        thayDoiCucBo: layThayDoiCucBo(),
    }),

    getters: {
        danhSachSanPham: (state) => state.danhSach,
        tongSoLuong: (state) => state.tongSo,
        chiTietSanPham: (state) => state.chiTiet,
        dangTai: (state) => state.dangTai,
        loi: (state) => state.loi,
    },

    mutations: {
        SET_DANG_TAI(state, value) {
            state.dangTai = value;
        },

        SET_DANH_SACH(state, data) {
            state.danhSach = data.products || [];
            state.tongSo = data.total || 0;
        },

        SET_LOI(state, message) {
            state.loi = message;
        },

        SET_CHI_TIET(state, data) {
            state.chiTiet = data;
        },

        LUU_CACHE(state, product) {
            if (product && product.id) {
                state.cacheChiTiet[product.id] = product;
            }
        },

        THEM_SAN_PHAM(state, product) {
            state.danhSach.unshift(product);
            state.tongSo += 1;
            state.thayDoiCucBo.added.unshift(product);
            luuThayDoiCucBo(state.thayDoiCucBo);
        },

        CAP_NHAT_SAN_PHAM(state, { id, duLieu }) {
            const idx = state.danhSach.findIndex(
                (p) => String(p.id) === String(id),
            );
            if (idx !== -1) {
                state.danhSach[idx] = { ...state.danhSach[idx], ...duLieu };
            }
            state.thayDoiCucBo.updated[id] = {
                ...(state.thayDoiCucBo.updated[id] || {}),
                ...duLieu,
            };
            luuThayDoiCucBo(state.thayDoiCucBo);

            if (state.cacheChiTiet[id]) {
                state.cacheChiTiet[id] = {
                    ...state.cacheChiTiet[id],
                    ...duLieu,
                };
            }
        },

        XOA_SAN_PHAM(state, id) {
            state.danhSach = state.danhSach.filter(
                (p) => String(p.id) !== String(id),
            );
            state.tongSo = Math.max(0, state.tongSo - 1);
            state.thayDoiCucBo.deleted.push(id);
            luuThayDoiCucBo(state.thayDoiCucBo);

            delete state.cacheChiTiet[id];
        },
    },

    actions: {
        async taiDanhSachSanPham({ state, commit }, boLoc = {}) {
            const {
                skip = 0,
                limit = 12,
                q: tuKhoa = "",
                category: danhMuc = "",
                sortBy: truongSapXep = "",
                order: thuTu = "asc",
                delay: doTre = 0,
            } = boLoc;

            commit("SET_DANG_TAI", true);
            commit("SET_LOI", null);

            try {
                const {
                    added: danhSachThem,
                    updated: daSua,
                    deleted: daXoa,
                } = state.thayDoiCucBo;
                const thayDoi = { daSua, daXoa };

                const sanPhamTuThem = locSanPhamTuThem(
                    danhSachThem,
                    { tuKhoa, danhMuc },
                    thayDoi,
                );
                const skipChoApi = Math.max(0, skip - sanPhamTuThem.length);
                const thamSoApi = {
                    skip: skipChoApi,
                    limit,
                    sortBy: truongSapXep,
                    order: thuTu,
                    delay: doTre,
                };

                let phanHoiApi;
                if (tuKhoa.trim()) {
                    phanHoiApi = await timKiemSanPham(tuKhoa.trim(), thamSoApi);
                } else if (danhMuc.trim()) {
                    phanHoiApi = await laySanPhamTheoDanhMuc(
                        danhMuc.trim(),
                        thamSoApi,
                    );
                } else {
                    phanHoiApi = await layDanhSachSanPham(thamSoApi);
                }

                const danhSachApiDaLoc = capNhatDanhSachTuApi(
                    phanHoiApi.data.products || [],
                    thayDoi,
                );

                const ketQua = gopPhanTrang({
                    sanPhamTuThem,
                    danhSachApi: danhSachApiDaLoc,
                    tongSoApi: phanHoiApi.data.total || 0,
                    skip,
                    limit,
                    soLuongDaXoa: daXoa.length,
                });

                commit("SET_DANH_SACH", ketQua);
                return ketQua;
            } catch (loi) {
                const thongBaoLoi =
                    loi.message || "Không thể tải danh sách sản phẩm.";
                commit("SET_LOI", thongBaoLoi);
                throw loi;
            } finally {
                commit("SET_DANG_TAI", false);
            }
        },

        async taiDanhSachQuanLy({ state }, { skip = 0, limit = 10 }) {
            const {
                added: danhSachThem,
                updated: daSua,
                deleted: daXoa,
            } = state.thayDoiCucBo;
            const thayDoi = { daSua, daXoa };

            const sanPhamTuThem = locSanPhamTuThem(danhSachThem, {}, thayDoi);
            const skipChoApi = Math.max(0, skip - sanPhamTuThem.length);

            const phanHoiApi = await layDanhSachSanPham({
                skip: skipChoApi,
                limit,
                select: "id,title,price,thumbnail,category,stock,rating",
            });

            const danhSachApiDaLoc = capNhatDanhSachTuApi(
                phanHoiApi.data.products || [],
                thayDoi,
            );

            const ketQua = gopPhanTrang({
                sanPhamTuThem,
                danhSachApi: danhSachApiDaLoc,
                tongSoApi: phanHoiApi.data.total || 0,
                skip,
                limit,
                soLuongDaXoa: daXoa.length,
            });

            return {
                data: ketQua.products,
                totalCount: ketQua.total,
            };
        },

        async taiChiTietSanPham({ state, commit }, id) {
            const idChuoi = String(id);
            const { added: danhSachThem, updated: daSua } = state.thayDoiCucBo;

            const sanPhamTuThem = danhSachThem.find(
                (p) => String(p.id) === idChuoi,
            );
            if (sanPhamTuThem) {
                const ketQua = {
                    ...sanPhamTuThem,
                    ...(daSua[idChuoi] || {}),
                };
                commit("SET_CHI_TIET", ketQua);
                commit("LUU_CACHE", ketQua);
                return ketQua;
            }

            if (state.cacheChiTiet[idChuoi]) {
                const cached = {
                    ...state.cacheChiTiet[idChuoi],
                    ...(daSua[idChuoi] || {}),
                };
                commit("SET_CHI_TIET", cached);
                return cached;
            }

            commit("SET_DANG_TAI", true);
            commit("SET_LOI", null);

            try {
                const resp = await layChiTietSanPham(id);
                const sanPhamMoi = {
                    ...resp.data,
                    ...(daSua[idChuoi] || {}),
                };
                commit("SET_CHI_TIET", sanPhamMoi);
                commit("LUU_CACHE", sanPhamMoi);
                return sanPhamMoi;
            } catch (error) {
                const message =
                    error.message || "Không thể tải chi tiết sản phẩm.";
                commit("SET_LOI", message);
                throw error;
            } finally {
                commit("SET_DANG_TAI", false);
            }
        },

        async themSanPham({ commit }, duLieu) {
            const resp = await themSanPham(duLieu);
            const sanPhamMoi = {
                ...duLieu,
                ...(resp.data || {}),
                id: Date.now(),
                thumbnail:
                    duLieu.thumbnail || "https://via.placeholder.com/200",
                rating: 5,
            };
            commit("THEM_SAN_PHAM", sanPhamMoi);
            return sanPhamMoi;
        },

        async suaSanPham({ commit }, { id, duLieu }) {
            const resp = await suaSanPham(id, duLieu);
            const sanPhamCapNhat = resp.data || duLieu;
            commit("CAP_NHAT_SAN_PHAM", { id, duLieu: sanPhamCapNhat });
            return sanPhamCapNhat;
        },

        async xoaSanPham({ commit }, id) {
            await xoaSanPham(id);
            commit("XOA_SAN_PHAM", id);
            return id;
        },
    },
};
