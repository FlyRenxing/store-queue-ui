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
              <v-form ref="edit" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="user.uname"
                  :counter="10"
                  :rules="nameRules"
                  prepend-icon="mdi-account-circle"
                  label="用户名"
                  required
                  disabled
                ></v-text-field>

                <!-- <v-text-field
              v-model="user.password"
              :counter="18"
              :rules="passwordRules"
              type="password"
              prepend-icon="mdi-key"
              label="密码"
              required
            ></v-text-field> -->

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
                  <v-date-picker
                    v-model="user.birthday"
                    scrollable
                    locale="zh-cn"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal = false">
                      取消
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog.save(user.birthday)"
                    >
                      确定
                    </v-btn>
                  </v-date-picker>
                </v-dialog>

                <!-- <v-checkbox
              v-model="checkbox"
              :rules="[(v) => !!v || '你需要同意用户协议']"
              label="同意用户协议"
              required
            ></v-checkbox> -->
                <v-card-actions>
                  <v-btn
                    :disabled="!valid"
                    color="success"
                    class="mr-4"
                    @click="validate(1)"
                    :loading="loading"
                  >
                    修改
                  </v-btn>

                  <v-spacer></v-spacer>
                  <v-btn
                    color="fail"
                    class="mr-4"
                    @click="step++"
                    :loading="loading"
                  >
                    修改密码
                  </v-btn>
                </v-card-actions>
                <!-- <v-btn color="error" class="mr-4" @click="reset"> 重置 </v-btn> -->

                <!-- <v-btn color="warning" @click="resetValidation"> 忘记密码 </v-btn> -->
              </v-form>
            </v-card-text>
          </v-window-item>
          <v-window-item :value="2">
            <v-card-text>
              <v-form ref="resetpassword">
                <v-text-field
                  v-model="resetpassword.oldpassword"
                  :counter="18"
                  :rules="passwordRules"
                  type="password"
                  prepend-icon="mdi-key"
                  label="旧密码"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="resetpassword.newpassword"
                  :counter="18"
                  :rules="newpasswordRules"
                  type="password"
                  prepend-icon="mdi-key"
                  label="新密码"
                  required
                ></v-text-field>
              </v-form>
              <v-card-actions>
                <v-btn
                  :disabled="!valid"
                  color="success"
                  class="mr-4"
                  @click="validate(2)"
                  :loading="loading"
                >
                  修改
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="fail" class="mr-4" @click="step--">
                  修改信息
                </v-btn>
              </v-card-actions>
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
  name: "Edit",
  props: ["dialog", "user"],
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "修改资料";
        case 2:
          return "修改密码";
        default:
          return "BUG...";
      }
    },
  },
  data: () => ({
    step: 1,
    modal: false,

    valid: true,
    resetpassword: { oldpassword: "", newpassword: "" },
    nameRules: [
      (v) => !!v || "用户名不能为空",
      (v) => (v && v.length <= 10) || "用户名长度需要小于10",
    ],

    passwordRules: [
      (v) => !!v || "密码不能为空",
      (v) => (v && v.length >= 6) || "密码长度需要大于等于6",
    ],
    newpasswordRules: [
      (v) => !!v || "新密码不能为空",
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
  mounted() {},
  methods: {
    isClose() {
      this.$store.commit("dialog", "Useredit");
    },
    validate(step) {
      //注册按钮检查

      switch (step) {
        case 1:
          this.$refs.edit.validate();
          this.edit_submit();
          break;
        case 2:
          this.$refs.resetpassword.validate();
          this.resetpassword_submit();
          break;
        default:
          break;
      }
    },
    reset() {
      this.$refs.edit.reset();
    },
    resetValidation() {
      this.$refs.edit.resetValidation();
      this.$refs.resetpassword.resetValidation();
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

    edit_submit() {
      this.loading = true;
      let data = new FormData();
      data.append("email", this.user.email);
      data.append("phone", this.user.phone);
      data.append("birthday", this.user.birthday);
      this.$axios
        .post("/user/modifyuserinfo", data)
        .then((response) => {
          let that = this;
          that.loading = false;
          if (response.data.code == 200) {
            that.message = response.data.meg;
            that.snackbar = true;
            that.relogin();
            that.$store.commit("dialog","Useredit")
          } else {
            that.snackbar = true;
            that.message = response.data.meg + "，代码：" + response.data.code;
          }
        })
        .catch((failResponse) => {
          this.loading = false;
          this.snackbar = true;
          this.message = "注册失败，网络异常请稍后重试。代码：" + failResponse;
        });
    },
    resetpassword_submit() {
      this.loading = true;
      let data = new FormData();
      data.append("old_pwd", this.$md5(this.resetpassword.oldpassword));
      data.append("new_pwd", this.$md5(this.resetpassword.newpassword));
      this.$axios
        .post("/user/editpassword", data)
        .then((response) => {
          let that = this;
          that.loading = false;
          if (response.data.code == 200) {
            that.message = response.data.meg;
            that.snackbar = true;
            that.relogin();
            that.$store.commit("dialog","Useredit")
          } else {
            that.snackbar = true;
            that.message = response.data.meg + "，代码：" + response.data.code;
          }
        })
        .catch((failResponse) => {
          this.loading = false;
          this.snackbar = true;
          this.message = "注册失败，网络异常请稍后重试。代码：" + failResponse;
        });
    },
    relogin() {
      this.$axios
          .get("/user/profile")
          .then((response) => {
            let that = this;
            if (response.data.code == 200) {
              let user = {
                birthday: response.data.data.birthday,
                email: response.data.data.email,
                logo: response.data.data.logo,
                password: this.$md5(response.data.data.password),
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
  },
};
</script>