<template>
  <div id="app">
    <h1>Kiểm tra kết nối API Mini Shop</h1>
    <p v-if="dangTai">Đang tải dữ liệu từ máy chủ...</p>
    <div v-else>
      <p>Tổng số sản phẩm lấy được: <strong>{{ danhSachSanPham.length }}</strong></p>
      <ul>
        <li v-for="sp in danhSachSanPham" :key="sp.id">
          {{ sp.title }} - <strong>${{ sp.price }}</strong>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// Import hàm gọi API vừa viết
import { layDanhSachSanPham } from './api/apiProduct';

export default {
  name: 'App',
  data() {
    return {
      danhSachSanPham: [],
      dangTai: true,
    };
  },
  async mounted() {
    try {
      console.log('--- ĐANG BẮT ĐẦU GỌI API THỬ NGHIỆM ---');
      const ketQua = await layDanhSachSanPham({ soLuong: 5 });
      console.log('Dữ liệu API trả về thành công:', ketQua.data);
      this.danhSachSanPham = ketQua.data.products;
    } catch (loi) {
      console.error('API bị lỗi:', loi);
    } finally {
      this.dangTai = false;
    }
  },
};
</script>