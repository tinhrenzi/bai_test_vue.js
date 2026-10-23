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
   -- Lưới sản phẩm 12 sản phẩm/trang, có skeleton khi tải, thông báo lỗi kèm nút "Thử lại", trạng thái không có kết quả.
   -- Lọc theo danh mục, sắp xếp theo giá và rating.
   -- Trang, từ khóa, danh mục, sắp xếp đồng bộ lên URL query: tải lại trang giữ nguyên trạng thái, nút Back/Forward hoạt động đúng.
   -- Trang chi tiết sản phẩm: ảnh, mô tả, chọn số lượng, thêm vào giỏ (có cache).
   -- Giao diện responsive bằng CSS Grid/Flexbox, hiển thị tốt ở 375px, 768px, 1280px

5. **Vuex**
   -- Ba module namespaced: auth, products, cart
   -- Mọi thay đổi state chỉ đi qua mutation; gọi API đặt trong action.
   -- Module cart: getters count, total; số lượng không vượt quá stock; lưu vào localStorage và khôi phục khi tải lại (dữ liệu hỏng thì bỏ qua).
   -- Thêm, sửa, xóa sản phẩm ở trang admin cập nhật lại dữ liệu sau khi API thành công.

6. **Trang quản trị**
   -- /admin/products: DxDataGrid dùng CustomStore với remoteOperations phân trang, chuyển skip/take của grid sang skip/limit của API.
   -- Chỉnh sửa dạng popup: validation rules cho tên (bắt buộc), giá và tồn kho (số ≥ 0), danh mục (DxSelectBox lấy từ API).
   -- Xóa có xác nhận
   -- Export danh sách ra Excel.
   -- /admin/dashboard: tải toàn bộ sản phẩm, vẽ DxChart tổng tồn kho theo danh mục và DxPieChart tỷ lệ số sản phẩm theo danh mục. Phần tính toán dữ liệu cho biểu đồ dùng reduce, không gọi -- API riêng cho từng danh mục.

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

# 5. Đăng nhập
account đã được cung cấp sẵn, có thể lựa chọn điền nhanh khách hoặc admin để đăng nhập.

# 6. Giả lập mạng delay
delay 1s-2s-3s-5s bằng dropdown, có thể thực hiện xóa bộ lọc để reset.

# 7. Đăng ký
Hiện có thể đăng ký được cả hai tài khoản admin và khách (nhằm mục đích giả lập)

# 8. Token hết hạn
Có thể thực hiện bật/tắt trong thanh đăng nhập, sau đó xóa sạch dữ liệu hiển thị của chrome dev tools. Sau khi hết thời gian một phút, tiến hành reload trang sẽ thấy console có báo lỗi 401 (hoặc 500 nếu dommyjson trả về)


Bài làm có sử dụng AI (khoảng 30-40%) đối với các chức năng thống kê, tạo data đăng nhập tự động, chỉnh sửa lại các chi tiết nhỏ trong các khối, giao diện và css lại. Còn lại một số khác nhằm mục đích tham khảo và chỉnh sửa đối với trang chủ và call API sản phẩm và hiển thị lên trang.
```
