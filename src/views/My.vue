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
            }}</v-list-item-subtitle>
            <v-list-item-subtitle
              >注册时间：{{ $store.state.user.regtime }}</v-list-item-subtitle
            >
          </v-list-item-content>

          <v-list-item-avatar tile size="62">
            <v-avatar
              size="62"
              :color="$store.state.sys.color"
              @click="logout()"
            >
              <img
                :src="$store.state.user.logo"
                :alt="$store.state.user.uname"
                v-if="$store.state.user.logo != null"
              />
              <span
                class="white--text headline"
                v-if="$store.state.user.logo == null"
                >{{ $store.state.user.uname.slice(0, 2) }}</span
              >
            </v-avatar></v-list-item-avatar
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
            <v-btn outlined rounded text @click="logout()">退出 </v-btn>
          </div>
        </v-card-actions>
      </v-card>
      <v-card
        style="top: 10px"
        class="mx-auto"
        max-width="500"
        elevation="2"
        outlined
        shaped
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
                <v-list-item-title @click="$store.state.sys.isMobile = false">开启管理面板</v-list-item-title
                >
                 <v-list-item-title @click="$store.state.sys.isMobile = false">(手机端默认不显示入口)</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-container>
    <Edit
      :dialog="$store.state.sys.dialog.useredit"
      :user="$store.state.user"
    />
  </div>
</template>

<script>
import Edit from "../components/auth/Edit.vue";
export default {
  name: "My",
  components: { Edit },
  data: () => ({}),
  mounted() {},
  methods: {
    openOrder() {
      this.$router.push({ path: "/order" });
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
  },
};
</script>

