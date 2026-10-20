import api from "./axios";

export function dangNhap(thongTinDangNhap) {
    return api.post("/auth/login", thongTinDangNhap);
}

export function layThongTinNguoiDung() {
    return api.get("/auth/me");
}

export function lamMoiToken(tokenLamMoi) {
    return api.post("/auth/refresh", {
        refreshToken: tokenLamMoi,
        expiresInMins: 30,
    });
}

export function dangKy(thongTinDangKy) {
    return api.post("/users/add", thongTinDangKy);
}
