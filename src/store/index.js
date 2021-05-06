import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        sys: {
            color: "blue lighten-1",
            isMobile: false,
            name: "商城",
            logo: "",
            menubutton: true,
            barmenu: [
                {name: "登录", url: "Login"},
                {name: "注册", url: "Register"},
                {name: "关于", url: "About"},
            ],
            bottom_nav: {
                value: 0,
            },
            navs: {
                value: 0,
                navs: [
                    {name: "商城", icon: "mdi-shopping", url: "/index"},
                    {name: "商品分类", icon: "mdi-all-inclusive", url: "/all"},
                    {name: "我的", icon: "mdi-account-circle", url: "/my"},
                ],
                navs_admin: [
                    {name: "仪表盘", icon: "mdi-view-dashboard", url: {path: '/admin/dashboard'}},
                    {name: "订单管理", icon: "mdi-currency-usd ", url: {path: '/admin/order'}},
                    {name: "商品管理", icon: "mdi-dolly", url: {path: '/admin/goods'}},
                    {name: "营销活动", icon: "mdi-chart-areaspline", url: {path: '/admin/activity'}},
                    {name: "用户管理", icon: "mdi-book-account", url: {path: '/admin/user'}},
                ]
            },
            dialog: {login: false, register: false, about: false, useredit: false, viewgood: false},
            viewgood_id: 0,
        },
        user: {
            birthday: "未登录",
            email: "未登录",
            logo: "https://pan.imzdx.top/api/v3/file/get/30/nologin.jpeg?sign=XBVyfoSe9DmjEc5WrEkDvA4IIFbb5MtrQ1AKSOqrcWg%3D%3A0",
            password: "未登录",
            phone: "未登录",
            regtime: "未登录",
            uid: -1,
            uname: "未登录",
            type: 0,
        },
        goods: {
            tab: null,
            category: [
                {id: 0, name: "全部"}
            ],
        },
        seckill: {
            list: [],
            map: null,
        }

    },
    mutations: {
        updateUser(state, user) {
            state.user = user
        },
        updateCategory(state, categorys) {
            categorys.forEach(category => {
                state.goods.category.push({name: category.tyname, id: category.tyid})
            });
            //state.goods.category.push(category)
        },
        updateSeckillList(state, seckill) {
            state.seckill.list = seckill;
        },
        updateSeckillMap(state, map) {
            state.seckill.map = map;
        },
        setColor(state, color) {
            state.sys.color = color
        },
        isMobile(state, isMobile) {
            state.sys.isMobile = isMobile
        },
        islogin(state) {
            //删除登陆注册选项
            state.sys.barmenu.splice(0, 2)
            state.sys.barmenu.push({name: "退出", url: "Logout"},)
        },
        dialog(state, dialog) {
            switch (dialog) {
                case "Login":
                    state.sys.dialog.login = !state.sys.dialog.login
                    break;
                case "Register":
                    state.sys.dialog.register = !state.sys.dialog.register
                    break;
                case "About":
                    state.sys.dialog.about = !state.sys.dialog.about
                    break;
                case "Useredit":
                    state.sys.dialog.useredit = !state.sys.dialog.useredit
                    break;
                case "Viewgood":
                    state.sys.dialog.viewgood = !state.sys.dialog.viewgood
                    break;
                default:
                    break;
            }
        }
    },
    actions: {},
    modules: {}
})
