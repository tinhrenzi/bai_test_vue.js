import { createRouter, createWebHistory } from 'vue-router'
import ProductsPage from '../view/products/ProductsPage.vue'
import ProductForm from '../view/products/ProductForm.vue'
import HistoryForm from '../view/history/FormLichSu.vue'

// Dùng route riêng cho danh sách, thêm mới và sửa sản phẩm.
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'products',
      component: ProductsPage
    },
    {
      path: '/products/new',
      name: 'product-create',
      component: ProductForm
    },
    {
      path: '/products/:id/edit',
      name: 'product-edit',
      component: ProductForm
    },
    {
      path: '/history',
      name: 'product-history',
      component: HistoryForm
    }
  ]
})

export default router

