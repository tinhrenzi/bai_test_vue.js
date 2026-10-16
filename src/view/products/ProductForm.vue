<template>
  <!-- Product Form -->
  <section class="card shadow-sm mb-4" aria-labelledby="product-form-heading">
    <div class="card-body">
      <h2 id="product-form-heading" class="h4 mb-3">
        {{ product.id ? 'Sửa sản phẩm' : 'Thêm sản phẩm' }}
      </h2>

      <form @submit.prevent="submitForm" novalidate>
        <div class="row g-3">
          <!--  -->
          <div class="col-12 col-md-6">
            <label for="product-name" class="form-label">Tên sản phẩm</label>
            <DxTextBox v-model:value="product.name" placeholder="Nhập tên sản phẩm">
              <DxValidator>
                <DxRequiredRule message="Tên sản phẩm không được để trống!" />
              </DxValidator>
            </DxTextBox>
          </div>
          <div class="col-12 col-md-6">
            <label for="product-category" class="form-label">Danh mục</label>
            <DxTextBox v-model:value="product.category" placeholder="Nhập danh mục sản phẩm!">
              <DxValidator>
                <DxRequiredRule message="Danh mục sản phẩm không được để trống!" />
              </DxValidator>
            </DxTextBox>
          </div>
          <div class="col-12 col-md-6">
            <label for="product-brand" class="form-label">Hãng</label>
            <DxTextBox v-model:value="product.brand" placeholder="Nhập hãng!">
              <DxValidator>
                <DxRequiredRule message="Hãng không được để trống!" />
              </DxValidator>
            </DxTextBox>
          </div>
          <!--  -->
          <div class="col-6 col-md-3">
            <label for="product-price" class="form-label">Giá (₫)</label>
            <DxNumberBox v-model:value="product.price" :min="1" :show-spin-buttons="true" placeholder="Nhập giá!">
              <DxValidator>
                <DxRequiredRule message="Giá sản phẩm không được để trống!" />
                <DxRangeRule :min="1" message="Giá sản phẩm phải lớn hơn 0!" />
              </DxValidator>
            </DxNumberBox>
          </div>
          <div class="col-6 col-md-3">
            <label for="product-stock" class="form-label">Tồn kho</label>
            <DxNumberBox v-model:value="product.stock" :min="1" :show-spin-buttons="true" placeholder="Nhập số lượng!">
              <DxValidator>
                <DxRequiredRule message="Số lượng sản phẩm không được để trống!" />
                <DxRangeRule :min="1" message="Số lượng sản phẩm phải lớn hơn 0!" />
              </DxValidator>
            </DxNumberBox>
          </div>


          <div class="col-12 col-md-6">
            <label for="product-status" class="form-label">Trạng thái</label>
            <DxSelectBox v-model:value="product.status" :items="statusOptions" display-expr="label" value-expr="value"
              placeholder="Chọn trạng thái!" />
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label fw-semibold">Ngày tạo</label>
            <DxDateBox v-model:value="product.createdAt" type="date" display-format="yyyy-MM-dd"
              placeholder="Chọn ngày tạo!" />
          </div>
          <div class="col-12 mt-3">
            <DxCheckBox v-model:value="isConfirmed" text="Xác nhận các thông tin trên là chính xác?" />
          </div>

        </div>

        <div class="d-flex flex-column flex-sm-row gap-2 mt-4">
          <DxButton :text="isLoading ? 'Đang lưu' : (isEdit ? 'Lưu thay đổi' : 'Thêm sản phẩm')" type="default"
            styling-mode="contained" :use-submit-behavior="true" :disabled="isLoading || !isConfirmed" />
          <DxButton text="Hủy" type="nomal" styling-mode="outlined" @click="cancelForm" />
        </div>
      </form>

    </div>
  </section>
</template>

<script>
// Trang form dùng chung cho thao tác thêm mới và chỉnh sửa sản phẩm.

import { mapGetters } from 'vuex'
import notify from 'devextreme/ui/notify'

import { DxTextBox } from 'devextreme-vue/text-box'
import { DxNumberBox } from 'devextreme-vue/number-box'
import { DxSelectBox } from 'devextreme-vue/select-box'
import { DxDateBox } from 'devextreme-vue/date-box'
import { DxCheckBox } from 'devextreme-vue/check-box'
import { DxButton } from 'devextreme-vue/button'
import { DxValidator, DxRequiredRule, DxRangeRule } from 'devextreme-vue/validator'

export default {
  name: 'ProductForm',
  components: {
    DxTextBox,
    DxNumberBox,
    DxSelectBox,
    DxDateBox,
    DxCheckBox,
    DxButton,
    DxValidator,
    DxRequiredRule,
    DxRangeRule
  },
  data() {
    return {
      isLoading: false,
      isConfirmed: false,
      statusOptions: [
        { value: 'active', label: 'Đang bán' },
        { value: 'inactive', label: 'Ngừng bán' }
      ]
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
        notify(error, 'warning', 2500)
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
          notify('Không lưu được sản phẩm.', 'error', 2500)
          return
        } else {
          notify('Lưu sản phẩm thành công!', 'success', 2000)
        }

        await this.$router.push({ name: 'products' })
      } catch (error) {
        console.error('Lỗi khi lưu sản phẩm:', error)
        notify('Có lỗi khi lưu sản phẩm.', 'error', 2500)
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
      notify('Không tìm thấy sản phẩm', 'error', 2000)
      this.$router.push({ name: 'products' })
    }
  },

}
</script>