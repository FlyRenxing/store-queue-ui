<template>
  <div>
    <v-container>
      <v-card class="mx-auto" max-width="500" elevation="2" outlined shaped>
        <v-list-item three-line>
          <v-list-item-content>
            <div class="overline mb-4">我的</div>
            <v-list-item-title class="headline mb-1">
              {{ $store.state.user.uname }}
            </v-list-item-title>
            <v-list-item-subtitle>{{
                $store.state.user.email
              }}
            </v-list-item-subtitle>
            <v-list-item-subtitle
            >注册时间：{{ $store.state.user.regtime }}
            </v-list-item-subtitle
            >
          </v-list-item-content>

          <v-list-item-avatar tile size="62">
            <v-avatar
                :color="$store.state.sys.color"
                size="62"
                @click="changeUserLogo"
            >
              <img
                  v-if="$store.state.user.logo != null"
                  :alt="$store.state.user.uname"
                  :src="$store.state.user.logo"
              />
              <span
                  v-if="$store.state.user.logo == null"
                  class="white--text headline"
              >{{ $store.state.user.uname.slice(0, 2) }}</span
              >
            </v-avatar>
          </v-list-item-avatar
          >
        </v-list-item>

        <v-card-actions>
          <div id="nologin" v-if="$store.state.user.uid == -1">
            <v-btn
                outlined
                rounded
                text
                @click="$store.commit('dialog', 'Login')"
            >登录
            </v-btn>
            <v-btn
                outlined
                rounded
                text
                @click="$store.commit('dialog', 'Register')"
            >注册
            </v-btn>
          </div>
          <div id="islogin" v-if="$store.state.user.uid != -1">
            <v-btn
                outlined
                rounded
                text
                @click="$store.commit('dialog', 'Useredit')"
            >修改资料
            </v-btn>
            <v-btn outlined rounded text @click="logout()">退出</v-btn>
          </div>
        </v-card-actions>
      </v-card>
      <v-card
          class="mx-auto"
          elevation="2"
          max-width="500"
          outlined
          shaped
          style="top: 10px"
      >
        <v-list shaped>
          <v-list-item-group :color="$store.state.sys.color">
            <v-list-item @click="openOrder()">
              <v-list-item-icon>
                <v-icon>mdi-gift-open</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>订单列表</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="$store.state.user.type == 1&&$store.state.sys.isMobile == true">
              <v-list-item-icon>
                <v-icon>mdi-account-key</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title @click="$store.state.sys.isMobile = false">开启管理面板
                </v-list-item-title
                >
                <v-list-item-title @click="$store.state.sys.isMobile = false">(手机端默认不显示入口)
                </v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-container>
  </div>
</template>

<script>

export default {
  name: "My",
  components: {},
  data: () => ({}),
  mounted() {
  },
  methods: {
    openOrder() {
      if (this.$store.state.user.uid == -1) {
        this.$store.commit('dialog', 'Login');
        return
      }
      this.$router.push({path: "/myorder"});
    },
    logout() {
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
    },
    changeUserLogo() {

    }
  },
};
</script>

