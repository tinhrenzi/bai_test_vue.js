# Coding Standards & Architectural Rules

## Vuex / State Management Guidelines

### 1. Phân định rõ ràng trách nhiệm giữa Actions và Mutations
- **Actions xử lý Side Effects & Storage (thay cho API):**
  - Mọi thao tác I/O như đọc, ghi, xóa `localStorage`, `sessionStorage`, hoặc gọi API bên ngoài **BẮT BUỘC** phải thực hiện trong **`actions`**.
  - `localStorage` đóng vai trò như tầng lưu trữ dữ liệu (tương đương gọi API cục bộ).
  - Luồng chuẩn: Component `dispatch('actionName', payload)` ➔ Action xử lý `localStorage.setItem/removeItem` (hoặc gọi API) ➔ Action `commit('MUTATION_NAME', data)` để cập nhật state.

- **Mutations chỉ thao tác với State (Pure Functions):**
  - `mutations` **CHỈ** thuần túy nhận state và payload để cập nhật state trong bộ nhớ.
  - **TUYỆT ĐỐI KHÔNG** gọi `localStorage.setItem`, `localStorage.removeItem`, `localStorage.getItem` hoặc bất kỳ side-effect/tác vụ bất đồng bộ nào trong `mutations`.
