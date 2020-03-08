import Vue from 'vue'
import App from './App'
//封装的https请求方法，进行全局的引入挂载
import http from "./utils/https.js";
//引入状态栏组件
import status from './components/status.vue';

//全局注册组件(将引入的status作为全局组件page-status来使用)
Vue.component('page-status',status);

Vue.config.productionTip = false
//在原型实例上，添加一个request方法（其实就是一个函数)
Vue.prototype.request=http;

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
