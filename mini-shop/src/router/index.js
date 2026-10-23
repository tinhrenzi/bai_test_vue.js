import store from "../store";
import TrangChu from "../views/TrangChu.vue";
import DangNhap from "../views/DangNhap.vue";
import DangKy from "../views/DangKy.vue";
import GioHang from "../views/GioHang.vue";
import SanPhamChiTiet from "../views/SanPhamChiTiet.vue";
import NotFoundView from "../views/NotFoundView.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "TrangChu",
        component: TrangChu,
    },
    {
        path: "/products/:id",
        name: "SanPhamChiTiet",
        component: SanPhamChiTiet,
    },
    {
        path: "/cart",
        name: "GioHang",
        component: GioHang,
    },
    {
        path: "/login",
        name: "DangNhap",
        component: DangNhap,
    },
    {
        path: "/register",
        name: "DangKy",
        component: DangKy,
    },
    {
        path: "/admin/products",
        name: "AdminProducts",
        component: () => import("../views/admin/QuanLySanPham.vue"),
        meta: { yeuCauDangNhap: true, yeuCauAdmin: true },
    },
    {
        path: "/admin/dashboard",
        name: "AdminDashboard",
        component: () => import("../views/admin/ThongKe.vue"),
        meta: { yeuCauDangNhap: true, yeuCauAdmin: true },
    },
    {
        path: "/:pathMatch(.*)*",
        name: "404NotFound",
        component: NotFoundView,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

let daKhoiPhucPhien = false;

router.beforeEach(async (to, from, next) => {
    if (!daKhoiPhucPhien && store.state.auth.token) {
        daKhoiPhucPhien = true;
        await store.dispatch("auth/khoiPhucPhienLamViec");
    }

    const daDangNhap = store.getters["auth/daDangNhap"];
    const laAdmin = store.getters["auth/laAdmin"];

    if (to.meta.yeuCauDangNhap && !daDangNhap) {
        return next({
            path: "/login",
            query: { redirect: to.fullPath },
        });
    }

    if (to.meta.yeuCauAdmin && !laAdmin) {
        return next("/");
    }

    if ((to.path === "/login" || to.path === "/register") && daDangNhap) {
        return next("/");
    }

    return next();
});

export default router;
