import api from './axios'

export function layDanhSachSanPham(thamSo = {}) {
    const {
        soLuong = 12,
        boQua = 0,
        truongLay = 'title,price,thubnail,category,stock,rating',
        sapXepTheo,
        thuTu,
        doTre
    } = thamSo;

    return api.get('/products', {
        params: {
            limit: soLuong,
            skip: boQua,
            select: truongLay,
            ...(sapXepTheo ? { sortBy: sapXepTheo, order: thuTu || 'asc' } : {}),
            ...(doTre ? { delay: doTre } : {})
        },
    })
}

export function timKiemSanPham(tuKhoa, thamSoThem = {}) {
    return api.get('/products/search', {
        params: {
            q: tuKhoa,
            ...thamSoThem
        }
    })
}

export function layDanhSachDanhMuc() {
    return api.get('/products/categories');
}

export function laySanPhamTheoDanhMuc(tenDanhMuc, thamSoThem = {}) {
    return api.get(`/products/category/${tenDanhMuc}`, { params: thamSoThem })
}

export function layChiTietSanPham(idSanPham) {
    return api.get(`/products/${idSanPham}`);
}