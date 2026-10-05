<template>
  <section class="card shadow-sm mb-4" aria-labelledby="product-form-heading">
    <div class="card-body">
      <h2 id="product-form-heading" class="h4 mb-3">
        {{ product ? 'Sửa sản phẩm' : 'Thêm sản phẩm' }}
      </h2>

      <form @submit.prevent="submitForm" novalidate>
        <div class="row g-3">
          <div class="col-12 col-md-6">
            <label for="product-name" class="form-label">Tên sản phẩm</label>
            <input id="product-name" v-model.trim="form.name" class="form-control" required />
          </div>
          <div class="col-12 col-md-6">
            <label for="product-category" class="form-label">Danh mục</label>
            <input id="product-category" v-model.trim="form.category" class="form-control" required />
          </div>
          <div class="col-12 col-md-6">
            <label for="product-brand" class="form-label">Hãng</label>
            <input id="product-brand" v-model.trim="form.brand" class="form-control" required />
          </div>
          <div class="col-6 col-md-3">
            <label for="product-price" class="form-label">Giá (₫)</label>
            <input id="product-price" v-model.number="form.price" class="form-control" type="number" min="1" step="1"
              required />
          </div>
          <div class="col-6 col-md-3">
            <label for="product-stock" class="form-label">Tồn kho</label>
            <input id="product-stock" v-model.number="form.stock" class="form-control" type="number" min="0" step="1"
              required />
          </div>
          <div class="col-12 col-md-6">
            <label for="product-status" class="form-label">Trạng thái</label>
            <select id="product-status" v-model="form.status" class="form-select">
              <option value="active">Đang bán</option>
              <option value="inactive">Ngừng bán</option>
            </select>
          </div>
        </div>

        <div class="d-flex flex-column flex-sm-row gap-2 mt-4">
          <button class="btn btn-primary" type="submit">
            {{ product ? 'Lưu thay đổi' : 'Thêm sản phẩm' }}
          </button>
          <button class="btn btn-outline-secondary" type="button" @click="$emit('cancel')">
            Hủy
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
// Trang form dùng chung cho thao tác thêm mới và chỉnh sửa sản phẩm.
const emptyProduct = () => ({
  name: '',
  category: '',
  brand: '',
  price: 0,
  stock: 0,
  status: 'active'
})

export default {
  name: 'ProductForm',
  props: {
    product: {
      type: Object,
      default: null
    }
  },
  emits: ['save', 'cancel'],
  data() {
    return {
      form: emptyProduct(),

    }
  },
  watch: {
    // Nạp dữ liệu vào form khi sửa, hoặc để form trống khi thêm mới.
    product: {
      immediate: true,
      handler(product) {
        this.form = product ? { ...product } : emptyProduct()
      }
    }
  },
  methods: {
    // Trả về lỗi đầu tiên để chỉ gửi dữ liệu hợp lệ lên component cha.
    validateForm() {
      if (!this.form.name.trim()) return 'Tên sản phẩm không được để trống.'
      if (!this.form.category.trim()) return 'Danh mục không được để trống.'
      if (!this.form.brand.trim()) return 'Hãng không được để trống.'
      if (!Number.isInteger(this.form.price) || this.form.price <= 0) {
        return 'Giá sản phẩm phải là số nguyên lớn hơn 0.'
      }
      if (this.form.stock === '' || !Number.isInteger(this.form.stock) || this.form.stock < 0) {
        return 'Tồn kho phải là số nguyên không âm.'
      }

      return null
    },
    submitForm() {
      const error = this.validateForm()
      if (error) {
        alert(error)
        return;
      }
      this.$emit('save', { ...this.form })
    }
  }
}
</script>