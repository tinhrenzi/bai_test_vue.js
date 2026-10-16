import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import App from './App.vue'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import router from './router/router.js'
import vuex from "./vuex";
import { createStore } from "vuex";
const store = createStore(vuex);
import 'devextreme/dist/css/dx.light.css'

// Gắn Vue Router để điều hướng giữa danh sách và trang form riêng.
createApp(App).use(router).use(store).mount('#app')
