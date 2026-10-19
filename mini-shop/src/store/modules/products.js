import { layDanhSachSanPham, layChiTietSanPham } from '../../api/apiProduct'
export default {
    namespaced: true,
    state: () => ({
        items: [],
        total: 0,
        chiTiet: null,
        loading: false,
        error: null
    }),

    mutations: {
        SET_Loading(state, value) {
            state.loading = value
        },

        SET_Products(state, data) {
            state.items = data.products
            state.total = data.total
        },
        SET_Error(state, message) {
            state.error = message
        },
        SET_ChiTiet(state, data) {
            state.chiTiet = data
        }
    },

    actions: {
        async fetchProducts({ commit }, { skip = 0, limit = 12 }) {
            commit('SET_Loading', true),
                commit('SET_Error', null)

            try {
                const resp = await layDanhSachSanPham({ boQua: skip, soLuong: limit })
                commit('SET_Products', resp.data)
            } catch (error) {
                commit('SET_Error',
                    error.message || 'Không thể tải danh sách sản phẩm.')
            }
            finally {
                commit('SET_Loading', false)
            }
        },
        async fetchProductById({ commit }, id) {
            commit('SET_Loading', true)
            commit('SET_Error', null)
            try {
                const resp = await layChiTietSanPham(id);
                commit('SET_ChiTiet', resp.data)

                return data
            } catch (error) {
                console.log("🚀 ~ error:", error)
                commit('SET_Error', error.message || 'Không tải được danh sách sản phẩm')
                throw error
            }
            finally {
                commit('SET_Loading', false)
            }
        }

    }
}