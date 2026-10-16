<template>
  <!-- Product Page -->
  <section>
    <h1>Quản lý sản phẩm</h1>
    <p>{{ productsCount }} Sản phẩm</p>
    <DxButton text="Thêm sản phẩm" icon="plus" type="default" styling-mode="contained" class="mb-3"
      @click="$router.push({ name: 'product-create' })" />
    <ProductFilter :categories="categories" :brands-list="brandsList" :status-list="statusList" :sort-by="sortBy"
      @search="applyFilters" @reset="resetFilters" @sort-price="togglePriceSort" @sort-date="toggleDateSort" />

    <p v-if="products.length && !filteredProducts.length">Không tìm thấy sản phẩm phù hợp.</p>
    <div v-else-if="filteredProducts.length" class="d-none d-lg-block">
      <ProductTable :products="filteredProducts" @edit="editProduct" @delete="deleteProduct" @history="historyEdit" />
    </div>

    <div v-if="filteredProducts.length" class="d-block d-lg-none">
      <ProductCard v-for="product in paginationProduct" :key="product.id" :product="product" @edit="editProduct"
        @delete="deleteProduct" />

      <Pagination v-if="totalPage > 1" :current-page="currentPage" :total-pages="totalPage"
        @page-changed="currentPage = $event" />
    </div>
    <p v-if="!products.length">Chưa có sản phẩm.</p>

    <DxPopup v-model:visible="isHistoryPopupVisible" :show-title="true" title="Lịch sử chỉnh sửa sản phẩm" :width="800"
      :height="500" :drag-enabled="true" :close-on-outside-click="true">
      <div class="p-2">
        <DxDataGrid :data-source="historyGridData" :show-borders="true" :column-auto-width="true"
          :row-alternation-enabled="true" no-data-text="Chưa có lịch sử chỉnh sửa nào cho sản phẩm này!">

          <DxPaging :page-size="5" />
          <DxPager :show-info="true" />

          <DxColumn data-field="time" caption="Thời gian" alignment="center" width="180" />
          <DxColumn data-field="field" caption="Trường thay đổi" alignment="center" width="180" />
          <DxColumn data-field="oldVal" caption="Giá trị cũ" alignment="center" width="180"
            cell-template="oldValTemplate" />
          <DxColumn data-field="newVal" caption="Giá trị mới" alignment="center" width="180"
            cell-template="newValTemplate" />

          <template #oldValTemplate="{ data }">
            <span class="text-danger">{{ data.value }}</span>
          </template>
          <template #newValTemplate="{ data }">
            <span class="text-success fw-bold">{{ data.value }}</span>
          </template>
        </DxDataGrid>
      </div>
    </DxPopup>

  </section>

</template>

<script>
import ProductTable from './components/ProductTable.vue'
import ProductCard from './components/ProductCard.vue'
import ProductFilter from './components/ProductFilter.vue'
import Pagination from './components/common/Pagination.vue'
import { confirm } from 'devextreme/ui/dialog'
import notify from 'devextreme/ui/notify'
import { DxPopup } from 'devextreme-vue/popup'
import { DxButton } from 'devextreme-vue/button'

import { mapState, mapGetters } from 'vuex'
import { DxDataGrid, DxColumn, DxPaging, DxPager } from 'devextreme-vue/data-grid'

export default {
  name: 'ProductsPage',
  components: {
    ProductTable,
    ProductCard,
    ProductFilter,
    Pagination,
    DxPopup,
    DxButton,
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxPager
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      isHistoryPopupVisible: false,
      selectedProductId: null,
      filters: {
        category: '',
        brands: '',
        status: '',
        keyword: ''
      },

      sortBy: ''
    }
  },

  computed: {
    ...mapGetters('SanPhams', ['productsCount', 'products']),
    ...mapGetters('LichSu', ['histories']),
    currentProductHistories() {
      if (!this.selectedProductId) return []
      return this.histories.filter(h => String(h.productId) === String(this.selectedProductId))
    },
    product() {
      return this.$store.state.SanPhams.product
    },

    categories() {
      return [...new Set(this.products.map(product => product.category))].sort()
    },

    brandsList() {
      return [...new Set(this.products.map(product => product.brand))].sort()
    },

    statusList() {
      return [
        { value: 'active', label: 'Đang bán' },
        { value: 'inactive', label: 'Ngừng bán' }
      ]
    },

    filteredProducts() {
      const keyword = this.filters.keyword.trim().toLocaleLowerCase()
      const result = this.products.filter(product => {
        const matchesKeyword = !keyword || [
          product.name,
          product.category,
          product.brand
        ].some(value => value.toLocaleLowerCase().includes(keyword))

        return (!this.filters.category || product.category === this.filters.category)
          && (!this.filters.brands || product.brand === this.filters.brands)
          && (!this.filters.status || product.status === this.filters.status)
          && matchesKeyword
      })

      if (this.sortBy === 'price-asc') {
        return result.sort((a, b) => a.price - b.price)
      }
      if (this.sortBy === 'price-desc') {
        return result.sort((a, b) => b.price - a.price)
      }
      if (this.sortBy === 'date-asc') {
        return result.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      }
      if (this.sortBy === 'date-desc') {
        return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      }

      return result
    },

    totalPage() {
      return Math.ceil(this.filteredProducts.length / this.pageSize)
    },

    paginationProduct() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredProducts.slice(start, start + this.pageSize)
    },

    historyGridData() {
      if (!this.selectedProductId) return []
      const list = []

      const fieldNames = {
        name: 'Tên sản phẩm',
        category: 'Danh mục',
        brand: 'Hãng',
        price: 'Giá',
        stock: 'Tồn kho',
        status: 'Trạng thái'
      }

      this.currentProductHistories.forEach(item => {
        Object.keys(item.changes || {}).forEach(field => {
          const change = item.changes[field]


          if (change && change.oldVal !== change.newVal) {
            list.push({
              time: item.time,
              field: fieldNames[field] || field,
              oldVal: change.oldVal,
              newVal: change.newVal
            })
          }
        })
      })
      return list
    }
  },

  methods: {
    applyFilters(filters) {
      this.filters = { ...filters }
    },

    resetFilters() {
      this.filters = {
        category: '',
        brands: '',
        status: '',
        keyword: ''
      }
      this.sortBy = ''
    },

    togglePriceSort() {
      this.sortBy = this.sortBy === 'price-desc'
        ? 'price-asc'
        : this.sortBy === 'price-asc' ? '' : 'price-desc'
    },

    toggleDateSort() {
      this.sortBy = this.sortBy === 'date-desc'
        ? 'date-asc'
        : this.sortBy === 'date-asc' ? '' : 'date-desc'
    },

    editProduct(product) {
      this.$router.push({
        name: 'product-edit',
        params: { id: product.id }
      })
    },

    async deleteProduct(productId) {
      const isConfirmed = await confirm(
        'Bạn có chắc chắn muốn xóa sản phẩm này không?',
        'Xác nhận xóa'
      )
      if (!isConfirmed) return

      const deleted = await this.$store.dispatch('SanPhams/deleteProduct', productId)

      if (!deleted) {
        notify('Không thể xóa sản phẩm!', 'error', 2500)
      } else {
        notify('Đã xóa sản phẩm thành công!', 'success', 2500)
      }
    },

    historyEdit(productId) {
      this.selectedProductId = productId
      this.isHistoryPopupVisible = true
    }
  }
}

</script>
