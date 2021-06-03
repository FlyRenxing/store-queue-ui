<template>
  <v-dialog
      v-model="dialog"
      scrollable
      hide-overlay
      persistent
      transition="dialog-bottom-transition"
      width="500"
  >
    <v-card>
      <v-toolbar dark :color="this.$store.state.sys.color">
        <v-toolbar-title>活动名单公示</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="isClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th>名次</th>
              <th>用户名</th>
              <th>电话</th>
              <th>折扣</th>
            </tr>
            </thead>
            <tbody>
            <td
                class="text-center"
                colspan="3"
                v-if="SeckillOrderList.length==0"
            >目前还没有参与秒杀的订单，快去做第一人吧~
            </td>
            <tr
                v-for="(item,index) in SeckillOrderList"
                :key="index"
            >
                <td>{{ index + 1 }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.phone }}</td>
                <td>{{ item.discount }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <p class="text-center">活动统计：共计{{ SeckillOrderList.length }}个订单。（最多显示前一千笔订单）</p>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "SeckillOrderList",
  props: ["dialog", "sid"],
  data: () => ({
    SeckillOrderList: [],
  }),
  watch: {
    "sid": function () {
      this.getSeckillOrderList()
    },
  },
  mounted() {
    this.getSeckillOrderList()
  },
  methods: {
    getSeckillOrderList() {
      if (this.sid == null) {
        return
      }
      let sid = this.sid
      this.$axios
          .get("/seckill/" + sid + "/seckillOrderList")
          .then((response) => {
            let that = this;
            if (response.data.code == 200) {
              that.SeckillOrderList = response.data.data;
            }
          })
          .catch((failResponse) => {
            console.log(failResponse);
          });
    },
    isClose() {
      this.$emit('dialogClose', '')
    }
  }
}
</script>

<style scoped>

</style>