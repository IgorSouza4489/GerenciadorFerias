import "bootstrap/dist/css/bootstrap.css"
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/styles/form.css';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "bootstrap/dist/js/bootstrap.js"
const app = createApp(App)
app.use(Toast)
app.use(router)
app.mount('#app')
