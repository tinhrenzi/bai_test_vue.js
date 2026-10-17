import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vuex from "./vuex";
import { createStore } from "vuex";
const store = createStore(vuex);
import 'devextreme/dist/css/dx.light.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

createApp(App).use(router).use(store).mount('#app')
