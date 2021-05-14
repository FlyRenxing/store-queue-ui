<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card max-height="350" max-width="350">
          <v-img max-height="350" max-width="350" :src="good.pic" class="white--text align-end"></v-img>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card v-if="seckill!=null" color="error">

          <v-card-text>

            <v-card-actions>
              <span class="text-h5">秒杀详情:</span>
              <v-spacer></v-spacer>
              <v-btn @click="dialog=true" text outlined color="grey darken-3">秒杀订单公示</v-btn>
            </v-card-actions>
            <br>
            时间：{{ seckill.startday + " " + seckill.starttime + "到" + seckill.endday + " " + seckill.endtime }}<br>
            规则：
            <span v-for="(item,index) in seckill.data" :key="index">
            {{ "前" + item.top + "至" + item.end + "名：享受" + item.discount * 10 + "折" }}<br>
          </span>
          </v-card-text>

        </v-card>
        <v-card style="top: 10px">
          <template slot="progress">
            <v-progress-linear
                color="deep-purple"
                height="10"
                indeterminate
            ></v-progress-linear>
          </template>


          <v-card-title>{{ good.gname }}</v-card-title>

          <v-card-text>
            <v-row align="center" class="mx-0">
              <v-rating
                  :value="5"
                  color="amber"
                  dense
                  half-increments
                  readonly
                  size="14"
              ></v-rating>

              <div class="grey--text ml-4">5</div>
            </v-row>
            <v-card-title>￥{{ good.price }}</v-card-title>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>

          <v-card-title>{{ good.details }}</v-card-title>

        </v-card>
      </v-col>
    </v-row>
    <!-- <v-row> 详情 </v-row> -->
    <SeckillOrderList @dialogClose="dialogClose" :dialog="dialog" :sid="seckill!=null?seckill.sid:null"></SeckillOrderList>
  </v-container>
</template>

<script>
import SeckillOrderList from "@/components/shop/SeckillOrderList";
export default {
  name: "ViewGood",
  components: {SeckillOrderList},
  props: ["good", "seckill"],
  data: () => ({
    dialog: false
  }),
  methods:{
    dialogClose(){
      console.log("1")
      this.dialog=false
    }
  }
}
;
</script>