# Mini Shop - Vue 3 + Vite

Kính gửi Mentor, đây là file README tổng quát về các yêu cầu kỹ thuật đã hoàn thành cùng hướng dẫn cài đặt và chạy thử dự án.

---

## 📋 Danh sách yêu cầu đã hoàn thành

### 1. Khởi tạo & Chất lượng mã nguồn

- Cài đặt dự án với **Vite**, **Vue 3**, **Vue Router 4**, **Vuex 4**, **Axios** và **DevExtreme 24.1**.
- Tích hợp **ESLint** & **Prettier**; đảm bảo không còn lỗi lint khi bàn giao.

### 2. Tầng API (Axios Instance)

- Cấu hình instance dùng chung: `baseURL` lấy từ `.env`, timeout mặc định **8 giây**.
- **Request Interceptor:** Tự động gắn token `Authorization: Bearer <token>` khi người dùng đã đăng nhập.
- **Response Interceptor:**
    - Chuẩn hóa lỗi thông qua class `ApiError` (`status`, `message`).
    - Hiển thị thông báo lỗi tự động bằng DevExtreme Notify.
    - **Xử lý 401 & Refresh Token:** Tự động gọi API `/auth/refresh` và gửi lại request ban đầu. Dùng chung một Promise để tránh gọi refresh nhiều lần khi nhiều request cùng bị 401. Đăng xuất và điều hướng về trang đăng nhập nếu refresh thất bại.
    - **Cơ chế Retry:** Tự động thử lại tối đa 2 lần đối với các request `GET` bị lỗi mạng hoặc lỗi server (status ≥ 500).

### 3. Routing & Phân quyền

- Các tuyến đường: Trang chủ, Chi tiết sản phẩm (`/products/:id`), Giỏ hàng, Đăng nhập, Đăng ký, `/admin/products`, `/admin/dashboard`, Trang 404.
- **Lazy Loading:** Áp dụng cho toàn bộ các route trang Admin để tối ưu bundle.
- **Navigation Guards:**
    - Chặn truy cập route Admin nếu chưa đăng nhập; hỗ trợ query param `?redirect=` để quay lại đúng trang sau khi đăng nhập thành công.
    - Tự động gọi API phục hồi phiên đăng nhập khi tải lại trang (nếu còn token hợp lệ).

### 4. Trang Khách hàng

- Lưới sản phẩm (12 sản phẩm/trang), có hiệu ứng Skeleton loading, nút "Thử lại" khi lỗi và hiển thị trạng thái khi không tìm thấy kết quả.
- Bộ lọc danh mục, sắp xếp theo giá và rating.
- Đồng bộ bộ lọc, từ khóa, phân trang lên URL query params (hỗ trợ nút Back/Forward và F5 giữ nguyên trạng thái).
- Trang chi tiết sản phẩm: Xem ảnh, thông tin, chọn số lượng, thêm vào giỏ hàng (kèm cache).
- Giao diện Responsive hoàn chỉnh (CSS Grid & Flexbox) tương thích tốt ở các kích thước `375px`, `768px`, `1280px`.

### 5. Quản lý trạng thái (Vuex)

- Tổ chức thành 3 module namespaced: `auth`, `products`, `cart`.
- Tuân thủ kiến trúc: Chỉ thay đổi state qua Mutations; các tác vụ bất đồng bộ/gọi API thực hiện trong Actions.
- **Module Giỏ hàng:** Có Getters `count`, `total`; giới hạn số lượng theo số lượng tồn kho (`stock`); đồng bộ lưu và khôi phục từ `localStorage` (tự động xử lý nếu dữ liệu cache lỗi).

### 6. Trang Quản trị (Admin)

- **/admin/products:**
    - Sử dụng **DxDataGrid** kết hợp **CustomStore** phân trang từ xa (map `skip`/`take` sang `skip`/`limit` của API).
    - Popup thêm/sửa sản phẩm với Validation rules đầy đủ (Tên bắt buộc, Giá/Tồn kho ≥ 0, Danh mục chọn qua DxSelectBox).
    - Xóa sản phẩm có popup xác nhận.
    - Hỗ trợ Export dữ liệu ra file Excel.
- **/admin/dashboard:**
    - Tải toàn bộ sản phẩm và trực quan hóa qua **DxChart** (Tổng tồn kho theo danh mục) và **DxPieChart** (Tỷ lệ số lượng sản phẩm).
    - Tính toán thống kê dữ liệu trực tiếp bằng `reduce` trên client, không gọi lặp API theo từng danh mục.

---

## 🚀 Hướng dẫn cài đặt và khởi chạy

### Yêu cầu môi trường

- Node.js >= 18.x
- Quản lý gói: npm hoặc yarn

### Các bước thực hiện

```bash
# 1. Clone repository về máy (chọn branch mini-shop)
git clone -b mini-shop https://github.com/tinhrenzi/bai_test_vue.js.git

# 2. Di chuyển vào đúng thư mục dự án
cd bai_test_vue.js/mini-shop

# 3. Cài đặt các phụ thuộc
npm install

# 4. Khởi chạy dự án ở môi trường dev
npm run dev
```

---

## 🔑 Tài khoản kiểm thử (Demo Accounts)

Trên giao diện trang Đăng nhập đã có sẵn các nút **"Điền"** tự động, hoặc bạn có thể nhập thủ công:

| Vai trò            | Tên đăng nhập | Mật khẩu                  | Ghi chú                           |
| :----------------- | :------------ | :------------------------ | :-------------------------------- |
| **Admin**          | `emilys`      | `emilyspass`              | Tài khoản Admin qua API DummyJSON |
| **Admin (Nội bộ)** | `admin`       | `admin` (hoặc `admin123`) | Tài khoản Admin giả lập nội bộ    |
| **Khách hàng**     | `michaelw`    | `michaelwpass`            | Tài khoản User thông thường       |

---

## 🧪 Hướng dẫn kiểm thử các tính năng nâng cao

1. **Giả lập mạng chập chờn / Delay:**
    - Chọn mức delay `1s - 2s - 3s - 5s` tại thanh dropdown bộ lọc trên thanh công cụ để kiểm tra trạng thái Skeleton Loading và nút "Thử lại".
2. **Kiểm thử Token hết hạn & Tự động Refresh (401 Handling):**
    - Tại màn hình Đăng nhập, tích chọn vào nút: **"Hết hạn sau 1 phút"**.
    - Sau khi đăng nhập, đợi 1 phút rồi thực hiện reload trang hoặc điều hướng. Quan sát tab Network / Console sẽ thấy hệ thống tự động bắt lỗi 401, gọi `/auth/refresh` lấy token mới và tiếp tục request bình thường.
3. **Đăng ký tài khoản mới:**
    - Hỗ trợ đăng ký cả tài khoản quyền Khách và quyền Admin phục vụ mục đích kiểm thử.

---

## 📌 Ghi chú về việc sử dụng AI

- Bài làm có sử dụng hỗ trợ từ AI (khoảng 30 - 40%) tập trung vào:
    - Trợ giúp thuật toán xử lý dữ liệu biểu đồ thống kê.
    - Hỗ trợ generate bộ dữ liệu đăng nhập mẫu và mock data.
    - Tinh chỉnh các chi tiết nhỏ về giao diện, căn chỉnh CSS và Responsive.
- Toàn bộ phần kiến trúc chính (Axios Interceptors, Vuex Store, Vue Router Guards, CustomStore DevExtreme Grid) được chủ động xây dựng và đối chiếu theo tài liệu kỹ thuật.
