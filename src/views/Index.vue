<template>
  <div>
    <v-container>
      <HotGoods />
      <div style="height:30px"></div>
      <GoodsList :category="0" />
    </v-container>
  </div>
</template>
<script>
import HotGoods from "../components/shop/Hotgoods.vue";
import GoodsList from "../components/shop/Goodslist.vue";

export default {
  components: { HotGoods, GoodsList },
  data: () => ({}),
};
</script>
