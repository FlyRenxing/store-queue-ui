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
          <span style="font-size: 2em">湖南科技职业学院软件学院<br>
            天霸动霸tua&nbsp;队<br>
            成员：张东祥&nbsp;&nbsp;<span style="font-size: 2.5em">刘思铭</span><br>
            指导老师：戴臻老师<br>
            荣誉制作</span>
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