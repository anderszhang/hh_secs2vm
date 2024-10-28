import './assets/main.css'
import ArcoVue from '@arco-design/web-vue';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueExcelEditor from 'vue3-excel-editor'
import App from './App.vue'
import '@arco-design/web-vue/dist/arco.css';
import 'virtual:uno.css'

const app = createApp(App);
const pinia = createPinia()
app.use(pinia);
app.use(ArcoVue);
app.use(VueExcelEditor)
app.mount('#app');
