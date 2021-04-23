<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>用户信息:
            <v-spacer></v-spacer>
            <v-btn
                outlined
                rounded
                text
                @click="$store.commit('dialog', 'Useredit')"
            >修改资料
            </v-btn>
          </v-card-title>


          <v-card-text>
            用户名：{{ $store.state.user.uname }}<br>
            手机号：{{ $store.state.user.phone }}<br>
            邮箱：{{ $store.state.user.email }}<br>
          </v-card-text>

        </v-card>

      </v-col>
      <v-col cols="12" sm="6">
        <v-card>
          <template slot="progress">
            <v-progress-linear
                color="deep-purple"
                height="10"
                indeterminate
            ></v-progress-linear>
          </template>
          <v-card max-height="350" max-width="350">
            <v-img max-height="350" max-width="350" :src="good.pic" class="white--text align-end"></v-img>
          </v-card>

          <v-card-title>{{ good.gname }}</v-card-title>


          <v-divider class="mx-4"></v-divider>

          <v-card-title>{{ good.details }}</v-card-title>

        </v-card>

      </v-col>
    </v-row>
    <v-card-actions
    >
      <v-spacer></v-spacer
      >
      <v-btn
          dark
          @click="buy(good.gid)"
          :loading="loading"
          :color="$store.state.sys.color"
          large
          :style="
                    $store.state.sys.isMobile
                      ? 'z-index: 999;position: fixed !important;right: 32px;bottom: 32px;'
                      : ''
                  "
      >
        <v-card-title>￥{{ good.price }}</v-card-title>
        <span>提交订单</span>
      </v-btn
      >
    </v-card-actions>
    <v-snackbar v-model="snackbar">
      {{ message }}
    </v-snackbar>
    <!-- <v-row> 详情 </v-row> -->
  </v-container>
</template>

<script>
export default {
  name: "CreateOrder",
  props: ["good"],
  data: () => ({
    loading: false,
    message: "",
    snackbar: false,
  }),
  methods: {
    buy(gid) {
      this.$axios
          .get("/goods/" + gid + "/buy")
          .then((response) => {
            let that = this;
            that.loading = false;
            if (response.data.code == 200) {
              that.message = response.data.meg;
              that.snackbar = true;
            } else {
              that.snackbar = true;
              that.message = response.data.meg + "，代码：" + response.data.code;
            }
          })
          .catch((failResponse) => {
            this.loading = false;
            this.snackbar = true;
            this.message = "购买失败，网络异常请稍后重试。代码：" + failResponse;
          });
    }
  }
};
</script>