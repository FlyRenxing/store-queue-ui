<template>
  <v-row dense>
    <div v-show="!loading&&goods.length==0">当前分类商品为空！</div>
    <v-col
        :cols="!$store.state.sys.isMobile ? 4 : 6"
        v-for="n in 6"
        :key="n"
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
    <v-col
        v-for="good in goods"
        :key="good.gid+'all'"
        :cols="!$store.state.sys.isMobile ? 4 : 6"
    >
      <v-card>
        <v-img
            :src="good.pic"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="200px"
        >
          <v-card-title v-text="good.gname"></v-card-title>
        </v-img>

        <v-card-actions>
          <v-btn x-small fab :color="$store.state.sys.color" text> ￥{{ good.price }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn
              small
              :color="$store.state.seckill.map.get(good.gid)==null?'success':'error'"
              @click="viewgood(good.gid)">

            <v-icon>mdi-basket</v-icon>
            {{ $store.state.seckill.map.get(good.gid)==null?"立即购买":"秒杀活动" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "GoodsList",
  props: ["category"],
  data: () => ({
    loading: true,
    goods: [
      // {
      //   gid: 1,
      //   gname: "Pre-fab homes",
      //   price: 1,
      //   category: 1,
      //   total: 1,
      //   state: 0,
      //   stock: 1,
      //   remarks: "12",
      //   details: "",
      //   pic: "",
      // },
    ],
  }),
  watch: {
    $route: {
      handler() {
        this.getGoodsByCategory(this.$route.query.category);
      },
      deep: true,
    },
  },
  mounted() {
    this.loading = true;
    this.getGoodsByCategory(this.$route.query.category);
  },
  methods: {
    viewgood(id) {
      this.$store.state.sys.viewgood_id = id
      this.$store.commit("dialog", "Viewgood");
      //console.log(id)
    },
    getGoodsByAll() {
      this.$axios
          .get("/goods")
          .then((response) => {
            let that = this;
            if (response.data.code == 200) {
              that.loading = false;
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
    getGoodsByCategory(category) {
      this.$axios
          .get("/goods?category=" + category)
          .then((response) => {
            let that = this;
            if (response.data.code == 200) {
              that.loading = false;
              let goods = response.data.data;
              that.goods = goods;
            }
          })
          .catch((failResponse) => {
            console.log(failResponse);
          });
    },
  },
};
</script>
