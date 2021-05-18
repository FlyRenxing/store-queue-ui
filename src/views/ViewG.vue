<template>
  <v-row justify="center">
    <v-dialog
        v-model="dialog"
        :fullscreen="this.$store.state.sys.isMobile"
        scrollable
        hide-overlay
        persistent
        transition="dialog-bottom-transition"
        width="800"
    >
      <v-card>
        <v-toolbar dark :color="this.$store.state.sys.color">
          <v-btn icon v-show="step==2" @click="step--">
            <v-icon>mdi-arrow-left-thin-circle-outline</v-icon>
          </v-btn>
          <v-toolbar-title>{{ currentTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="isClose">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <!--        <v-btn-->
        <!--            fab-->
        <!--            dark-->
        <!--            :color="$store.state.sys.color"-->
        <!--            @click="isClose()"-->
        <!--            v-if="$store.state.sys.isMobile"-->
        <!--            style="-->
        <!--          width: 52px;-->
        <!--          z-index: 999;-->
        <!--          position: fixed !important;-->
        <!--          left: 16px;-->
        <!--          bottom: 32px;-->
        <!--        "-->
        <!--        >-->
        <!--          <v-icon>mdi-close</v-icon>-->
        <!--        </v-btn-->
        <!--        >-->
        <v-card-text>
          <v-window v-model="step">
            <v-window-item :value="1">

              <v-col
                  :cols="!$store.state.sys.isMobile ? 4 : 6"
                  v-show="loading"
              >
                <v-sheet color="lighten-4" class="pa-3">
                  <v-skeleton-loader
                      class="mx-auto"
                      max-width="300"
                      type="card"
                  ></v-skeleton-loader>
                </v-sheet>
              </v-col>
              <ViewGood v-show="!loading" :good="good" :seckill="seckill"/>


            </v-window-item>
            <v-window-item :value="2">
              <CreateOrder :good="good"/>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  dark
                  :color="$store.state.sys.color"
                  large
                  @click="$store.state.user.uid!=-1?time.remainTime<=0?step++:null:$store.commit('dialog','Login')"
                  style="right: 25px"
              >
                <span v-if="time.remainTime>0">倒计时：{{ time.hour }}时{{ time.minute }}分{{ time.second }}秒</span>
                <span v-if="time.remainTime<=0">立即购买</span>
              </v-btn>
            </v-card-actions>
          </v-window-item>
          <v-window-item :value="2">
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
                  style="right: 25px"
              >
                <v-card-title>￥{{ good.price }}</v-card-title>
                <span>提交订单</span>
              </v-btn>
            </v-card-actions>
          </v-window-item>
        </v-window>
      </v-card>
      <v-overlay
          absolute
          :value="overlay"
      >
        正在排队中，请勿关闭本页面。
      </v-overlay>
    </v-dialog>
    <v-snackbar v-model="snackbar">
      {{ message }}
    </v-snackbar>

  </v-row>
</template>

<script>
import ViewGood from "../components/shop/Viewgood.vue";
import CreateOrder from "@/components/shop/CreateOrder";

export default {
  name: "ViewG",
  components: {ViewGood, CreateOrder},
  props: ["dialog"],
  data: () => ({
    step: 1,
    message: "",
    snackbar: false,
    overlay: false,
    good: {},
    seckill: null,
    loading: true,
    orderState: 0,
    time: {
      remainTime: 0,
      hour: 0,
      minute: 0,
      second: 0,
    },
  }),
  mounted() {

  },

  watch: {
    "$store.state.sys.viewgood_id": function (id) {
      this.step = 1;
      this.loading = true;
      this.time.remainTime = 0;
      this.getGood(id);
      this.getSeckill(id);
      if (this.seckill != null) {
        this.updateTime();
      }

    },
  },
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "商品详情";
        case 2:
          return "创建订单";
        default:
          return "BUG...";
      }
    },
  },
  methods: {
    isClose() {
      this.$store.commit("dialog", "Viewgood");
    },
    getGood(id) {
      this.$axios
          .get("/goods/" + id)
          .then((response) => {
            let that = this;
            if (response.data.code == 200) {
              that.loading = false;
              let good = response.data.data;
              that.good = good;
            }
          })
          .catch((failResponse) => {
            console.log(failResponse);
          });
    },
    getSeckill(gid) {
      this.seckill = this.$store.state.seckill.map.get(gid);
    },
    updateTime() {
      let start = this.seckill.startday + " " + this.seckill.starttime
      let date = new Date(start).getTime() - new Date().getTime();
      //console.log(date)
      this.time.remainTime = date / 1000;
      this.time.hour = Math.floor((this.time.remainTime / 3600))
      this.time.minute = Math.floor((this.time.remainTime / 60) % 60)
      this.time.second = Math.floor(this.time.remainTime % 60 % 60)
      this.countDowm()
    },
    countDowm() {
      let self = this.time

      clearInterval(this.promiseTimer)
      this.promiseTimer = setInterval(function () {
        if (self.hour === 0) {
          if (self.minute !== 0 && self.second === 0) {
            self.second = 59
            self.minute -= 1
          } else if (self.minute === 0 && self.second === 0) {
            self.second = 0
            //self.$emit('countDowmEnd', true)
            clearInterval(self.promiseTimer)
          } else {
            self.second -= 1
          }
        } else {
          if (self.minute !== 0 && self.second === 0) {
            self.second = 59
            self.minute -= 1
          } else if (self.minute === 0 && self.second === 0) {
            self.hour -= 1
            self.minute = 59
            self.second = 59
          } else {
            self.second -= 1
          }
        }

      }, 1000)
    },
    formatNum(num) {
      return num < 10 ? '0' + num : '' + num
    },
    buy(gid) {
      let end = this.seckill.endday + " " + this.seckill.endtime
      let isOver = new Date(end) < new Date()
      if (isOver && !confirm("秒杀已结束，继续购买将按照原价购买。是否继续购买？")) {
        return
      }
      this.overlay = true
      //此处需要初始化订单状态代码！
      this.orderState = 0
      this.$axios
          .get("/goods/" + gid + "/buy")
          .then((response) => {
            let that = this;
            that.loading = false;
            if (response.data.code == 200) {
              that.message = response.data.meg;
              that.snackbar = true;
              let t = window.setInterval(function () {
                that.getUuidState(response.data.data)
                switch (that.orderState) {
                  case 0:
                    that.message = "正在排队中，请勿刷新本页面";
                    that.snackbar = true;
                    break;
                  case 1:
                    that.message = "购买成功！请至我的-订单页面查看订单并付款";
                    that.snackbar = true;
                    clearInterval(t)
                    that.overlay = false
                    break;
                  case 2:
                    that.message = "购买失败！库存不足，下次再试试吧~";
                    that.snackbar = true;
                    clearInterval(t)
                    that.overlay = false
                    break;
                }
              }, 2500)
            } else {
              this.overlay = false;
              this.loading = false;
              that.message = "错误，" + response.data.meg + "，代码：" + response.data.code;
              that.snackbar = true;
            }
          })
          .catch((failResponse) => {
            this.loading = false;
            this.snackbar = true;
            this.message = "购买失败，网络异常请稍后重试。代码：" + failResponse;
          });
    },
    getUuidState(uuid) {
      let that = this;
      this.$axios
          .get("/order/" + uuid + "/getState")
          .then((response) => {
            if (response.data.code == 200) {
              that.orderState = response.data.data;
            }
          })
          .catch((failResponse) => {
            console.log(failResponse);
          });
      //return state
    }

  },
};
</script>