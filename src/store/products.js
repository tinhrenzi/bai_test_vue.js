import productsData from '../view/products/data/products.json'
const emptyProduct = () => ({
  id: '',
  name: '',
  category: '',
  brand: '',
  price: 0,
  stock: 0,
  status: 'active'
})


export default {
  namespaced: true,
  state: {
    product: emptyProduct(),
    _version: 0
  },

  getters: {
    products(state) {
      state._version

      let tmpProducts = []
      tmpProducts = JSON.parse(localStorage.getItem("xuantinh_products") || "[]")
      if (tmpProducts.length == 0) {
        tmpProducts = productsData
      }
      return tmpProducts
    },
    productsCount: (state, getters) => getters.products.length,
  },

  mutations: {
    Set(state, { key, value }) {
      state[key] = value
    },

    resetNewProductDraft(state) {
      state.product = emptyProduct();
    },
    // 

  },

  actions: {
    loadProductById(store, id) {
      const product = store.getters.products.find(
        item => String(item.id) === String(id)
      )

      if (!product) return false

      store.commit('Set', {
        key: 'product',
        value: { ...product }
      })

      return true
    },

    addProduct(store, product) {
      try {
        let tmpProducts = store.getters.products
        tmpProducts.push(product)
        localStorage.setItem("xuantinh_products", JSON.stringify(tmpProducts)) // chuyển chuỗi json
        store.commit('Set', { key: '_version', value: store.state._version + 1 })
        return true
      } catch (error) {
        return false
      }
    },

    // 
    updateProduct(store, product) {
      try {
        const tmpProducts = [...store.getters.products]
        const index = tmpProducts.findIndex(
          item => String(item.id) === String(product.id)
        )

        if (index === -1) {
          return false
        }

        const editHistory = tmpProducts[index]
        const newProduct = product

        const changes = {}
        Object.keys(newProduct).forEach(key => {
          changes[key] = {
            oldVal: editHistory[key],
            newVal: newProduct[key]
          }
        })

        if (Object.keys(changes).length > 0) {
          store.dispatch('LichSu/addHistory', {
            productId: newProduct.id,
            productName: newProduct.name || editHistory.name,
            action: 'UPDATE',
            time: new Date().toLocaleString('vi-VN'),
            changes
          }, { root: true })
        }

        tmpProducts[index] = product
        localStorage.setItem("xuantinh_products", JSON.stringify(tmpProducts))
        store.commit('Set', { key: '_version', value: store.state._version + 1 })
        return true

      } catch (error) {
        return false
      }
    },

    //
    deleteProduct(store, productId) {
      const updatedProducts = store.getters.products.filter(
        product => String(product.id) != String(productId)
      )

      localStorage.setItem('xuantinh_products', JSON.stringify(updatedProducts))
      store.commit('Set', { key: '_version', value: store.state._version + 1 })

      return true
    }
    // 

  }
}
