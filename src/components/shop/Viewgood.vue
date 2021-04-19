<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card max-height="350" max-width="350">
          <v-img max-height="350" max-width="350" :src="good.pic" class="white--text align-end"> </v-img>
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


          <v-card-title>{{good.gname}}</v-card-title>

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
            <v-card-title>￥{{good.price}}</v-card-title>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>

          <v-card-title>{{good.details}}</v-card-title>

        </v-card>
      </v-col>
    </v-row>
    <!-- <v-row> 详情 </v-row> -->
  </v-container>
</template>

<script>
export default {
  name: "ViewGood",
  props: ["good"],
};
</script>