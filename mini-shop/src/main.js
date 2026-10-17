import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

import 'devextreme/dist/css/dx.light.css';
import './style.css';

const app = createApp(App);

app.use(store);
app.mount('#app');