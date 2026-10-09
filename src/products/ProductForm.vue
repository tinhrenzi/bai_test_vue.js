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
          <button class="btn btn-outline-secondary" type="button" @click="cancelForm">
            Hủy
          </button>
        </div>
      </form>

      <Pagination v-if="totalPages > 1" :current-page="currentPage" :total-pages="currentPage"
        @page-changed="currentPage = $event" />
    </div>
  </section>
</template>

<script>
// Trang form dùng chung cho thao tác thêm mới và chỉnh sửa sản phẩm.

import { mapState } from 'vuex'
import Pagination from './components/common/Pagination.vue';

export default {

  name: 'ProductForm',

  // Nạp dữ liệu vào form khi sửa, hoặc để form trống khi thêm mới.

  data() {
    return {
      form: { ...this.$store.state.newProductDraft }
    }
  },

  computed: {
    ...mapState(['products', 'newProductDraft']),
    isEdit() {
      return this.$route.name === 'product-edit'
    },

    product() {
      if (!this.isEdit) {
        return null;
      }

      return this.products.find(
        item => item.id === Number(this.$route.params.id)
      ) || null
    },
  },

  watch: {
    product: {
      immediate: true,
      handler(product) {
        this.form = product ? { ...product } : { ...this.newProductDraft }
      }
    },
    form: {
      deep: true,
      handler(form) {
        if (!this.isEdit) {
          this.$store.commit('setNewProductDraft', form);
        }
      }
    }
  },

  methods: {
    // Trả về lỗi đầu tiên để chỉ gửi dữ liệu hợp lệ lên component cha.
    validateForm() {
      if (!this.form.name.trim()) return 'Tên sản phẩm không được để trống.';

      if (!this.form.category.trim()) return 'Danh mục không được để trống.';

      if (!this.form.brand.trim()) return 'Hãng không được để trống.';

      if (!Number.isInteger(this.form.price) || this.form.price <= 0) {
        return 'Giá sản phẩm phải là số nguyên lớn hơn 0.';
      };

      if (!Number.isInteger(this.form.stock) || this.form.stock < 0) {
        return 'Số lượng sản phẩm phải là số nguyên lớn hơn 0.';
      };

      if (this.form.stock === '' || !Number.isInteger(this.form.stock) || this.form.stock <= 0) {
        return 'Tồn kho phải là số nguyên không âm.';
      };

      return null;
    },

    submitForm() {
      const error = this.validateForm();
      if (error) {
        alert(error);
        return;
      };

      if (this.isEdit) {
        if (!this.product) {
          alert('Khong tim thay san pham');
          this.$router.push({ name: 'products' });
          return;
        };
        this.$store.commit('updateProduct', {
          ...this.form,
          id: this.product.id,
          createdAt: this.product.createdAt
        });
      } else {
        const nextId = Math.max(0, ...this.products.map(item => item.id)) + 1

        this.$store.commit('addProduct', {
          ...this.form,
          id: nextId,
          createdAt: new Date().toISOString().slice(0, 10)
        });
      };
      this.$router.push({ name: 'products' })
    },

    cancelForm() {
      this.$router.push({ name: 'products' })
    }
  }

}
</script>