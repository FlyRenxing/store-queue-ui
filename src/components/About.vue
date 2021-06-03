<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      :fullscreen="this.$store.state.sys.isMobile"
      hide-overlay
      persistent
      transition="dialog-bottom-transition"
      width="500"
    >
      <v-card>
        <v-toolbar dark :color="this.$store.state.sys.color">
          <v-toolbar-title>关于</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="isClose">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text align="center">
          湖南科技职业学院软件学院<br>
          天霸动霸tua 队<br>
          荣誉制作
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "About",
  props: ["dialog"],
  methods: {
    isClose() {
      this.$store.commit("dialog","About")
    },
  },
};
</script>