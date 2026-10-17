<template>
  <div id="app" style="padding: 24px; font-family: sans-serif;">
    <h2>Kiểm tra Module Vuex Auth</h2>

    <!-- TRƯỜNG HỢP 1: CHƯA ĐĂNG NHẬP -->
    <div v-if="!daDangNhap" style="border: 1px solid #ccc; padding: 16px; max-width: 350px;">
      <h3>Đăng nhập thử nghiệm</h3>
      <div style="margin-bottom: 12px;">
        <label>Tài khoản:</label><br />
        <input v-model="taiKhoan" type="text" style="width: 100%; padding: 6px;" />
      </div>
      <div style="margin-bottom: 12px;">
        <label>Mật khẩu:</label><br />
        <input v-model="matKhau" type="password" style="width: 100%; padding: 6px;" />
      </div>

      <button :disabled="dangTai" @click="xuLyDangNhap" style="padding: 8px 16px; cursor: pointer;">
        {{ dangTai ? 'Đang kiểm tra...' : 'Bấm Đăng Nhập' }}
      </button>

      <!-- Hiển thị lỗi nếu gõ sai mật khẩu -->
      <p v-if="loi" style="color: red; margin-top: 8px;">{{ loi }}</p>
    </div>

    <!-- TRƯỜNG HỢP 2: ĐÃ ĐĂNG NHẬP THÀNH CÔNG -->
    <div v-else style="border: 1px solid green; padding: 16px; max-width: 400px; background: #f0fff0;">
      <h3 style="color: green;">Đăng nhập thành công vào Vuex!</h3>
      <img :src="user?.image" width="70" style="border-radius: 50%;" />
      <p>Xin chào: <strong>{{ user?.firstName }} {{ user?.lastName }}</strong> ({{ user?.username }})</p>
      <p>Email: {{ user?.email }}</p>
      <p style="font-size: 12px; word-break: break-all;"><strong>Token:</strong> {{ token }}</p>

      <button @click="xuLyDangXuat"
        style="background: red; color: white; padding: 6px 12px; border: none; cursor: pointer;">
        Đăng Xuất
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      // Tài khoản mẫu của DummyJSON
      taiKhoan: 'emilys',
      matKhau: 'emilyspass',
    };
  },
  computed: {
    // Lấy dữ liệu từ Vuex module auth
    daDangNhap() {
      return this.$store.getters['auth/daDangNhap'];
    },
    user() {
      return this.$store.getters['auth/thongTinUser'];
    },
    token() {
      return this.$store.state.auth.token;
    },
    dangTai() {
      return this.$store.state.auth.dangTai;
    },
    loi() {
      return this.$store.state.auth.loi;
    },
  },
  async mounted() {
    // Khi vừa mở trang hoặc F5 tải lại trang, tự động gọi khôi phục phiên
    await this.$store.dispatch('auth/khoiPhucPhienLamViec');
  },
  methods: {
    async xuLyDangNhap() {
      try {
        await this.$store.dispatch('auth/dangNhap', {
          username: this.taiKhoan,
          password: this.matKhau,
        });
      } catch (err) {
        // Lỗi đã được lưu vào Vuex state loi
      }
    },
    xuLyDangXuat() {
      this.$store.dispatch('auth/dangXuat');
    },
  },
};
</script>