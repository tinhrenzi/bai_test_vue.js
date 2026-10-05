import { createRouter, createWebHistory } from 'vue-router'
import ProductsPage from './pages/ProductsPage.vue'
import ProductForm from './components/ProductForm.vue'

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
    }
  ]
})

export default router
