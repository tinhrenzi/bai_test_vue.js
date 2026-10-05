<template>
  <div class="container py-4">
    <ProductFilter :categories="categories" :brands-list="brandsList" :status-list="statusList" @search="searchProducts"
      @reset="resetFilters" />

    <header class="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-4">
      <h1 class="h2 fw-bold mb-0">Quản lý sản phẩm</h1>
      <button class="btn btn-primary" type="button" @click="openAddForm">
        Thêm sản phẩm
      </button>
    </header>

    <!-- Dùng chung form cho cả thao tác thêm mới và chỉnh sửa sản phẩm. -->
    <ProductForm v-if="showProductForm" :product="editingProduct" @save="saveProduct" @cancel="closeProductForm" />

    <div v-if="filteredProducts.length" class="d-none d-lg-block">
      <ProductTable :products="paginatedProducts" @edit="openEditForm" @delete="deleteProduct" />
    </div>

    <div v-if="filteredProducts.length" class="d-block d-lg-none">
      <ProductCard v-for="item in paginatedProducts" :key="item.id" :product="item" @edit="openEditForm"
        @delete="deleteProduct" />
    </div>
    <p v-else class="alert alert-info">Không tìm thấy sản phẩm phù hợp.</p>
    <Pagenation v-if="totalPages > 1" :current-page="currentPage" :total-pages="totalPages"
      @page-changed="currentPage = $event" />
  </div>
</template>

<script>
import productsData from './data/products.json'
import ProductTable from './components/ProductTable.vue'
import ProductCard from './components/ProductCard.vue'
import ProductFilter from './components/ProductFilter.vue';
import Pagenation from './components/Pagenation.vue';
import ProductForm from './components/ProductForm.vue';
export default {
  name: 'App',
  components: {
    ProductTable,
    ProductCard,
    ProductFilter,
    Pagenation,
    ProductForm
  },
  data() {
    return {
      products: [],
      searchKeyword: '',
      selectedCategory: '',
      selectedBrands: '',
      selectedStatus: '',
      currentPage: 1,
      itemsPerPage: 10,
      showProductForm: false,
      editingProduct: null
    }
  },
  created() {
    this.products = productsData;
  },

  // Khai báo computed để tự động lọc
  computed: {
    categories() {
      return [...new Set(this.products.map(p => p.category))];
    },
    // Tạo danh sách hãng và trạng thái để truyền xuống các dropdown bộ lọc.
    brandsList() {
      return [...new Set(this.products.map(product => product.brand))];
    },
    statusList() {
      return [
        { value: 'active', label: 'Đang bán' },
        { value: 'inactive', label: 'Ngừng bán' }
      ];
    },
    // Kết hợp điều kiện danh mục và từ khóa để tạo danh sách hiển thị.
    filteredProducts() {
      const keyword = this.searchKeyword.trim().toLocaleLowerCase('vi');

      return this.products.filter(product => {
        const matchesCategory =
          !this.selectedCategory || product.category === this.selectedCategory;
        const matchesBrands =
          !this.selectedBrands || product.brand === this.selectedBrands;
        const matchesStatus =
          !this.selectedStatus || product.status === this.selectedStatus;
        const matchesKeyword =
          !keyword ||
          [product.name, product.category, product.brand]
            .some(value => value.toLocaleLowerCase('vi').includes(keyword));

        return matchesCategory && matchesBrands && matchesStatus && matchesKeyword;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredProducts.slice(start, start + this.itemsPerPage);
    }
  },
  methods: {
    searchProducts({ category, brands, status, keyword }) {
      this.selectedCategory = category;
      this.selectedBrands = brands;
      this.selectedStatus = status;
      this.searchKeyword = keyword;
      this.currentPage = 1;
    },
    resetFilters() {
      this.selectedCategory = '';
      this.selectedBrands = '';
      this.selectedStatus = '';
      this.searchKeyword = '';
      this.currentPage = 1;
    },
    // Mở form ở chế độ thêm mới.
    openAddForm() {
      this.editingProduct = null;
      this.showProductForm = true;
    },
    // Mở form với dữ liệu hiện tại của sản phẩm được chọn.
    openEditForm(product) {
      this.editingProduct = product;
      this.showProductForm = true;
    },
    // Lưu sản phẩm mới hoặc cập nhật sản phẩm theo ID.
    saveProduct(formData) {
      if (this.editingProduct) {
        this.products = this.products.map(product =>
          product.id === this.editingProduct.id
            ? { ...formData, id: product.id, createdAt: product.createdAt }
            : product
        );
      } else {
        const nextId = Math.max(0, ...this.products.map(product => product.id)) + 1;
        const now = new Date();
        const createdAt = [
          now.getFullYear(),
          String(now.getMonth() + 1).padStart(2, '0'),
          String(now.getDate()).padStart(2, '0')
        ].join('-');
        this.products = [{ ...formData, id: nextId, createdAt }, ...this.products];
      }

      this.closeProductForm();
    },
    closeProductForm() {
      this.showProductForm = false;
      this.editingProduct = null;
    },
    // Hỏi xác nhận trước khi xóa để tránh thao tác nhầm.
    deleteProduct(productId) {
      if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này không?')) return;

      this.products = this.products.filter(product => product.id !== productId);
      this.currentPage = Math.min(this.currentPage, Math.max(1, this.totalPages));
    }
  }
}
</script>
