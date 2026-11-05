import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import dxToast from "devextreme/ui/toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "devextreme/dist/css/dx.material.blue.light.compact.css";
import "./style.css";

// Cấu hình vị trí và thời gian hiển thị mặc định cho toàn bộ thông báo (notify/toast)
dxToast.defaultOptions({
    options: {
        position: {
            at: "top center",
            my: "top center",
            offset: "0 24",
        },
        displayTime: 2500,
    },
});

const THEME_KEY = "mini-shop-theme";
const initialTheme = localStorage.getItem(THEME_KEY) || "light";
document.documentElement.dataset.theme = initialTheme;

const app = createApp(App);

app.use(store);
app.use(router);
app.mount("#app");
