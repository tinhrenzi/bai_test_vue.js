<template>
  <div id="app" style="padding: 24px; font-family: sans-serif; max-width: 600px;">
    <h2>Kiểm tra Module Vuex Cart (Giỏ hàng)</h2>

    <!-- KHỐI SẢN PHẨM MẪU ĐỂ TEST THÊM VÀO GIỎ -->
    <div style="border: 1px solid #aaa; padding: 12px; margin-bottom: 20px; background: #fafafa;">
      <h3>Sản phẩm mẫu để bấm thử:</h3>
      <p>Tên: <strong>Áo Thun Mini Shop</strong> - Giá: <strong>$19.99</strong></p>
      <p style="color: blue;">Tồn kho trong kho chỉ còn: <strong>3 cái</strong></p>
      <button @click="themSanPhamMau" style="padding: 8px 16px; background: #28a745; color: white; border: none; cursor: pointer;">
        + Bấm Thêm Vào Giỏ
      </button>
    </div>

    <!-- KHỐI HIỂN THỊ THÔNG TIN GIỎ HÀNG -->
    <div style="border: 2px solid #007bff; padding: 16px; border-radius: 6px;">
      <h3>Giỏ Hàng Của Bạn</h3>
      <p>Tổng số lượng món (getters.count): <strong style="font-size: 18px; color: red;">{{ tongSoLuong }}</strong></p>
      <p>Tổng tiền hóa đơn (getters.total): <strong style="font-size: 18px; color: red;">${{ tongTien }}</strong></p>

      <div v-if="gioHang.length === 0" style="color: gray;">Giỏ hàng đang trống.</div>

      <!-- DANH SÁCH CÁC MÓN TRONG GIỎ -->
      <ul v-else style="padding-left: 20px;">
        <li v-for="item in gioHang" :key="item.id" style="margin-bottom: 10px;">
          <strong>{{ item.title }}</strong> - ${{ item.price }} / cái 
          <br />
          Số lượng: 
          <button @click="giamSoLuong(item)">-</button>
          <strong> {{ item.quantity }} </strong>
          <button @click="tangSoLuong(item)">+</button>
          (Tối đa: {{ item.stock }})
          <button @click="xoaMon(item.id)" style="margin-left: 10px; color: red;">Xóa</button>
        </li>
      </ul>

      <button v-if="gioHang.length > 0" @click="xoaHet" style="margin-top: 10px; background: #dc3545; color: white; border: none; padding: 6px 12px; cursor: pointer;">
        Xóa Sạch Giỏ Hàng
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    gioHang() {
      return this.$store.getters['cart/danhSachSanPham'];
    },
    tongSoLuong() {
      return this.$store.getters['cart/count'];
    },
    tongTien() {
      return this.$store.getters['cart/total'];
    },
  },
  methods: {
    // 1. Test thêm sản phẩm có stock = 3
    themSanPhamMau() {
      this.$store.dispatch('cart/themVaoGio', {
        sanPham: {
          id: 101,
          title: 'Áo Thun Mini Shop',
          price: 19.99,
          thumbnail: 'https://via.placeholder.com/150',
          stock: 3, // Giả lập trong kho chỉ còn đúng 3 cái
        },
        soLuong: 1,
      });
    },

    // 2. Test tăng số lượng
    tangSoLuong(item) {
      this.$store.dispatch('cart/capNhatSoLuong', {
        id: item.id,
        soLuong: item.quantity + 1,
      });
    },

    // 3. Test giảm số lượng (nếu giảm về 0 sẽ tự xóa)
    giamSoLuong(item) {
      this.$store.dispatch('cart/capNhatSoLuong', {
        id: item.id,
        soLuong: item.quantity - 1,
      });
    },

    // 4. Test xóa 1 món
    xoaMon(id) {
      this.$store.dispatch('cart/xoaSanPham', id);
    },

    // 5. Test xóa sạch giỏ
    xoaHet() {
      this.$store.dispatch('cart/xoaTatCa');
    },
  },
};
</script>