import { createApp } from 'vue';
import router from './router';
import 'remixicon/fonts/remixicon.css';
import './index.css';
import Toast  from 'vue-toastification'
import {options} from './notifications/toast.js'
import App from './App.vue';


createApp(App).use(router).use(Toast,options).mount('#app')
