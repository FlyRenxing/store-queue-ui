<template>
  <v-app style="overflow: hidden">
    <v-navigation-drawer
      app
      permanent
      :expand-on-hover="$store.state.sys.menubutton"
      v-if="!$store.state.sys.isMobile"
    >
      <v-list>
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img
              v-if="$store.state.user.logo != null"
              :src="$store.state.user.logo"
            ></v-img>
            <v-avatar
              v-if="$store.state.user.logo == null"
              :color="$store.state.sys.color"
            >
              <span
                class="white--text headline"
                v-if="$store.state.user.logo == null"
                >{{ $store.state.user.uname.slice(0, 2) }}</span
              >
            </v-avatar>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link to="/my">
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ $store.state.user.uname }}
            </v-list-item-title>
            <v-list-item-subtitle>{{
              $store.state.user.email
            }}</v-list-item-subtitle>
            <!-- <v-list-item-subtitle>上次登录时间：<br>{{ $store.state.user.lastusetime }}</v-list-item-subtitle> -->
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item-group v-model="$store.state.sys.navs.value">
          <v-list-item
            link
            :color="color"
            v-for="nav in $store.state.sys.navs.navs"
            :key="nav.name"
            :to="nav.url"
          >
            <v-list-item-icon>
              <v-icon>{{ nav.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ nav.name }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>

        <v-list-item-group v-if="$store.state.user.type == 1">
          <p></p>
          <v-divider inset></v-divider>

          <v-list-item
            link
            :color="color"
            v-for="nav in $store.state.sys.navs.navs_admin"
            :key="nav.name"
            :to="nav.url"
          >
            <v-list-item-icon>
              <v-icon>{{ nav.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ nav.name }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      :color="color"
      dense
      dark
    >
      <v-app-bar-nav-icon
        @click="menuSwitch()"
        v-if="!$store.state.sys.isMobile"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>{{ $store.state.sys.name + " - " + $route.meta.title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon @click="darkMode">mdi-theme-light-dark</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="n in $store.state.sys.barmenu"
            :key="n.name"
            @click="dialog(n.url)"
          >
            <v-list-item-title>{{ n.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <template v-slot:extension v-if="this.$route.path == '/all'">
        <v-tabs v-model="$store.state.goods.tab" align-with-title center-active>
          <v-tabs-slider color="yellow"></v-tabs-slider>

          <v-tab
            v-for="item in $store.state.goods.category"
            :key="item.id"
            exact
            :to="{ path: 'all', query: { category: item.id } }"
          >
            {{ item.name }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <!-- 根据应用组件来调整你的内容 -->
    <v-main>
      <!-- 给应用提供合适的间距 -->
      <v-container fluid>
        <!-- 如果使用 vue-router -->
        <router-view @login="dialog('Login')"></router-view>
      </v-container>
    </v-main>

    <v-footer app :color="color" v-if="$store.state.sys.isMobile">
      <v-bottom-navigation
        v-model="$store.state.sys.navs.value"
        :background-color="color"
        dark
        shift
      >
        <v-btn
          v-for="nav in $store.state.sys.navs.navs"
          :key="nav.name"
          :to="nav.url"
        >
          <span>{{ nav.name }}</span>

          <v-icon>{{ nav.icon }}</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-footer>
    <Login :dialog="$store.state.sys.dialog.login" />
    <Register :dialog="$store.state.sys.dialog.register" />
    <Edit
        :dialog="$store.state.sys.dialog.useredit"
        :user="$store.state.user"
    />
    <About :dialog="$store.state.sys.dialog.about" />
    <ViewG :dialog="$store.state.sys.dialog.viewgood" />

  </v-app>
</template>

<script>
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Edit from "@/components/auth/Edit";
import About from "./components/About";
import ViewG from "./views/ViewG";

export default {
  name: "App",
  components: { Login, Register, About, ViewG,Edit },
  mounted() {
    this.$store.commit("isMobile", this.isMobile());
    this.getCategory();
    this.getSeckillByAll();
    this.islogin();
  },
  computed: {
    color() {
      switch (this.$store.state.sys.navs.value) {
        case 0:
          return "blue lighten-2";
        case 1:
          return "deep-purple lighten-2";
        case 2:
          return "deep-orange lighten-2";
        case 3:
          return "indigo lighten-2";
        default:
          return "blue lighten-2";
      }
    },
  },
  watch: {
    color: function (val) {
      this.$store.commit("setColor", val);
    },
  },
  data: () => ({}),
  methods: {
    //设置Cookie
    setCookie(name, value, seconds) {
      seconds = seconds || 0; //seconds有值就直接赋值，没有为0，这个根php不一样。
      var expires = "";
      if (seconds != 0) {
        //设置cookie生存时间
        var date = new Date();
        date.setTime(date.getTime() + seconds * 1000);
        expires = "; expires=" + date.toGMTString();
      }
      //上线部署时的跨域域名
      //document.cookie = name + "=" + escape(value) + expires + "; domain=.imzdx.top"; //转码并赋值
      document.cookie = name + "=" + escape(value) + expires + ";"; //转码并赋值
    },
    getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },
    isMobile() {
      if (document.body.clientWidth < document.body.clientHeight) {
        return true;
      }
      return false;
    },
    menuSwitch() {
      let that = this;
      that.$store.state.sys.menubutton = !that.$store.state.sys.menubutton;
      setTimeout(function () {
        that.$store.state.sys.menubutton = !that.$store.state.sys.menubutton;
      }, 6000);
    },
    dialog(val) {
      if (val == "Logout") {
        this.$axios
          .get("/user/logout")
          .then((response) => {
            if (response.data.code == 200) {
              alert("退出成功");
              top.location.reload();
            }
          })
          .catch((failResponse) => {
            console.log(failResponse);
          });
      }
      if (val == "Admin") {
        window.open("/admin");
      }
      this.$store.commit("dialog", val);
    },
    islogin() {
      this.$axios
        .get("/user/profile")
        .then((response) => {
          let that = this;
          if (response.data.code == 200) {
            let user = {
              birthday: response.data.data.birthday,
              email: response.data.data.email,
              logo: response.data.data.logo,
              password: response.data.data.password,
              phone: response.data.data.phone,
              regtime: response.data.data.regtime,
              uid: response.data.data.uid,
              uname: response.data.data.uname,
              type: response.data.data.type,
            };
            that.$store.commit("updateUser", user);
            that.$store.commit("islogin");
            if (user.type == 1) {
              that.addAdminRouter();
            }
          }
        })
        .catch((failResponse) => {
          console.log(failResponse);
        });
    },
    getCategory() {
      this.$axios
        .get("/goods/category")
        .then((response) => {
          let that = this;
          if (response.data.code == 200) {
            let category = response.data.data;
            that.$store.commit("updateCategory", category);
          }
        })
        .catch((failResponse) => {
          console.log(failResponse);
        });
    },
    getSeckillByAll() {
      this.$axios
          .get("/seckill")
          .then((response) => {
            let that = this;
            if (response.data.code == 200) {
              that.loading = false;
              for (let i = 0; i < response.data.data.length; i++) {
                response.data.data[i].data = JSON.parse(response.data.data[i].data)
              }
              let seckill = response.data.data;
              that.$store.commit("updateSeckillList",seckill);
              that.$store.commit("updateSeckillMap",that.seckillToMap(seckill));
            }
          })
          .catch((failResponse) => {
            console.log(failResponse);
          });
    },
    addAdminRouter() {
      this.$router.addRoute({
        path: "/admin/dashboard",
        name: "Dashboard",
        meta: {title: "后台 - 仪表盘"},
        component: () => import("./views/admin/Dashboard.vue"),
      });
      this.$router.addRoute({
        path: "/admin/order",
        name: "Order",
        meta: {title: "后台 - 订单管理"},
        component: () => import("./views/admin/Order.vue"),
      });
      this.$router.addRoute({
        path: "/admin/activity",
        name: "Activity",
        meta: {title: "后台 - 营销活动"},
        component: () => import("./views/admin/Activity.vue"),
      });
      this.$router.addRoute({
        path: "/admin/user",
        name: "User",
        meta: {title: "后台 - 用户管理"},
        component: () => import("./views/admin/User.vue"),
      });
      this.$router.addRoute({
        path: "/admin/goods",
        name: "Goods",
        meta: {title: "后台 - 商品管理"},
        component: () => import("./views/admin/Goods.vue"),
      });
    },
    seckillToMap(obj) {
      let strMap = new Map();
      for (let k of Object.keys(obj)) {
        strMap.set(obj[k].gid, obj[k]);
      }
      return strMap;
    },
    darkMode: function () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
};
</script>
