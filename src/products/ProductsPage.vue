<template>
  <section>
    <h1>Quản lý sản phẩm</h1>
    <p>{{ productsCount }} sản phẩm</p>
    <button type="button" @click="$router.push({ name: 'product-create' })">Them san pham</button>

    <ProductFilter :categories="categories" :brands-list="brandsList" :status-list="statusList" :sort-by="sortBy"
      @search="applyFilters" @reset="resetFilters" @sort-price="togglePriceSort" @sort-date="toggleDateSort" />

    <p v-if="products.length && !filteredProducts.length">Không tìm thấy sản phẩm phù hợp.</p>
    <div v-else-if="filteredProducts.length" class="d-none d-lg-block">
      <ProductTable :products="paginationProduct" @edit="editProduct" @delete="deleteProduct" />
    </div>

    <div v-if="filteredProducts.length" class="d-block d-lg-none">
      <ProductCard v-for="product in paginationProduct" :key="product.id" :product="product" @edit="editProduct"
        @delete="deleteProduct" />
    </div>

    <p v-if="!products.length">Chưa có sản phẩm.</p>
    <Pagination v-if="totalPage > 1" :current-page="currentPage" :total-pages="totalPage"
      @page-changed="currentPage = $event" />
  </section>

</template>

<script>
import ProductTable from './components/ProductTable.vue'
import ProductCard from './components/ProductCard.vue'
import ProductFilter from './components/ProductFilter.vue'
import Pagination from './components/common/Pagination.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ProductsPage',
  components: {
    ProductTable,
    ProductCard,
    ProductFilter,
    Pagination
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
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
    ...mapState(['products']),
    ...mapGetters(['productsCount']),
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

    addProducts() {
      this.$store.commit('addProduct', {
        ...this.form,
        id: Math.max(0, ...this.$store.state.product.map(item => item.id)) + 1,
        createdAt: new Date().toISOString().slice(0, 10)
      });
      this.$router.push({ name: 'products' });
    },

    editProduct(product) {
      this.$router.push({
        name: 'product-edit',
        params: { id: product.id }
      })
    },

    deleteProduct(productId) {
      if (!window.confirm('Ban co chac chan muon xoa?')) return
      this.$store.commit('removeProduct', productId);
    }
  }
}

</script>
