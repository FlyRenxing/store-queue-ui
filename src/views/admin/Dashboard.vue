<template>
  <v-container>
    <div>
      <h1>仪表盘</h1>
      <v-row style="position: relative; top: 10px">
        <v-col cols="12" sm="6" md="3">
          <v-card height="80" color="deep-purple lighten-3"
            ><v-card-text
              ><h2>订单总数：{{ info.orderNum }}</h2></v-card-text
            ></v-card
          >
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card height="80" color="light-green accent-2"
            ><v-card-text
              ><h2>订单总额：{{ info.gvm }}</h2></v-card-text
            ></v-card
          >
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card height="80" color="cyan accent-1"
            ><v-card-text
              ><h2>商品总数：{{ info.goodsNum }}</h2></v-card-text
            ></v-card
          >
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card height="80" color="deep-orange lighten-1"
            ><v-card-text
              ><h2>用户总数：{{ info.userNum }}</h2></v-card-text
            ></v-card
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col> 假装我是个图表=。= </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Admin-Dashboard",
  components: {},
  data: () => ({
    info: {
      orderNum: 0,
      gmv: 0,
      goodsNum: 0,
      userNum: 0,
    },
  }),
  mounted(){
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.$axios
        .get("/admin/dashboard")
        .then((response) => {
          let that = this;
          if (response.data.code == 200) {
            let info = response.data.data;
            that.info = info;
          }
        })
        .catch((failResponse) => {
          console.log(failResponse);
        });
    },
  },
};
</script>

