<template>
  <main class="container py-4">
    <!-- RouterView hiển thị danh sách hoặc form theo URL hiện tại. -->
    <RouterView v-slot="{ Component }">
      <component
        v-if="$route.name === 'products'"
        :is="Component"
        :products="paginatedProducts"
        :total-products="filteredProducts.length"
        :categories="categories"
        :brands-list="brandsList"
        :status-list="statusList"
        :current-page="currentPage"
        :total-pages="totalPages"
        @search="searchProducts"
        @reset="resetFilters"
        @add="openAddForm"
        @edit="openEditForm"
        @delete="deleteProduct"
        @page-changed="currentPage = $event"
      />
      <component
        v-else
        :is="Component"
        :product="editingProduct"
        @save="saveProduct"
        @cancel="closeProductForm"
      />
    </RouterView>
  </main>
</template>

<script>
import productsData from './data/products.json'

export default {
  name: 'App',
  data() {
    return {
      products: [],
      searchKeyword: '',
      selectedCategory: '',
      selectedBrands: '',
      selectedStatus: '',
      currentPage: 1,
      itemsPerPage: 10
    }
  },
  created() {
    this.products = productsData
  },
  computed: {
    categories() {
      return [...new Set(this.products.map(product => product.category))]
    },
    brandsList() {
      return [...new Set(this.products.map(product => product.brand))]
    },
    statusList() {
      return [
        { value: 'active', label: 'Đang bán' },
        { value: 'inactive', label: 'Ngừng bán' }
      ]
    },
    // Kết hợp các tiêu chí lọc trước khi chia trang.
    filteredProducts() {
      const keyword = this.searchKeyword.trim().toLocaleLowerCase('vi')

      return this.products.filter(product => {
        const matchesCategory =
          !this.selectedCategory || product.category === this.selectedCategory
        const matchesBrand =
          !this.selectedBrands || product.brand === this.selectedBrands
        const matchesStatus =
          !this.selectedStatus || product.status === this.selectedStatus
        const matchesKeyword =
          !keyword ||
          [product.name, product.category, product.brand]
            .some(value => value.toLocaleLowerCase('vi').includes(keyword))

        return matchesCategory && matchesBrand && matchesStatus && matchesKeyword
      })
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage)
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.filteredProducts.slice(start, start + this.itemsPerPage)
    },
    // Tìm sản phẩm theo ID trên URL để form hỗ trợ cả reload trực tiếp trang sửa.
    editingProduct() {
      if (this.$route.name !== 'product-edit') return null
      return this.products.find(product => product.id === Number(this.$route.params.id)) || null
    }
  },
  methods: {
    searchProducts({ category, brands, status, keyword }) {
      this.selectedCategory = category
      this.selectedBrands = brands
      this.selectedStatus = status
      this.searchKeyword = keyword
      this.currentPage = 1
    },
    resetFilters() {
      this.selectedCategory = ''
      this.selectedBrands = ''
      this.selectedStatus = ''
      this.searchKeyword = ''
      this.currentPage = 1
    },
    // Mở route form riêng cho thao tác thêm sản phẩm.
    openAddForm() {
      this.$router.push({ name: 'product-create' })
    },
    // Mở route form riêng và truyền ID sản phẩm qua URL.
    openEditForm(product) {
      this.$router.push({ name: 'product-edit', params: { id: product.id } })
    },
    // Lưu dữ liệu form; giữ ID/ngày tạo khi sửa và tạo chúng khi thêm mới.
    saveProduct(formData) {
      const normalizedName = formData.name.trim().toLocaleLowerCase('vi')
      const duplicate = this.products.some(product =>
        product.name.trim().toLocaleLowerCase('vi') === normalizedName &&
        product.id !== this.editingProduct?.id
      )

      if (duplicate) {
        alert('Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác.')
        return
      }

      if (this.editingProduct) {
        this.products = this.products.map(product =>
          product.id === this.editingProduct.id
            ? { ...formData, id: product.id, createdAt: product.createdAt }
            : product
        )
      } else {
        const nextId = Math.max(0, ...this.products.map(product => product.id)) + 1
        const now = new Date()
        const createdAt = [
          now.getFullYear(),
          String(now.getMonth() + 1).padStart(2, '0'),
          String(now.getDate()).padStart(2, '0')
        ].join('-')
        this.products = [{ ...formData, id: nextId, createdAt }, ...this.products]
      }

      this.$router.push({ name: 'products' })
    },
    // Hủy form và quay về danh sách sản phẩm.
    closeProductForm() {
      this.$router.push({ name: 'products' })
    },
    deleteProduct(productId) {
      if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này không?')) return

      this.products = this.products.filter(product => product.id !== productId)
      this.currentPage = Math.min(this.currentPage, Math.max(1, this.totalPages))
    }
  }
}
</script>
