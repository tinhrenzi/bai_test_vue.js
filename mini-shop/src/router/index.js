import store from '../store';
import TrangChu from '../views/TrangChu.vue';
import DangNhap from '../views/DangNhap.vue';
import GioHang from '../views/GioHang.vue';
import SanPhamChiTiet from '../views/SanPhamChiTiet.vue';
import NotFoundView from '../views/NotFoundView.vue'
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'TrangChu',
        component: TrangChu
    },
    {
        path: '/products/:id',
        name: 'SanPhamChiTiet',
        component: SanPhamChiTiet
    },
    {
        path: '/cart',
        name: 'GioHang',
        component: GioHang
    },
    {
        path: '/login',
        name: 'DangNhap',
        component: DangNhap
    },
    {
        path: '/admin/products',
        name: 'AdminProducts',
        component: () => import('../views/admin/QuanLySanPham.vue'),
        meta: { yeuCauDangNhap: true }
    },
    {
        path: '/admin/dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/ThongKe.vue'),
        meta: { yeuCauDangNhap: true }
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404NotFound',
        component: NotFoundView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    if (store.state.auth.token && !store.state.auth.user) {
        await store.dispatch('auth/khoiPhucPhienLamViec');
    }

    const daDangNhap = store.getters['auth/daDangNhap'];

    if (to.meta.yeuCauDangNhap && !daDangNhap) {
        return next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
    }

    if (to.path === '/login' && daDangNhap) {
        return next('/')
    }

    return next();
})

export default router;