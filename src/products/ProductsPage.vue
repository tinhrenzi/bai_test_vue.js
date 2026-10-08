<template>
  <section>
    <h1>Quản lý sản phẩm</h1>
    <p>{{ productsCount }} sản phẩm</p>
    <button type="button" @click="$router.push({ name: 'product-create' })">Them san pham</button>

    <div v-if="products.length" class="d-none d-lg-block">
      <ProductTable :products="products" @edit="editProduct" @delete="deleteProduct" />
    </div>

    <div v-if="products.length" class="d-block d-lg-none">
      <ProductCard v-for="product in products" :key="product.id" :product="product" @edit="editProduct"
        @delete="deleteProduct" />
    </div>

    <p v-else>Chưa có sản phẩm.</p>
  </section>

</template>

<script>
import ProductTable from './components/ProductTable.vue'
import ProductCard from './components/ProductCard.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ProductsPage',
  components: {
    ProductTable,
    ProductCard
  },
  computed: {
    ...mapState(['products']),
    ...mapGetters(['productsCount'])
  },

  methods: {
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
