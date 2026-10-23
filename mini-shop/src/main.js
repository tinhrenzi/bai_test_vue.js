import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "devextreme/dist/css/dx.material.blue.light.compact.css";
import "./style.css";

const THEME_KEY = "mini-shop-theme";
const initialTheme = localStorage.getItem(THEME_KEY) || "light";
document.documentElement.dataset.theme = initialTheme;

const app = createApp(App);

app.use(store);
app.use(router);
app.mount("#app");
