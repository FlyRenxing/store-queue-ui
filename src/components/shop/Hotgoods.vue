<template>
  <v-row>
    <v-sheet class="mx-auto" elevation="6" rounded max-width="100%">
      <h2 style="text-align: center">热销商品</h2>
      <v-slide-group v-model="model" class="pa-4" show-arrows>
        <v-slide-item v-for="good in goods" :key="good.gid">
          <v-card hover class="ma-2" height="150" width="150" @click="viewgood(good.gid)">
        <v-img
          :src="good.pic"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="150"
        >
          <v-card-title v-text="good.gname.slice(0, 8)+'…'"></v-card-title>
        </v-img>
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>
  </v-row>
</template>

<script>
export default {
  name: "HotGoods",

  data: () => ({
    model: null,
    goods: [
      {
        gid: 1,
        gname: "加载中...",
        price: 1,
        category: 1,
        total: 1,
        state: 0,
        stock: 1,
        remarks: "12",
        details: "",
        pic: "",
      },
    ],
  }),
  mounted() {
    this.getGoodsRandom(8);
  },
  methods: {
    viewgood(id){
      this.$store.state.sys.viewgood_id=id
      this.$store.commit("dialog","Viewgood");
      //console.log(id)
    },
    getGoodsRandom(n) {
      this.$axios
        .get("/goods/random?n="+n)
        .then((response) => {
          let that = this;
          if (response.data.code == 200) {
            let goods = response.data.data;
            //that.goods=[];
            that.goods = goods;
            //console.log(goods)
          }
        })
        .catch((failResponse) => {
          console.log(failResponse);
        });
    },
  },
};
</script>