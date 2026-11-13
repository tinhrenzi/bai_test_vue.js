export function Them(danhSach = [], itemMoi = {}) {
    if (!itemMoi) return [...danhSach];

    const idSanPham = {
        id:
            itemMoi.id !== undefined && itemMoi.id !== null
                ? itemMoi.id
                : Date.now(),
        ...itemMoi,
    };

    return [idSanPham, ...danhSach];
}

export function Sua(danhSach = [], id, duLieuMoi = {}) {
    if (id === undefined || id === null) return [...danhSach];
    const idStr = String(id);
    return danhSach.map((item) => {
        if (String(item.id) === idStr) {
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
    if (id === undefined || id === null) return [...danhSach];
    const idStr = String(id);
    return danhSach.filter((item) => String(item.id) !== idStr);
}

export function TimKiem(
    danhSach = [],
    tuKhoa = "",
    cacTruong = ["title", "category"],
) {
    if (!tuKhoa || !String(tuKhoa).trim()) {
        return [...danhSach];
    }

    const kw = String(tuKhoa).toLowerCase().trim();

    return danhSach.filter((item) => {
        return cacTruong.some((truong) => {
            const giaTri = item[truong];
            return (
                giaTri !== undefined &&
                giaTri !== null &&
                String(giaTri).toLowerCase().includes(kw)
            );
        });
    });
}

export function LayTheoId(danhSach = [], id) {
    if (id === undefined || id === null) return null;
    const idStr = String(id);
    return danhSach.find((item) => String(item.id) === idStr) || null;
}
