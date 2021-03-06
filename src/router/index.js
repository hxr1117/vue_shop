import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'

// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'

// import GoodsList from '../components/goods/List.vue'
// import Add from '../components/goods/Add.vue'

// import Order from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'

const Login = () => import(/* webpackChunkName: "login-welcome-home" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login-welcome-home" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login-welcome-home" */ '../components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "user-rights-roles" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "user-rights-roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "user-rights-roles" */ '../components/power/Roles.vue')

const Cate = () => import(/* webpackChunkName: "cate-params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "cate-params" */ '../components/goods/Params.vue')

const GoodsList = () => import(/* webpackChunkName: "list-add" */ '../components/goods/Params.vue')
const Add = () => import(/* webpackChunkName: "list-add" */ '../components/goods/Add.vue')

const Order = () => import(/* webpackChunkName: "order-report" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "order-report" */ '../components/report/Report.vue')

Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/users', component: Users },
            { path: '/rights', component: Rights },
            { path: '/roles', component: Roles },
            { path: '/categories', component: Cate },
            { path: '/params', component: Params },
            { path: '/goods', component: GoodsList },
            { path: '/goods/add', component: Add },
            { path: '/orders', component: Order },
            { path: '/reports', component: Report }
        ]
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router
