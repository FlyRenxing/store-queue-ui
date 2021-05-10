<template>
  <v-container>
    <h1>订单管理</h1>
    <v-data-table
        :headers="headers"
        :items="orders"
        :search="search"
        sort-by="oid"
        sort-desc=true
        show-expand
        class="elevation-1"
    >
      <!--分类名称替换插槽-->
      <template v-slot:[`item.category`]="{ item }">
        {{ categoryMap.get(item.category) }}
      </template>
      <template v-slot:[`item.state`]="{ item }">
        <v-chip v-if="item.state==0" color="warning">未付款</v-chip>
        <v-chip v-if="item.state==1" color="success">已付款</v-chip>
        <v-chip v-if="item.state==2" color="error">已取消</v-chip>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          用户ID：{{ item.user_snapshot.uid }}
          用户名：{{ item.user_snapshot.uname }}
          电子邮箱：{{ item.user_snapshot.email }}
          电话：{{ item.user_snapshot.phone }}
          生日：{{ item.user_snapshot.birthday }}
          注册时间：{{ item.user_snapshot.regtime }}
          <br>
          商品ID：{{ item.goods_snapshot.gid }}
          商品名：{{ item.goods_snapshot.gname }}
          分类：{{ item.goods_snapshot.category }}
          价格：{{ item.goods_snapshot.price }}
          详情：{{ item.goods_snapshot.details }}
          备注：{{ item.goods_snapshot.remarks }}
        </td>

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

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">确定删除该订单？</v-card-title>
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
        <!--        <v-btn text @click="openDialogUser(item.index)">用户快照</v-btn>-->
        <!--        <v-btn text>商品快照</v-btn>-->
        <!--        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>-->
        <v-btn :loading="loading" v-if="item.state==0" @click="pay(item)" color="warning">立即付款</v-btn>
        <v-btn :loading="loading" v-if="item.state!=2" @click="closeOrder(item)" color="error">取消订单
        </v-btn>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getOrdersByAll()"> 当前无订单-点此刷新</v-btn>
      </template>
    </v-data-table>
    <v-snackbar v-model="snackbar">
      {{ message }}
    </v-snackbar>
  </v-container>

</template>

<script>
export default {
  name: "User-Order",
  components: {},
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    loading: false,
    message: "",
    snackbar: false,
    headers: [
      {
        text: "订单ID",
        align: "start",
        sortable: true,
        value: "oid",
      },

      {text: "商品ID", value: "gid"},
      {text: "商品名称", value: "goods_snapshot.gname"},
      {text: "订单时间", value: "ordertime"},
      {text: "折扣", value: "discount"},
      {text: "应付", value: "price"},
      {text: "实付", value: "pay"},
      {text: "用户id", value: "uid"},
      {text: "用户名", value: "user_snapshot.uname"},
      {text: "手机号", value: "user_snapshot.phone"},
      {text: "状态", value: "state"},
      {text: '展开快照', value: 'data-table-expand'},
      {text: "操作", value: "actions", sortable: false},
    ],
    orders: [],
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  mounted() {
    this.getOrdersByAll();
    //this.initialize();
  },

  methods: {
    getOrdersByAll() {
      this.$axios
          .get("/order")
          .then((response) => {
            let that = this;
            if (response.data.code == 200) {
              that.loading = false;
              let orders = response.data.data;
              for (let i = 0; i < response.data.data.length; i++) {
                response.data.data[i].goods_snapshot = JSON.parse(response.data.data[i].goods_snapshot);
                response.data.data[i].user_snapshot = JSON.parse(response.data.data[i].user_snapshot);
              }
              that.orders = orders;
            }
          })
          .catch((failResponse) => {
            console.log(failResponse);
          });
    },
    pay(order) {
      this.loading = true;
      this.$axios
          .get("/order/" + order.oid + "/pay")
          .then((response) => {
            let that = this;
            if (response.data.code == 200) {
              that.message = response.data.meg;
              that.snackbar = true;
            } else {
              that.message = "失败，错误信息：" + response.data.meg;
              that.snackbar = true;
            }
          })
          .catch((failResponse) => {
            let that = this;
            that.message = "失败，错误信息：" + failResponse;
            that.snackbar = true;
          });
      setTimeout(() => {
        this.getOrdersByAll();
        this.loading = false;
      }, 2000);
    },
    closeOrder(order) {
      if (confirm("确定取消订单吗？")) {
        this.loading = true;
        this.$axios
            .get("/order/" + order.oid + "/close")
            .then((response) => {
              let that = this;
              if (response.data.code == 200) {
                that.message = response.data.meg;
                that.snackbar = true;
              } else {
                that.message = "失败，错误信息：" + response.data.meg;
                that.snackbar = true;
              }
            })
            .catch((failResponse) => {
              let that = this;
              that.message = "失败，错误信息：" + failResponse;
              that.snackbar = true;
            });
      }
      setTimeout(() => {
        this.getOrdersByAll();
        this.loading = false;
      }, 2000);
    },
    initialize() {
      this.orders = [
        {
          oid: 1,
          uid: 1,
          gid: 2,
          ordertime: "2020-04-22 12:00:00",
          state: 0,
          price: 3.00,
          discount: 1.00,
          pay: 3.00,
          goods_snapshot: {
            gid: 2,
            gname: "薯片",
            price: 3.00,
            category: 2,
            total: 100,
            state: 0,
            stock: 99,
            remarks: "薯片好哈",
            details: "薯片薯片薯片薯片薯片",
            pic: "123",
          },
          user_snapshot: {
            birthday: "2002-06-02",
            email: "1277@qq.com",
            logo: "1",
            password: "1",
            phone: "18156551486",
            regtime: "2021-04-01",
            type: 1,
            uname: "张东祥",
            uid: 1,
          },
        },
        {
          oid: 2,
          uid: 1,
          gid: 2,
          ordertime: "2020-04-22 12:00:00",
          state: 1,
          price: 3.00,
          discount: 1.00,
          pay: 3.00,
          goods_snapshot: {
            gid: 2,
            gname: "薯片",
            price: 3.00,
            category: 2,
            total: 100,
            state: 0,
            stock: 99,
            remarks: "薯片好哈",
            details: "薯片薯片薯片薯片薯片",
            pic: "123",
          },
          user_snapshot: {
            birthday: "2002-06-02",
            email: "1277@qq.com",
            logo: "1",
            password: "1",
            phone: "18156551486",
            regtime: "2021-04-01",
            type: 1,
            uname: "张东祥",
            uid: 1,
          },
        },
        {
          oid: 2,
          uid: 1,
          gid: 2,
          ordertime: "2020-04-22 12:00:00",
          state: 2,
          price: 3.00,
          discount: 1.00,
          pay: 3.00,
          goods_snapshot: {
            gid: 2,
            gname: "薯片",
            price: 3.00,
            category: 2,
            total: 100,
            state: 0,
            stock: 99,
            remarks: "薯片好哈",
            details: "薯片薯片薯片薯片薯片",
            pic: "123",
          },
          user_snapshot: {
            birthday: "2002-06-02",
            email: "1277@qq.com",
            logo: "1",
            password: "1",
            phone: "18156551486",
            regtime: "2021-04-01",
            type: 1,
            uname: "张东祥",
            uid: 1,
          },
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
      //console.log(this.orders);
      for (let i = 0; i < this.orders.length; i++) {
        const good = this.orders[i];
        good.categoryName = this.categoryMap.get(good.category);
      }
    },
  },
};
</script>