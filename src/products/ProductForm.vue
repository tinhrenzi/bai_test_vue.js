<template>
  <!-- Product Form -->
  <section class="card shadow-sm mb-4" aria-labelledby="product-form-heading">
    <div class="card-body">
      <h2 id="product-form-heading" class="h4 mb-3">
        {{ product.id ? 'Sửa sản phẩm' : 'Thêm sản phẩm' }}
      </h2>

      <form @submit.prevent="submitForm" novalidate>
        <div class="row g-3">
          <div class="col-12 col-md-6">
            <label for="product-name" class="form-label">Tên sản phẩm</label>
            <input id="product-name" v-model.trim="product.name" class="form-control" required />
          </div>
          <div class="col-12 col-md-6">
            <label for="product-category" class="form-label">Danh mục</label>
            <input id="product-category" v-model.trim="product.category" class="form-control" required />
          </div>
          <div class="col-12 col-md-6">
            <label for="product-brand" class="form-label">Hãng</label>
            <input id="product-brand" v-model.trim="product.brand" class="form-control" required />
          </div>
          <div class="col-6 col-md-3">
            <label for="product-price" class="form-label">Giá (₫)</label>
            <input id="product-price" v-model.number="product.price" class="form-control" type="number" min="1" step="1"
              required />
          </div>
          <div class="col-6 col-md-3">
            <label for="product-stock" class="form-label">Tồn kho</label>
            <input id="product-stock" v-model.number="product.stock" class="form-control" type="number" min="0" step="1"
              required />
          </div>
          <div class="col-12 col-md-6">
            <label for="product-status" class="form-label">Trạng thái</label>
            <select id="product-status" v-model="product.status" class="form-select">
              <option value="active">Đang bán</option>
              <option value="inactive">Ngừng bán</option>
            </select>
          </div>
        </div>

        <div class="d-flex flex-column flex-sm-row gap-2 mt-4">
          <button class="btn btn-primary" type="submit" :disabled="isLoading">
            {{ isLoading ? 'Đang lưu ...' : (isEdit ? 'Lưu thay đổi' : 'Thêm sản phẩm') }}
          </button>
          <button class="btn btn-outline-secondary" type="button" @click="cancelForm">
            Hủy
          </button>
        </div>
      </form>

    </div>
  </section>
</template>

<script>
// Trang form dùng chung cho thao tác thêm mới và chỉnh sửa sản phẩm.

import { mapGetters } from 'vuex'

export default {

  name: 'ProductForm',

  // Nạp dữ liệu vào form khi sửa, hoặc để form trống khi thêm mới.

  data() {
    return {
      isLoading: false
    }
  },

  computed: {
    ...mapGetters('SanPhams', ['products']),
    isEdit() {
      return this.$route.name === 'product-edit'
    },
    product: {
      get() {
        return this.$store.state.SanPhams.product
      },
      set(value) {
        this.$store.commit("SanPhams/Set", {
          key: "product",
          value
        })
      }
    },
  },

  watch: {
  },

  methods: {
    // Trả về lỗi đầu tiên để chỉ gửi dữ liệu hợp lệ lên component cha.
    validateForm() {
      try {
        if (!this.product.name.trim()) return 'Tên sản phẩm không được để trống.';

        if (!this.product.category.trim()) return 'Danh mục không được để trống.';

        if (!this.product.brand.trim()) return 'Hãng không được để trống.';

        if (!Number.isInteger(this.product.price) || this.product.price <= 0) {
          return 'Giá sản phẩm phải là số nguyên lớn hơn 0.';
        };

        if (!Number.isInteger(this.product.stock) || this.product.stock <= 0) {
          return 'Số lượng sản phẩm phải là số nguyên lớn hơn 0.';
        };

        if (this.product.stock === '' || !Number.isInteger(this.product.stock) || this.product.stock < 0) {
          return 'Tồn kho phải là số nguyên không âm.';
        };
      } catch (error) {

      }

    },

    async submitForm() {
      const error = this.validateForm();
      if (error) {
        alert(error);
        return;
      };

      const payload = {
        ...this.product,
        id: this.isEdit
          ? this.product.id
          : Date.now(),
        createdAt: this.isEdit
          ? this.product.createdAt
          : new Date().toISOString().slice(0, 10)
      }

      const action = this.isEdit ? 'updateProduct' : 'addProduct'

      this.isLoading = true

      try {
        const [saved] = await Promise.all([
          this.$store.dispatch(`SanPhams/${action}`, payload),
          new Promise(resolve => setTimeout(resolve, 1000))
        ])

        if (!saved) {
          alert('Không lưu được sản phẩm.')
          return
        } else {
          alert('Luu thanh cong!')
        }

        await this.$router.push({ name: 'products' })
      } catch (error) {
        console.error('Lỗi khi lưu sản phẩm:', error)
        alert('Có lỗi khi lưu sản phẩm.')
      }
    },

    cancelForm() {
      this.$router.push({ name: 'products' })
    }
  },
  async created() {
    if (!this.isEdit) return

    const found = await this.$store.dispatch(
      'SanPhams/loadProductById',
      this.$route.params.id
    )

    if (!found) {
      alert('Không tìm thấy sản phẩm')
      this.$router.push({ name: 'products' })
    }
  },

}
</script>