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
    // 
    addProduct(state, product) {
      state.products.push(product);
    },
    // 
    updateProduct(state, updatedProduct) {
      const index = state.products.findIndex(
        product => product.id === updatedProduct.id
      );
      if (index !== -1) {
        state.products.splice(index, 1, updatedProduct)
      }
    },
    // 
    removeProduct(state, productId) {
      state.products = state.products.filter(
        product => product.id !== productId
      );
    }
  }
});

export default store