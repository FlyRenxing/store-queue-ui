<template>
  <v-container>
    <h1>用户管理</h1>
    <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        sort-by="uid"
        sort-desc=true
        class="elevation-1"
    >
      <template v-slot:[`item.type`]="{ item }">
        <v-switch
          :true-value="1"
          :false-value="0"
          v-model="item.type"
          readonly
          @click="editItem(item)"
        ></v-switch>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>用户列表</v-toolbar-title>
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
                添加用户
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
                <v-spacer></v-spacer>
                是否为管理员：
                <v-switch
                  :true-value="1"
                  :false-value="0"
                  v-model="editedItem.type"
                ></v-switch>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-text-field
                        v-model="editedItem.uname"
                        label="用户名"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field
                        v-model="editedItem.password"
                        label="密码"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field
                        v-model="editedItem.phone"
                        label="手机"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field
                        v-model="editedItem.email"
                        label="E-mail"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-dialog
                        ref="dialog"
                        v-model="modal"
                        :return-value.sync="editedItem.birthday"
                        width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.birthday"
                            label="生日"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="editedItem.birthday"
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
                            @click="$refs.dialog.save(editedItem.birthday)"
                          >
                            确定
                          </v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field
                        v-model="editedItem.logo"
                        label="用户头像(URL)"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close"> 取消 </v-btn>
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
              <v-card-title class="headline">确定删除该用户？</v-card-title>
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
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getUsersByAll"> 当前无用户-点此刷新 </v-btn>
      </template>
    </v-data-table>
    <v-snackbar v-model="snackbar">
      {{ message }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: "Admin-User",
  components: {},
  data: () => ({
    message: "",
    snackbar: false,
    loading: false,
    modal: false,
    search: "",
    dialog: false,
    addressDialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "用户ID",
        align: "start",
        sortable: true,
        value: "uid",
      },
      { text: "用户名", value: "uname" },
      { text: "手机", value: "phone" },
      { text: "邮箱", value: "email" },
      { text: "生日", value: "birthday" },
      { text: "是否管理员", value: "type", sortable: false },
      { text: "操作", value: "actions", sortable: false },
    ],
    users: [],
    editedIndex: -1,
    editedItem: {
      birthday: "2002-06-02",
      email: "",
      logo: "",
      password: "",
      phone: "",
      regtime: "",
      type: 0,
      uname: "",
      uid: 0,
    },
    defaultItem: {
      birthday: "2002-06-02",
      email: "",
      logo: "",
      password: "",
      phone: "",
      regtime: "",
      type: 0,
      uname: "",
      uid: 0,
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "添加用户"
        : "编辑用户(uid:" + this.editedItem.uid + ")";
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
    this.getUsersByAll();
    //this.initialize();
    //this.objToMap(this.$store.state.users.category);
    //this.addCategoryName();
  },

  methods: {
    getUsersByAll() {
      this.$axios
        .get("/user/all")
        .then((response) => {
          let that = this;
          if (response.data.code == 200) {
            that.loading = false;
            let users = response.data.data;
            that.users = users;
          }
        })
        .catch((failResponse) => {
          console.log(failResponse);
        });
    },
    newUser() {
      this.loading = true;
      let data = new FormData();
      data.append("uname", this.editedItem.uname);
      data.append("password", this.editedItem.password);
      data.append("phone", this.editedItem.phone);
      data.append("email", this.editedItem.email);
      data.append("birthday", this.editedItem.birthday);
      data.append("type", this.editedItem.type);
      data.append("logo", this.editedItem.logo);

      this.$axios
        .post("/user/new", data)
        .then((response) => {
          let that = this;
          that.loading = false;
          if (response.data.code == 200) {
            that.message = response.data.meg;
            that.snackbar = true;
            that.getUsersByAll();
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
    editUser() {
      this.loading = true;
      let data = new FormData();
      data.append("uid", this.editedItem.uid);
      data.append("uname", this.editedItem.uname);
      data.append("password", this.editedItem.password);
      data.append("phone", this.editedItem.phone);
      data.append("email", this.editedItem.email);
      data.append("birthday", this.editedItem.birthday);
      data.append("type", this.editedItem.type);
      data.append("logo", this.editedItem.logo);

      this.$axios
        .post("/user/edit", data)
        .then((response) => {
          let that = this;
          that.loading = false;
          if (response.data.code == 200) {
            that.message = response.data.meg;
            that.snackbar = true;
            that.getUsersByAll();
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
    deleteUser(uid) {
      this.loading = true;

      this.$axios
        .get("/user/delete?uid=" + uid)
        .then((response) => {
          let that = this;
          that.loading = false;
          if (response.data.code == 200) {
            that.message = response.data.meg;
            that.snackbar = true;
            that.getUsersByAll();
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
    initialize() {
      this.users = [];
    },

    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      //this.users.splice(this.editedIndex, 1);
      this.deleteUser(this.editedItem.uid);
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
        this.newUser();
      } else {
        this.editUser();
      }
    },
  },
};
</script>

