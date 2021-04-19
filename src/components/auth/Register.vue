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
          <v-toolbar-title>注册</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="isClose">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <!-- <iframe src="http://login.imzdx.top/#/Login" width="100%" height="600"></iframe> -->
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
              type="password"
              prepend-icon="mdi-key"
              label="密码"
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
            <!-- 生日：<input type="date" name="birthday" v-model="user.birthday" /> -->
            <v-dialog
              ref="dialog"
              v-model="modal"
              :return-value.sync="user.birthday"
              
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="user.birthday"
                  label="生日"
                  prepend-icon="mdi-cake"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="user.birthday" scrollable locale="zh-cn">
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal = false">
                  取消
                </v-btn>
                <v-btn text color="primary" @click="$refs.dialog.save(user.birthday)">
                  确定
                </v-btn>
              </v-date-picker>
            </v-dialog>

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
              @click="validate"
              :loading="loading"
            >
              注册
            </v-btn>

            <v-btn color="error" class="mr-4" @click="reset"> 重置 </v-btn>

            <!-- <v-btn color="warning" @click="resetValidation"> 忘记密码 </v-btn> -->
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar">
      {{ message }}
    </v-snackbar>
  </v-row>
</template>

<script>
export default {
  name: "Register",
  props: ["dialog"],
  data: () => ({
    modal:false,
    user: {
      name: "",
      password: "",
      email: "",
      phone: "",
      birthday: "2021-04-30",
    },
    valid: true,

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
  methods: {
    isClose() {
      this.$store.commit("dialog", "Register");
    },
    validate() {
      //注册按钮检查
      this.$refs.form.validate();
      this.submit();
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

    submit() {
      this.loading = true;
      let data = new FormData();
      data.append("uname", this.user.name);
      data.append("password", this.user.password);
      data.append("email", this.user.email);
      data.append("phone", this.user.phone);
      data.append("birthday", this.user.birthday);
      console.log(data);
      this.$axios
        .post("/user/register", data)
        .then((response) => {
          let that = this;
          that.loading = false;
          if (response.data.code == 200) {
            that.message = response.data.meg + ",请登录";
            that.snackbar = true;
            that.$store.commit("dialog", "Register");
            that.$store.commit("dialog", "Login");
          } else if (response.data.code == 201) {
            that.snackbar = true;
            that.message = "账户名重复，请更改，代码：" + response.data.code;
          } else {
            that.snackbar = true;
            that.message = "注册失败，代码：" + response.data.code;
          }
        })
        .catch((failResponse) => {
          this.loading = false;
          this.snackbar = true;
          this.message = "注册失败，网络异常请稍后重试。代码：" + failResponse;
        });
    },
  },
};
</script>