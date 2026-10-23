import api from "./axios";

const DEFAULT_SELECT = "title,price,thumbnail,category,stock,rating";

export function layDanhSachSanPham(options = {}) {
    const {
        limit = 12,
        skip = 0,
        select = DEFAULT_SELECT,
        sortBy,
        order = "asc",
        delay,
    } = options;

    const params = {
        limit,
        skip,
        select,
    };

    if (sortBy) {
        params.sortBy = sortBy;
        params.order = order || "asc";
    }

    if (delay) {
        params.delay = delay;
    }

    return api.get("/products", { params });
}

export function timKiemSanPham(tuKhoa, options = {}) {
    const {
        limit = 12,
        skip = 0,
        select = DEFAULT_SELECT,
        sortBy,
        order = "asc",
        delay,
    } = options;

    const params = {
        q: tuKhoa,
        limit,
        skip,
        select,
    };

    if (sortBy) {
        params.sortBy = sortBy;
        params.order = order || "asc";
    }

    if (delay) {
        params.delay = delay;
    }

    return api.get("/products/search", { params });
}

export function layDanhSachDanhMuc() {
    return api.get("/products/categories");
}

export function laySanPhamTheoDanhMuc(tenDanhMuc, options = {}) {
    const {
        limit = 12,
        skip = 0,
        select = DEFAULT_SELECT,
        sortBy,
        order = "asc",
        delay,
    } = options;

    const params = {
        limit,
        skip,
        select,
    };

    if (sortBy) {
        params.sortBy = sortBy;
        params.order = order || "asc";
    }

    if (delay) {
        params.delay = delay;
    }

    return api.get(`/products/category/${encodeURIComponent(tenDanhMuc)}`, {
        params,
    });
}

export function layChiTietSanPham(idSanPham) {
    return api.get(`/products/${idSanPham}`);
}

export function themSanPham(duLieu) {
    return api.post("/products/add", duLieu);
}

export function suaSanPham(id, duLieu) {
    return api.put(`/products/${id}`, duLieu);
}

export function xoaSanPham(id) {
    return api.delete(`/products/${id}`);
}
