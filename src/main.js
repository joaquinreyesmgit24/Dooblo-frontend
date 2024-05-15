import { createApp } from 'vue';
import router from './router';
import 'remixicon/fonts/remixicon.css';
import './index.css';
import App from './App.vue';


createApp(App).use(router).mount('#app')
