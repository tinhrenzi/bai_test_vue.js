export const HTTP_STATUS_MESSAGES = {
    200: "Thành công: Dữ liệu đã được tải hoặc xử lý hoàn tất.",
    201: "Thành công: Đã thêm mới dữ liệu vào hệ thống.",
    400: "Lỗi yêu cầu (400): Dữ liệu gửi lên không đúng định dạng.",
    401: "Chưa xác thực (401): Bạn cần đăng nhập để thực hiện tính năng này.",
    403: "Bị từ chối (403): Bạn không có quyền truy cập khu vực này.",
    404: "Không tìm thấy (404): Dữ liệu bạn yêu cầu không tồn tại trên hệ thống.",
    500: "Lỗi máy chủ (500): Server đang gặp sự cố nội bộ.",
    502: "Lỗi kết nối cổng (502): Không nhận được phản hồi từ cổng dịch vụ.",
    503: "Dịch vụ gián đoạn (503): Máy chủ đang quá tải hoặc bảo trì.",
};

// src/api/apiError.js
export class ApiError extends Error {
    constructor(status, rawMessage = "", originalError = null) {
        let thongBaoTiengViet = "";
        const text = String(rawMessage || "").trim();

        if (status === 0) {
            thongBaoTiengViet =
                "Mất kết nối: Không thể kết nối máy chủ, kiểm tra lại internet!";
        } else if (text.toLowerCase().includes("invalid credentials")) {
            thongBaoTiengViet = "Tên đăng nhập hoặc mật khẩu không chính xác!";
        } else {
            thongBaoTiengViet =
                HTTP_STATUS_MESSAGES[status] ||
                text ||
                "Đã có lỗi xảy ra. Vui lòng thử lại sau!";
        }

        // Truyền câu tiếng Việt vào Error chuẩn của JavaScript:
        super(thongBaoTiengViet);
        this.name = `[Lỗi ${status || 500}]`;
        this.status = status || 500;
        this.message = thongBaoTiengViet;
        this.originalError = originalError;
    }

    // 👉 Hàm này giúp khi console.log(err) nó sẽ in thẳng câu tiếng Việt ra màn hình:
    toString() {
        return `${this.name} ${this.message}`;
    }
}
