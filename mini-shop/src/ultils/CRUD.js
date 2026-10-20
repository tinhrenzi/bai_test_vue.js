export function Them(danhSach = [], itemMoi = {}) {
    if (!itemMoi) return [...danhSach];

    const idSanPham = {
        id: itemMoi.id || Date.now(),
        ...itemMoi,
    };

    return [idSanPham, ...danhSach];
}
export function Sua(danhSach = [], id, duLieuMoi = {}) {
    if (!id) return [...danhSach];
    return danhSach.map((item) => {
        if (String(item.id) === String(id)) {
            return {
                ...item,
                ...duLieuMoi,
                id: item.id,
            };
        }
        return item;
    });
}
export function Xoa(danhSach = [], id) {
    if (!id) return [...danhSach];
    return danhSach.filter((item) => String(item.id) !== String(id));
}
export function TimKiem(
    danhSach = [],
    tuKhoa = "",
    cacTruong = ["title", "category"],
) {
    if (!tuKhoa || !tuKhoa.trim()) {
        return [...danhSach];
    }

    const kw = tuKhoa.toLowerCase().trim();

    return danhSach.filter((item) => {
        return cacTruong.some((truong) => {
            const giaTri = item[truong];
            return giaTri && String(giaTri).toLowerCase().includes(kw);
        });
    });
}
