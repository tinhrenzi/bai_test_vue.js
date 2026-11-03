import { createStore } from "vuex";
import products from "./modules/products";
import auth from "./modules/auth";
import cart from "./modules/cart";

export default createStore({
    state: () => ({
        theme: localStorage.getItem("mini-shop-theme") || "light",
    }),

    mutations: {
        SET_THEME(state, theme) {
            state.theme = theme;
        },
    },

    actions: {
        chuyenTheme({ commit, state }) {
            const themeMoi = state.theme === "dark" ? "light" : "dark";
            localStorage.setItem("mini-shop-theme", themeMoi);
            document.documentElement.dataset.theme = themeMoi;
            window.dispatchEvent(
                new CustomEvent("theme-change", { detail: themeMoi }),
            );
            commit("SET_THEME", themeMoi);
        },
    },

    modules: {
        products,
        auth,
        cart,
    },
});
