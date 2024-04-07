import './assets/main.css'
import 'primevue/resources/themes/aura-light-green/theme.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
createApp(App).use(PrimeVue).component('PButton', Button).mount('#app')
