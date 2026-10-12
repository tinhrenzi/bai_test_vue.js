
const historyProduct = () => ({
  id: Date.now(),
  productId: '',
  productName: '',
  action: 'UPDATE',
  time: new Date().toString(),
  changes: {}
})

export default {
  namespaced: true,
  state: {
    _version: 0
  },
  getters: {
    histories(state) {
      state._version
      return JSON.parse(localStorage.getItem('xuantinh_history') || '[]')
    }
  },
  mutations: {
    Set(state, { key, value }) {
      state[key] = value
    }
  },

  actions: {
    addHistory(store, record) {
      const list = store.getters.histories
      list.unshift(record)
      localStorage.setItem('xuantinh_history', JSON.stringify(list))
      store.commit('Set', { key: '_version', value: store.state._version + 1 })
    }
  }
}