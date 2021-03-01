import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from './store'
import request from './request'
import vuetify from './plugins/vuetify'

import '../node_modules/material-design-icons-iconfont/dist/material-design-icons.css'


Vue.config.productionTip = false
Vue.prototype.$request = request
Vue.use(axios)
Vue.use(router)

axios.defaults.withCredentials = true;
axios.interceptors.request.use(config => {
    return config;
});

axios.interceptors.response.use(response => {
    return response;
});

new Vue({
    router,
    store,
    axios,
    request,
    vuetify,
    render: h => h(App)
}).$mount('#app')
