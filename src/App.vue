<template>
  <div class="container py-4">
    <h2 class="mb-4 fw-bold">Quản lý sản phẩm</h2>

    <div class="d-none d-md-block">
      <ProductTable :products="products" />
    </div>

    <div class="d-block d-md-none">
      <ProductCard 
        v-for="item in products" 
        :key="item.id" 
        :product="item" 
      />
    </div>
  </div>
</template>

<script>
import productsData from './data/products.json'
import ProductTable from './components/ProductTable.vue'
import ProductCard from './components/ProductCard.vue'

export default {
  name: 'App',
  components: {
    ProductTable,
    ProductCard
  },
  data() {
    return {
      products: []
    }
  },
  created() {
    this.products = productsData;
  }
}
</script>
