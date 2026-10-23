const KEY_USERS = "mini_shop_users";

const TAI_KHOAN_MAU = [
    {
        id: 1,
        username: "admin",
        password: "admin",
        role: "admin",
        firstName: "Quản trị",
        lastName: "Viên",
        email: "admin@minishop.com",
        token: "mock_token_admin",
    },
    {
        id: 2,
        username: "khachhang",
        password: "123456",
        role: "customer",
        firstName: "Nguyễn",
        lastName: "Khách",
        email: "khachhang@gmail.com",
        token: "mock_token_khachhang",
    },
];

export function layDanhSachUser() {
    try {
        const data = localStorage.getItem(KEY_USERS);
        if (!data) {
            localStorage.setItem(KEY_USERS, JSON.stringify(TAI_KHOAN_MAU));
            return [...TAI_KHOAN_MAU];
        }
        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed) || !parsed.some((u) => u.username === "admin")) {
            const ketHop = [...TAI_KHOAN_MAU, ...(Array.isArray(parsed) ? parsed : [])];
            localStorage.setItem(KEY_USERS, JSON.stringify(ketHop));
            return ketHop;
        }
        return parsed;
    } catch (e) {
        return [...TAI_KHOAN_MAU];
    }
}

export function validateDangKy(form = {}) {
    if (!form.username || !form.username.trim()) {
        return "Tên đăng nhập không được để trống!";
    }
    if (!form.email || !form.email.trim()) {
        return "Email không được để trống!";
    }
    if (!form.password || form.password.length < 6) {
        return "Mật khẩu phải có ít nhất 6 ký tự!";
    }
    if (form.password !== form.confirmPassword) {
        return "Mật khẩu xác nhận không trùng khớp!";
    }
    return null;
}

export function dangKyUser(form = {}) {
    const loi = validateDangKy(form);
    if (loi) {
        throw new Error(loi);
    }

    const danhSach = layDanhSachUser();
    const tonTai = danhSach.some(
        (u) => u.username.toLowerCase() === form.username.trim().toLowerCase(),
    );

    if (tonTai) {
        throw new Error("Tên đăng nhập này đã được sử dụng!");
    }

    const userMoi = {
        id: Date.now(),
        username: form.username.trim(),
        password: form.password,
        email: form.email.trim(),
        firstName: form.firstName ? form.firstName.trim() : "",
        lastName: form.lastName ? form.lastName.trim() : "",
        role: form.role === "admin" ? "admin" : "customer",
        token: `mock_token_${Date.now()}`,
    };

    danhSach.push(userMoi);
    localStorage.setItem(KEY_USERS, JSON.stringify(danhSach));
    return userMoi;
}

export function dangNhapLocal(username, password) {
    if (!username || !password) return null;
    const cleanUsername = username.trim().toLowerCase();
    const danhSach = layDanhSachUser();
    return (
        danhSach.find(
            (u) =>
                u.username.toLowerCase() === cleanUsername &&
                (u.password === password ||
                    (u.username === "admin" &&
                        (password === "admin" || password === "admin123"))),
        ) || null
    );
}

export function kiemTraAdmin(user) {
    return !!(user && user.role === "admin");
}

export function kiemTraKhachHang(user) {
    return !!(user && user.role === "customer");
}
