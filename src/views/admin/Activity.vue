<template>
  <v-container>
    <h1>营销管理</h1>
    <v-data-table
        :headers="headers"
        :items="seckill"
        :search="search"
        sort-by="sid"
        :sort-desc=true
        class="elevation-1"
    >
      <!--时间名称替换插槽-->
      <template v-slot:[`item.start`]="{ item }">
        {{ item.startday + " " + item.starttime }}
      </template>
      <template v-slot:[`item.end`]="{ item }">
        {{ item.endday + " " + item.endtime }}
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>秒杀列表</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="搜索"
              single-line
              hide-details
          ></v-text-field>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <v-dialog v-model="dialog" scrollable max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                创建秒杀
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
                <v-spacer></v-spacer>
                已使用次数：{{ editedItem.usecount }}
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="3">
                      <v-text-field
                          v-model="editedItem.gid"
                          label="商品ID"
                          readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="9">
                      <v-autocomplete
                          v-model="editedItem.gid"
                          :items="goods"
                          item-text="gname"
                          item-value="gid"
                          label="请输入/选择商品"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-dialog
                          ref="dialogday"
                          v-model="modal"
                          :return-value.sync="editedItem.startday"
                          width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                              v-model="editedItem.startday"
                              label="开始日期"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="editedItem.startday"
                            scrollable
                            locale="zh-cn"
                        >
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="modal = false">
                            取消
                          </v-btn>
                          <v-btn
                              text
                              color="primary"
                              @click="$refs.dialogday.save(editedItem.startday)"
                          >
                            确定
                          </v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-dialog
                          ref="dialogtime"
                          v-model="modalTime"
                          :return-value.sync="editedItem.starttime"
                          persistent
                          width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                              v-model="editedItem.starttime"
                              label="开始时间"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                            v-if="modalTime"
                            v-model="editedItem.starttime"
                            full-width
                            use-seconds
                            format="24hr"
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                              text
                              color="primary"
                              @click="modalTime = false"
                          >
                            取消
                          </v-btn>
                          <v-btn
                              text
                              color="primary"
                              @click="$refs.dialogtime.save(editedItem.starttime)"
                          >
                            确定
                          </v-btn>
                        </v-time-picker>
                      </v-dialog>
                    </v-col>

                    <v-col cols="12" sm="6">

                      <v-dialog
                          ref="dialogday2"
                          v-model="modal2"
                          :return-value.sync="editedItem.endday"
                          width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                              v-model="editedItem.endday"
                              label="结束日期"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="editedItem.endday"
                            scrollable
                            locale="zh-cn"
                        >
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="modal2 = false">
                            取消
                          </v-btn>
                          <v-btn
                              text
                              color="primary"
                              @click="$refs.dialogday2.save(editedItem.endday)"
                          >
                            确定
                          </v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-dialog
                          ref="dialogtime2"
                          v-model="modalTime2"
                          :return-value.sync="editedItem.endtime"
                          persistent
                          width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                              v-model="editedItem.endtime"
                              label="结束时间"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                            v-if="modalTime2"
                            v-model="editedItem.endtime"
                            full-width
                            use-seconds
                            format="24hr"
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                              text
                              color="primary"
                              @click="modalTime2 = false"
                          >
                            取消
                          </v-btn>
                          <v-btn
                              text
                              color="primary"
                              @click="$refs.dialogtime2.save(editedItem.endtime)"
                          >
                            确定
                          </v-btn>
                        </v-time-picker>
                      </v-dialog>
                    </v-col>
                    <v-container>
                      <v-row v-for="(item,index) in editedItem.data" :key="index">
                        <v-col cols="12" sm="4">
                          <v-text-field
                              v-model="item.top"
                              label="从(人)"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                          <v-text-field
                              v-model="item.end"
                              label="到(人)"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field
                              v-model="item.discount"
                              label="折"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1">
                          <v-btn @click="editedItem.data.splice(index,1)" icon v-if="index!=editedItem.data.length-1">
                            <v-icon>mdi-minus-circle-outline</v-icon>
                          </v-btn>
                          <v-btn @click="editedItem.data.push({top:item.end+1,end:item.end+2,discount:1});" icon
                                 v-if="index==editedItem.data.length-1">
                            <v-icon>mdi-plus-circle-outline</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-row>

                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close"> 取消</v-btn>
                <v-btn
                    color="blue darken-1"
                    :loading="loading"
                    text
                    @click="save"
                >
                  确定
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">确定删除该秒杀？</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                >取消
                </v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >确定删除
                </v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete</v-icon>
        <v-btn @click="listDialogOpen(item.sid)" color="warning">公示名单</v-btn>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getSeckillByAll"> 当前无秒杀-点此刷新</v-btn>
      </template>
    </v-data-table>
    <v-snackbar v-model="snackbar">
      {{ message }}
    </v-snackbar>
    <SeckillOrderList @dialogClose="listDialogClose"
                      :dialog="listdialog"
                      :sid="clickSid!=-1?clickSid:null"
    ></SeckillOrderList>
  </v-container>
</template>

<script>
import SeckillOrderList from "@/components/shop/SeckillOrderList";

export default {
  name: "Admin-Activity",
  components: {SeckillOrderList},
  data: () => ({
    modal: false,
    modal2: false,
    modalTime: false,
    modalTime2: false,
    message: "",
    snackbar: false,
    loading: false,
    search: "",
    dialog: false,
    listdialog: false,
    clickSid: -1,
    addressDialog: false,
    dialogDelete: false,
    goods: [],
    headers: [
      {
        text: "活动ID",
        align: "start",
        sortable: true,
        value: "sid",
      },
      {text: "商品ID", value: "gid"},
      {text: "商品名", value: "gname"},
      {text: "开始时间", value: "start"},
      {text: "结束时间", value: "end"},
      {text: "已使用次数", value: "usecount"},
      {text: "操作", value: "actions", sortable: false},
    ],
    seckill: [],
    SeckillMap: null,
    editedIndex: -1,
    editedItem: {
      sid: -1,
      startday: "2021-06-01",
      starttime: "00:00",
      endday: "2021-06-01",
      endtime: "00:00",
      gid: 0,
      gname: "",
      usecount: 0,
      data: [
        {top: 0, end: 100, discount: 0.1},
        {top: 101, end: 500, discount: 0.5},
        {top: 501, end: 1000, discount: 0.8},
      ]
    },
    defaultItem: {
      sid: -1,
      startday: "2021-06-01",
      starttime: "00:00",
      endday: "2021-06-01",
      endtime: "00:00",
      gid: 0,
      gname: "",
      usecount: 0,
      data: [
        {top: 0, end: 100, discount: 0.1},
        {top: 101, end: 500, discount: 0.5},
        {top: 501, end: 1000, discount: 0.8},
      ]
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1
          ? "添加秒杀"
          : "编辑秒杀(sid:" + this.editedItem.sid + ")";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.getSeckillByAll();
    this.getGoodsByAll();

    //this.initialize();
    //this.objToMap(this.$store.state.seckill.category);
    //this.addCategoryName();
  },

  methods: {
    getSeckillByAll() {
      this.$axios
          .get("/seckill")
          .then((response) => {
            let that = this;
            if (response.data.code == 200) {
              that.loading = false;
              for (let i = 0; i < response.data.data.length; i++) {
                response.data.data[i].data = JSON.parse(response.data.data[i].data)
              }
              let seckill = response.data.data;
              that.seckill = seckill;
              that.$store.commit("updateSeckillList", seckill);
              that.$store.commit("updateSeckillMap", that.objToMap(seckill));
            }
          })
          .catch((failResponse) => {
            console.log(failResponse);
          });
    },
    getGoodsByAll() {
      this.$axios
          .get("/goods/all")
          .then((response) => {
            let that = this;
            if (response.data.code == 200) {
              that.goods = response.data.data;
            }
          })
          .catch((failResponse) => {
            console.log(failResponse);
          });
    },
    verifyData() {
      for (let i = 0; i < this.editedItem.data.length; i++) {
        //console.log(this.editedItem.data[i].top,this.editedItem.data[i].end);
        if (this.editedItem.data[i].top > this.editedItem.data[i].end) {
          this.editedItem.data[i].end = this.editedItem.data[i].top + 1;
          alert("错误：活动数据的开始人数需大于等于活动数据的结束人数！已为您修正错误数据！请修改后重新提交");
          return false;
        }
      }
      for (let i = 0; i < this.editedItem.data.length; i++) {
        i++;
        if (this.editedItem.data[i].top < this.editedItem.data[i - 1].end) {
          this.editedItem.data[i].top = this.editedItem.data[i - 1].end + 1;
          alert("错误：下一组活动数据的开始人数需大于上一组活动数据的结束人数！已为您修正错误数据！请修改后重新提交");
          return false;
        }
        return true;
      }
    },
    newSeckill() {
      if (!this.verifyData()) {
        return;
      }
      this.loading = true;
      let data = new FormData();
      data.append("sid", this.editedItem.sid);
      data.append("gid", this.editedItem.gid);
      data.append("startday", this.editedItem.startday);
      data.append("starttime", this.editedItem.starttime);
      data.append("endday", this.editedItem.endday);
      data.append("endtime", this.editedItem.endtime);
      data.append("data", JSON.stringify(this.editedItem.data));
      data.append("usecount", this.editedItem.usecount);

      this.$axios
          .post("/seckill/new", data)
          .then((response) => {
            let that = this;
            that.loading = false;
            if (response.data.code == 200) {
              that.message = response.data.meg;
              that.snackbar = true;
              that.getSeckillByAll();
              that.close();
            } else {
              that.snackbar = true;
              that.message = response.data.meg + "，代码：" + response.data.code;
            }
          })
          .catch((failResponse) => {
            this.loading = false;
            this.snackbar = true;
            this.message = "新建失败，网络异常请稍后重试。代码：" + failResponse;
          });
    },
    editSeckill() {
      if (!this.verifyData()) {
        return;
      }
      this.loading = true;
      let data = new FormData();
      data.append("sid", this.editedItem.sid);
      data.append("gid", this.editedItem.gid);
      data.append("startday", this.editedItem.startday);
      data.append("starttime", this.editedItem.starttime);
      data.append("endday", this.editedItem.endday);
      data.append("endtime", this.editedItem.endtime);
      data.append("data", JSON.stringify(this.editedItem.data));
      data.append("usecount", this.editedItem.usecount);

      this.$axios
          .post("/seckill/edit", data)
          .then((response) => {
            let that = this;
            that.loading = false;
            if (response.data.code == 200) {
              that.message = response.data.meg;
              that.snackbar = true;
              that.getSeckillByAll();
              that.close();
            } else {
              that.snackbar = true;
              that.message = response.data.meg + "，代码：" + response.data.code;
            }
          })
          .catch((failResponse) => {
            this.loading = false;
            this.snackbar = true;
            this.message = "修改失败，网络异常请稍后重试。代码：" + failResponse;
          });
    },
    deleteSeckill(sid) {
      this.loading = true;

      this.$axios
          .get("/seckill/" + sid + "/delete")
          .then((response) => {
            let that = this;
            that.loading = false;
            if (response.data.code == 200) {
              that.message = response.data.meg;
              that.snackbar = true;
              that.getSeckillByAll();
              that.closeDelete();
            } else {
              that.snackbar = true;
              that.message = response.data.meg + "，代码：" + response.data.code;
            }
          })
          .catch((failResponse) => {
            this.loading = false;
            this.snackbar = true;
            this.message = "删除失败，网络异常请稍后重试。代码：" + failResponse;
          });
    },
    listDialogOpen(sid) {
      this.clickSid = sid
      this.listdialog = true
    },
    listDialogClose() {
      //console.log("1")
      this.listdialog = false
    },
    initialize() {
      this.seckill = [
        {
          sid: -2,
          startday: "2021-06-01",
          starttime: "00:00",
          endday: "2021-06-01",
          endtime: "12:00",
          gid: 0,
          gname: "薯片",
          data: [
            {top: 0, end: 1000, discount: 0.8},
            {top: 1001, end: 2000, discount: 0.9}
          ],
        },
        {
          sid: -1,
          startday: "2021-06-01",
          starttime: "00:00",
          endday: "2021-06-01",
          endtime: "12:00",
          gid: 2,
          gname: "薯片",
          data: [
            {top: 0, end: 1000, discount: 0.8},
            {top: 1001, end: 2000, discount: 0.9}
          ]

        }
      ];
    },

    editItem(item) {
      this.editedIndex = this.seckill.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.seckill.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      //this.seckill.splice(this.editedIndex, 1);
      this.deleteSeckill(this.editedItem.sid);
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex == -1) {
        this.newSeckill();
      } else {
        this.editSeckill();
      }
      // if (this.editedIndex > -1) {
      //   Object.assign(this.seckill[this.editedIndex], this.editedItem);
      // } else {
      //   this.orders.push(this.editedItem);
      // }
      // this.close();
    },
    objToMap(obj) {
      let strMap = new Map();
      for (let k of Object.keys(obj)) {
        strMap.set(obj[k].gid, obj[k]);
      }
      return strMap;
    },
  },
};
</script>