import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "devextreme/dist/css/dx.material.blue.light.compact.css";
import "./style.css";

const app = createApp(App);

app.use(store);
app.use(router);
app.mount("#app");
