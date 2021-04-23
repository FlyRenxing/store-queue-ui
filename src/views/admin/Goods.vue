<template>
  <v-container>
    <h1>商品管理</h1>
    <v-data-table
        :headers="headers"
        :items="goods"
        :search="search"
        sort-by="gid"
        sort-desc=true
        class="elevation-1"
    >
      <!--分类名称替换插槽-->
      <template v-slot:[`item.category`]="{ item }">
        {{ categoryMap.get(item.category) }}
      </template>
      <template v-slot:[`item.state`]="{ item }">
        <v-switch
            :true-value="0"
            :false-value="1"
            v-model="item.state"
            readonly
            @click="editItem(item)"
        ></v-switch>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>商品列表</v-toolbar-title>
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
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                添加商品
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
                <v-spacer></v-spacer>
                是否上架：
                <v-switch
                    :true-value="0"
                    :false-value="1"
                    v-model="editedItem.state"
                ></v-switch>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-text-field
                          v-model="editedItem.gname"
                          label="商品名称"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3">
                      <v-text-field
                          v-model="editedItem.price"
                          label="商品价格"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3">
                      <!-- <v-text-field
                        v-model="editedItem.category"
                        label="分类ID"
                      ></v-text-field> -->
                      <v-select
                          v-model="editedItem.category"
                          :items="$store.state.goods.category"
                          item-text="name"
                          item-value="id"
                          label="商品分类"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="3">
                      <v-text-field
                          v-model="editedItem.total"
                          label="商品总数"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3">
                      <v-text-field
                          v-model="editedItem.stock"
                          label="剩余库存"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field
                          v-model="editedItem.pic"
                          label="商品图片(URL)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field
                          v-model="editedItem.details"
                          label="商品描述"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field
                          v-model="editedItem.remarks"
                          label="备注"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close"> 取消</v-btn>
                <v-btn color="blue darken-1" text @click="save"> 确定</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">确定删除该商品？</v-card-title>
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
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getGoodsByAll"> 当前无商品-点此刷新</v-btn>
      </template>
    </v-data-table>
    <v-snackbar v-model="snackbar">
      {{ message }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: "Admin-Goods",
  components: {},
  data: () => ({
    message: "",
    snackbar: false,
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "商品ID",
        align: "start",
        sortable: true,
        value: "gid",
      },
      {text: "商品名称", value: "gname"},
      {text: "商品价格", value: "price"},
      {text: "分类", value: "category"},
      {text: "商品总数", value: "total"},
      {text: "商品库存", value: "stock"},
      {text: "商品备注", value: "remarks"},
      {text: "是否上架", value: "state", sortable: false},
      {text: "操作", value: "actions", sortable: false},
    ],
    goods: [],
    editedIndex: -1,
    editedItem: {
      gid: null,
      gname: "",
      price: 0,
      category: 0,
      total: 0,
      stock: 0,
      pic: 0,
      remarks: "",
      state: 0,
    },
    defaultItem: {
      gid: null,
      gname: "",
      price: 0,
      category: 0,
      total: 0,
      stock: 0,
      pic: "",
      remarks: "",
      state: 0,
    },
    categoryMap: null,
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1
          ? "添加商品"
          : "编辑商品(gid:" + this.editedItem.gid + ")";
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
    this.getGoodsByAll();
    //this.initialize();
    this.objToMap(this.$store.state.goods.category);
    //this.addCategoryName();
  },

  methods: {
    getGoodsByAll() {
      this.$axios
          .get("/goods/all")
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
    newGoods() {
      this.loading = true;
      let data = new FormData();
      data.append("gname", this.editedItem.gname);
      data.append("price", this.editedItem.price);
      data.append("category", this.editedItem.category);
      data.append("total", this.editedItem.total);
      data.append("stock", this.editedItem.stock);
      data.append("state", this.editedItem.state);
      data.append("pic", this.editedItem.pic);
      data.append("details", this.editedItem.details);
      data.append("remarks", this.editedItem.remarks);

      this.$axios
          .post("/goods/new", data)
          .then((response) => {
            let that = this;
            that.loading = false;
            if (response.data.code == 200) {
              that.message = response.data.meg;
              that.snackbar = true;
              that.getGoodsByAll();
              that.close();
            } else {
              that.snackbar = true;
              that.message = response.data.meg + "，代码：" + response.data.code;
            }
          })
          .catch((failResponse) => {
            this.loading = false;
            this.snackbar = true;
            this.message = "新增失败，网络异常请稍后重试。代码：" + failResponse;
          });
    },
    editGoods() {
      this.loading = true;
      let data = new FormData();
      data.append("gid", this.editedItem.gid);
      data.append("gname", this.editedItem.gname);
      data.append("price", this.editedItem.price);
      data.append("category", this.editedItem.category);
      data.append("total", this.editedItem.total);
      data.append("stock", this.editedItem.stock);
      data.append("state", this.editedItem.state);
      data.append("pic", this.editedItem.pic);
      data.append("details", this.editedItem.details);
      data.append("remarks", this.editedItem.remarks);

      this.$axios
          .post("/goods/edit", data)
          .then((response) => {
            let that = this;
            that.loading = false;
            if (response.data.code == 200) {
              that.message = response.data.meg;
              that.snackbar = true;
              that.getGoodsByAll();
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
    deleteGoods(gid) {
      this.loading = true;

      this.$axios
          .get("/goods/delete?gid=" + gid)
          .then((response) => {
            let that = this;
            that.loading = false;
            if (response.data.code == 200) {
              that.message = response.data.meg;
              that.snackbar = true;
              that.getGoodsByAll();
              that.closeDelete();
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
    initialize() {
      this.goods = [];
    },

    editItem(item) {
      this.editedIndex = this.goods.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.goods.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      //this.goods.splice(this.editedIndex, 1);
      this.deleteGoods(this.editedItem.gid);
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
        this.newGoods();
      } else {
        this.editGoods();
      }
    },
    objToMap(obj) {
      let strMap = new Map();
      for (let k of Object.keys(obj)) {
        strMap.set(obj[k].id, obj[k].name);
      }
      this.categoryMap = strMap;
    },
    addCategoryName() {
      //console.log(this.goods);
      for (let i = 0; i < this.goods.length; i++) {
        const good = this.goods[i];
        good.categoryName = this.categoryMap.get(good.category);
      }
    },
  },
};
</script>

