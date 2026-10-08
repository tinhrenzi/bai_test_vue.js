<template>
  <div>
    <ProductFilter :categories="categories" :brands-list="brandsList" :status-list="statusList" :sort-by="sortBy"
      @search="$emit('search', $event)" @reset="$emit('reset')" @sort-price="$emit('sort-price')"
      @sort-date="$emit('sort-date')" />

    <header class="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-4">
      <h1 class="h2 fw-bold mb-0">Quản lý sản phẩm</h1>
      <button class="btn btn-primary" type="button" @click="$emit('add')">
        Thêm sản phẩm
      </button>
    </header>

    <div v-if="totalProducts" class="d-none d-lg-block">
      <ProductTable :products="products" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)" />
    </div>

    <div v-if="totalProducts" class="d-block d-lg-none">
      <ProductCard v-for="product in products" :key="product.id" :product="product" @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)" />
    </div>
    <p v-if="!totalProducts" class="alert alert-info">Không tìm thấy sản phẩm phù hợp.</p>

    <Pagination v-if="totalPages > 1" :current-page="currentPage" :total-pages="totalPages"
      @page-changed="$emit('page-changed', $event)" />
  </div>
</template>

<script>
import ProductFilter from './components/ProductFilter.vue'
import ProductTable from './components/ProductTable.vue'
import ProductCard from './components/ProductCard.vue'
import Pagination from './components/common/Pagination.vue'

export default {
  name: 'ProductsPage',
  components: {
    ProductFilter,
    ProductTable,
    ProductCard,
    Pagination
  },
  props: {
    products: { type: Array, required: true },
    totalProducts: { type: Number, required: true },
    categories: { type: Array, required: true },
    brandsList: { type: Array, required: true },
    statusList: { type: Array, required: true },
    sortBy: { type: String, required: true },
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true }
  },
  emits: ['search', 'reset', 'sort-price', 'sort-date', 'add', 'edit', 'delete', 'page-changed']
}
</script>
