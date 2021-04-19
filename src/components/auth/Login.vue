<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      :fullscreen="this.$store.state.sys.isMobile"
      hide-overlay
      persistent
      transition="dialog-bottom-transition"
      width="500"
    >
      <v-card>
        <v-toolbar dark :color="this.$store.state.sys.color">
          <v-toolbar-title>{{ currentTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="isClose">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <!-- <iframe src="http://login.imzdx.top/#/Login" width="100%" height="600"></iframe> -->
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="user.name"
                  :counter="10"
                  :rules="nameRules"
                  prepend-icon="mdi-account-circle"
                  label="用户名"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="user.password"
                  :counter="18"
                  :rules="passwordRules"
                  prepend-icon="mdi-key"
                  label="密码"
                  required
                  @keyup.enter="validate(1)"
                ></v-text-field>

                <v-checkbox
                  v-model="checkbox"
                  :rules="[(v) => !!v || '你需要同意用户协议']"
                  label="同意用户协议"
                  required
                ></v-checkbox>

                <v-btn
                  :disabled="!valid"
                  color="success"
                  class="mr-4"
                  @click="validate(1)"
                  :loading="loading"
                >
                  登录
                </v-btn>

                <v-btn color="error" class="mr-4" @click="reset"> 重置 </v-btn>

                <v-btn color="warning" @click="step++"> 忘记密码 </v-btn>
              </v-form>
            </v-card-text>
          </v-window-item>
          <v-window-item :value="2">
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="user.name"
                  :counter="10"
                  :rules="nameRules"
                  prepend-icon="mdi-account-circle"
                  label="用户名"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="user.email"
                  :counter="20"
                  :rules="emailRules"
                  prepend-icon="mdi-email"
                  label="email"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="user.phone"
                  :counter="14"
                  :rules="phoneRules"
                  prepend-icon="mdi-cellphone"
                  label="手机"
                  required
                ></v-text-field>
                <v-checkbox
                  v-model="checkbox"
                  :rules="[
                    (v) => !!v || '这个账号不是你的为什么要改别人的密码嘞',
                  ]"
                  label="我确定这个账号是我的"
                  required
                ></v-checkbox>
                <v-text-field
                  v-model="user.password"
                  :counter="18"
                  :rules="passwordRules"
                  prepend-icon="mdi-key"
                  label="新密码"
                  required
                ></v-text-field>
                <v-btn
                  :disabled="!valid"
                  color="success"
                  class="mr-4"
                  @click="validate(2)"
                  :loading="loading"
                >
                  重置密码
                </v-btn>

                <v-btn color="error" class="mr-4" @click="reset">
                  重新输入
                </v-btn>

                <v-btn color="warning" @click="step--"> 我没有忘记密码 </v-btn>
              </v-form>
            </v-card-text>
          </v-window-item>
        </v-window>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar">
      {{ message }}
    </v-snackbar>
  </v-row>
</template>

<script>
export default {
  name: "Login",
  props: ["dialog"],
  data: () => ({
    step: 1,
    valid: true,
    user: {
      name: "",
      password: "",
      phone: "",
      email: "",
    },

    nameRules: [
      (v) => !!v || "用户名不能为空",
      (v) => (v && v.length <= 10) || "用户名长度需要小于10",
    ],

    passwordRules: [
      (v) => !!v || "密码不能为空",
      (v) => (v && v.length >= 6) || "密码长度需要大于等于6",
    ],
    phoneRules: [
      (v) => !!v || "电话不能为空",
      (v) => (v && v.length <= 14) || "电话长度需要小于等于14",
    ],
    emailRules: [
      (v) => !!v || "邮箱不能为空",
      (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "这不是一个邮箱哦！";
      },
    ],
    checkbox: true,
    loading: false,
    message: "",
    snackbar: false,
  }),
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "登录";
        case 2:
          return "修改密码--输入正确信息即可修改密码";
        default:
          return "BUG...";
      }
    },
  },
  methods: {
    isClose() {
      this.$store.commit("dialog", "Login");
    },
    validate(step) {
      //登录按钮检查
      this.$refs.form.validate();
      switch (step) {
        case 1:
          this.login_submit();
          break;
        case 2:
          this.resetpassword_submit();
          break;
        default:
          break;
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
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

    login_submit() {
      this.loading = true;
      let data = new FormData();
      data.append("uname", this.user.name);
      data.append("password", this.user.password);
      this.$axios
        .post("/user/login", data)
        .then((response) => {
          let that = this;
          this.loading = false;
          if (response.data.code == 200) {
            this.snackbar = true;
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
            //console.log(document.cookie);
            //that.setCookie("JSESSIONID",that.getCookie("JSESSIONID"),600)
            this.message = "登陆成功！";
            that.$store.commit("islogin");
            if (user.type == 1) {
              that.addAdminRouter();
            }
            that.$store.commit("dialog", "Login");
          } else if (response.data.code == 201) {
            this.snackbar = true;
            this.message = "账号或密码错误，代码：" + response.data.code;
          } else {
            this.snackbar = true;
            this.message = "登陆失败，代码：" + response.data.code;
          }
        })
        .catch((failResponse) => {
          this.loading = false;
          this.snackbar = true;
          this.message = "登陆失败，请稍后重试。代码：" + failResponse;
        });
    },
    resetpassword_submit() {
      this.loading = true;
      let data = new FormData();
      data.append("uname", this.user.name);
      data.append("newpassword", this.user.password);
      data.append("email", this.user.email);
      data.append("phone", this.user.phone);
      this.$axios
        .post("/user/forgetpassword", data)
        .then((response) => {
          let that = this;
          this.loading = false;
          if (response.data.code == 200) {
            this.snackbar = true;

            this.message = "密码修改成功！";
            that.step--;
          } else if (response.data.code == 201) {
            this.snackbar = true;
            this.message = "查无此人，代码：" + response.data.code;
          } else if (response.data.code == 202) {
            this.snackbar = true;
            this.message =
              "密码不能与之前的密码相同，代码：" + response.data.code;
          } else if (response.data.code == 203) {
            this.snackbar = true;
            this.message = "用户信息验证失败，代码：" + response.data.code;
          } else if (response.data.code == 204) {
            this.snackbar = true;
            this.message = "系统异常，代码：" + response.data.code;
          } else {
            this.snackbar = true;
            this.message = "未知异常，代码：" + response.data.code;
          }
        })
        .catch((failResponse) => {
          this.loading = false;
          this.snackbar = true;
          this.message =
            "修改失败，网络异常，请稍后重试。代码：" + failResponse;
        });
    },
    addAdminRouter() {
      this.$router.addRoute({
        path: "/admin/dashboard",
        name: "Dashboard",
        component: () => import("../../views/admin/Dashboard.vue"),
      });
      this.$router.addRoute({
        path: "/admin/order",
        name: "Order",
        component: () => import("../../views/admin/Order.vue"),
      });
      this.$router.addRoute({
        path: "/admin/activity",
        name: "Activity",
        component: () => import("../../views/admin/Activity.vue"),
      });
      this.$router.addRoute({
        path: "/admin/user",
        name: "User",
        component: () => import("../../views/admin/User.vue"),
      });
      this.$router.addRoute({
        path: "/admin/goods",
        name: "Goods",
        component: () => import("../../views/admin/Goods.vue"),
      });
    },
  },
};
</script>