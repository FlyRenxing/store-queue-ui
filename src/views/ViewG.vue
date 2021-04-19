<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      :fullscreen="this.$store.state.sys.isMobile"
      hide-overlay
      persistent
      transition="dialog-bottom-transition"
      width="800"
    >
      <v-toolbar dark :color="this.$store.state.sys.color">
        <v-toolbar-title>{{ currentTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="isClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-btn
        fab
        dark
        :color="$store.state.sys.color"
        @click="isClose()"
        v-if="$store.state.sys.isMobile"
        style="
          width: 800px;
          z-index: 999;
          position: fixed !important;
          left: 16px;
          bottom: 32px;
        "
        ><v-icon>mdi-close</v-icon></v-btn
      >
      <v-card>
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-card-text>
              <ViewGood :good="good" />
              <v-card-actions
                ><v-spacer></v-spacer
                ><v-btn
                  dark
                  :color="$store.state.sys.color"
                  large
                  @click="step++"
                  :style="
                    $store.state.sys.isMobile
                      ? 'z-index: 999;position: fixed !important;right: 32px;bottom: 32px;'
                      : ''
                  "
                  >立即购买</v-btn
                ></v-card-actions
              >
            </v-card-text>
          </v-window-item>
          <v-window-item :value="2">
            <v-card-text>
              提交订单
              <v-btn @click="step--">取消</v-btn>
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
import ViewGood from "../components/shop/Viewgood.vue";
export default {
  name: "ViewG",
  components: { ViewGood },
  props: ["dialog"],
  data: () => ({
    step: 1,
    message: "",
    snackbar: false,
    good: {},
  }),
  watch: {
    "$store.state.sys.viewgood_id": function (id) {
      this.getGood(id);
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
            let good = response.data.data;
            that.good = good;
          }
        })
        .catch((failResponse) => {
          console.log(failResponse);
        });
    },
  },
};
</script>