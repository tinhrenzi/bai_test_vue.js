# Vue 3 + Vite

Kính gửi mentor. Đây là file Readme tổng quát về cách cài và chạy dự án.

---

## Các yêu cầu đã làm:

1. **Khởi tạo và chất lượng code**
   -- Dự án Vite cài sẵn Vue Router, Vuex, axios, DevExtreme.
   -- ESLint, Prettier; không còn lỗi lint khi nộp bài.

2. **Tầng API**
   -- Một axios instance dùng chung, baseURL lấy từ .env, timeout 8 giây.
   -- Request interceptor tự gắn Authorization: Bearer khi đã đăng nhập.
   -- Response interceptor chuẩn hóa mọi lỗi thành ApiError (class tự viết, có status, message), hiển thị thông báo lỗi chung bằng notify của DevExtreme.
   -- Khi gặp lỗi 401: gọi /auth/refresh lấy token mới rồi tự gửi lại request ban đầu. Nếu nhiều request cùng bị 401, chỉ gọi refresh một lần (dùng chung một Promise). Refresh thất bại thì đăng xuất và chuyển về trang đăng nhập.
   -- Request GET bị lỗi mạng hoặc status ≥ 500 tự thử lại tối đa 2 lần.

3. **Routing và phân quyền**
   -- Các route: trang chủ, chi tiết sản phẩm /products/:id, giỏ hàng, đăng nhập, /admin/products, /admin/dashboard, trang 404.
   -- Lazy load toàn bộ route trang admin.
   -- Navigation guard chặn route admin khi chưa đăng nhập; đăng nhập xong quay lại đúng trang đang muốn vào (?redirect=).
   -- Khi tải lại trang mà còn token, gọi /auth/me khôi phục phiên đăng nhập trước khi guard chạy.

4. **Trang khách hàng**

5. **Vuex**

6. **Trang quản trị**

---

## Hướng dẫn cài đặt và khởi chạy

```bash
# 1. Clone repository về máy
git clone git clone -b mini-shop https://github.com/tinhrenzi bai_test_vue.js.git

# 2. Di chuyển vào thư mục dự án
cd bai_test_vue.js

# 3. Cài đặt các thư viện phụ thuộc (Bắt buộc)
npm install

# 4. Chạy dự án
npm run dev
```
