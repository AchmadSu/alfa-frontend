import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import SuiVue from 'semantic-ui-vue';
// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/js/bootstrap.min'
import 'bootstrap/dist/js/bootstrap.min.js'
// import './assets/vendor/jquery/jquery.min.js'
// import './assets/vendor/bootstrap/js/bootstrap.bundle.min.js'
// import './assets/vendor/jquery-easing/jquery.easing.min.js'
import 'semantic-ui-css/semantic.min.css'
// import '../semantic/dist/semantic.min.css';
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8000/api/'
axios.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.headers['Accept'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = "*";
axios.defaults.headers.common['Access-Control-Expose-Headers'] = "Access-Token, Uid";
axios.defaults.headers['Access-Control-Allow-Methods'] = "DELETE, PUT, GET, POST";
axios.defaults.headers['Access-Control-Allow-Headers'] = "Content-type, Authorization, X-Requested-With";
axios.defaults.withCredentials = true;

import $ from 'jquery';
window.$ = window.jQuery = $;


const app = createApp(App)
app.use(router)
app.config.globalProperties.$isLoading = true
// app.use(SuiVue)
app.mount('#app')
