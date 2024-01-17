import './assets/main.less';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import eruda from "eruda";
import {env} from "@/utils/env";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');

if (env().VITE_APP_ERUDA === 'true') {
    eruda.init();
}