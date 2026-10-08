import { createStore } from 'vuex'
import productsData from '../products/data/products.json'
const store = createStore({
  state: {
    products: productsData
  },
  getters: {
    productsCount: state => state.products.length
  },
  mutations: {
    addProduct(state, product) {
      state.products.push(product);
    },
    updateProduct(state, updatedProduct) {
      const index = state.product.findIndex(
        product => product.id === this.updateProduct.id
      );
      if (index !== -1) {
        state.product.splice(index, 1, updatedProduct)
      }
    },
    remove(state, productId) {
      state.product = state.products.filters(
        product => product.id !== productId
      );
    }
  }
});

export default store