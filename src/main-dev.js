import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
// 树
import ZkTable from 'vue-table-with-tree-grid'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(VueQuillEditor /* { default global options } */)

Vue.component(ZkTable.name, ZkTable)

Vue.config.productionTip = false

// 基于拦截器配置进度条
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在request拦截器中展示进度条NProgress.start()

// 请求拦截
axios.interceptors.request.use(config => {
    // console.log(config)
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
// 在response拦截器中展示NProgress.done()
axios.interceptors.response.use(config => {
    NProgress.done()
    return config
})
Vue.prototype.$http = axios

Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    return `${y}/${m}/${d}`
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
