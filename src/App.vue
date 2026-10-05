<template>
  <div class="container py-4">
    <ProductFilter
      :categories="categories"
      @search="searchProducts"
      @reset="resetFilters"
    />
    <h2 class="mb-4 fw-bold">Quản lý sản phẩm</h2>

    <div v-if="filteredProducts.length" class="d-none d-lg-block">
      <ProductTable :products="filteredProducts" />
    </div>

    <div v-if="filteredProducts.length" class="d-block d-lg-none">
      <ProductCard v-for="item in filteredProducts" :key="item.id" :product="item" />
    </div>
    <p v-else class="alert alert-info">Không tìm thấy sản phẩm phù hợp.</p>
  </div>
  <Pagenation />
</template>

<script>
import productsData from './data/products.json'
import ProductTable from './components/ProductTable.vue'
import ProductCard from './components/ProductCard.vue'
import ProductFilter from './components/ProductFilter.vue';
import Pagenation from './components/Pagenation.vue';
export default {
  name: 'App',
  components: {
    ProductTable,
    ProductCard,
    ProductFilter,
    Pagenation
  },
  data() {
    return {
      products: [],
      searchKeyword: '',
      selectedCategory: '',
      currentPage: 1,
      itemsPerPage: 10
    }
  },
  created() {
    this.products = productsData;
  },

  // khai báo computed để tự động lọc
  computed: {
    categories() {
      return [...new Set(this.products.map(p => p.category))];
    },
    // Kết hợp điều kiện danh mục và từ khóa để tạo danh sách hiển thị.
    filteredProducts() {
      const keyword = this.searchKeyword.trim().toLocaleLowerCase('vi');

      return this.products.filter(product => {
        const matchesCategory =
          !this.selectedCategory || product.category === this.selectedCategory;
        const matchesKeyword =
          !keyword ||
          [product.name, product.category, product.brand]
            .some(value => value.toLocaleLowerCase('vi').includes(keyword));

        return matchesCategory && matchesKeyword;
      });
    }
  },
  methods: {
    searchProducts({ category, keyword }) {
      this.selectedCategory = category;
      this.searchKeyword = keyword;
      this.currentPage = 1;
    },
    resetFilters() {
      this.selectedCategory = '';
      this.searchKeyword = '';
      this.currentPage = 1;
    }
  }
}
</script>
