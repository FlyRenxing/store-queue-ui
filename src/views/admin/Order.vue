<template>
<v-container>
    <h1>订单管理</h1>
    <v-data-table
      :headers="headers"
      :items="orders"
      :search="search"
      sort-by="price"
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
        ></v-switch>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>订单列表</v-toolbar-title>
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
          <!-- <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                模拟订单
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
                <v-spacer></v-spacer>
                是否付款：
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
                      <v-select
                        v-model="editedItem.category"
                        :items="$store.state.orders.category"
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
                <v-btn color="blue darken-1" text @click="close"> 取消 </v-btn>
                <v-btn color="blue darken-1" text @click="save"> 确定 </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog> -->
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">确定删除该订单？</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >取消</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >确定删除</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        用户快照，商品快照
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getOrdersByAll()"> 当前无订单-点此刷新 </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  name: "Admin-Order",
  components:{},
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "订单ID",
        align: "start",
        sortable: true,
        value: "oid",
      },
      { text: "用户id", value: "uid" },
      { text: "商品id", value: "gid" },
      { text: "订单时间", value: "ordetime" },
      { text: "状态", value: "state" },
      { text: "是否上架", value: "state", sortable: false },
      { text: "操作", value: "actions", sortable: false },
    ],
    orders: [],
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
    this.getOrdersByAll();
    //this.initialize();
  },

  methods: {
    getOrdersByAll() {
      this.$axios
        .get("/orders")
        .then((response) => {
          let that = this;
          if (response.data.code == 200) {
            that.loading=false;
            let orders = response.data.data;
            that.orders = orders;
          }
        })
        .catch((failResponse) => {
          console.log(failResponse);
        });
    },
    initialize() {
      this.orders = [
        {
          gid: 1,
          gname: "Frozen Yogurt",
          price: 159,
          category: 1,
          total: 99,
          stock: 0,
          pic: "abd",
          details: "描述",
          remarks: "haha",
          state: 0,
        },
        {
          gid: 2,
          gname: "2Frozen Yogurt",
          price: 666,
          category: 2,
          total: 99,
          stock: 0,
          pic: "as",
          details: "描述",
          remarks: "haha",
          state: 1,
        },
      ];
    },

    editItem(item) {
      this.editedIndex = this.orders.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.orders.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.orders.splice(this.editedIndex, 1);
      this.closeDelete();
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
      if (this.editedIndex > -1) {
        Object.assign(this.orders[this.editedIndex], this.editedItem);
      } else {
        this.orders.push(this.editedItem);
      }
      this.close();
    },
    objToMap(obj) {
      let strMap = new Map();
      for (let k of Object.keys(obj)) {
        strMap.set(obj[k].id, obj[k].name);
      }
      this.categoryMap = strMap;
    },
    addCategoryName() {
      console.log(this.orders);
      for (let i = 0; i < this.orders.length; i++) {
        const good = this.orders[i];
        good.categoryName = this.categoryMap.get(good.category);
      }
    },
  },
};
</script>