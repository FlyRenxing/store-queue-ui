(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d228876"],{da25:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",[a("h1",[t._v("订单管理")]),a("v-data-table",{staticClass:"elevation-1",attrs:{headers:t.headers,loading:t.loading,items:t.orders,"server-items-length":t.serverItemsLength,"sort-by":"oid","sort-desc":!0,"footer-props":{showFirstLastPage:!0,firstIcon:"mdi-arrow-collapse-left",lastIcon:"mdi-arrow-collapse-right"},"show-expand":""},on:{"update:options":t.getOrdersByOptions},scopedSlots:t._u([{key:"item.category",fn:function(e){var a=e.item;return[t._v(" "+t._s(t.categoryMap.get(a.category))+" ")]}},{key:"item.state",fn:function(e){var s=e.item;return[0==s.state?a("v-chip",{attrs:{color:"warning"}},[t._v("未付款")]):t._e(),1==s.state?a("v-chip",{attrs:{color:"success"}},[t._v("已付款")]):t._e(),2==s.state?a("v-chip",{attrs:{color:"error"}},[t._v("已取消")]):t._e()]}},{key:"expanded-item",fn:function(e){var s=e.headers,o=e.item;return[a("td",{attrs:{colspan:s.length}},[t._v(" 用户ID："+t._s(o.user_snapshot.uid)+" 用户名："+t._s(o.user_snapshot.uname)+" 电子邮箱："+t._s(o.user_snapshot.email)+" 电话："+t._s(o.user_snapshot.phone)+" 生日："+t._s(o.user_snapshot.birthday)+" 注册时间："+t._s(o.user_snapshot.regtime)+" "),a("br"),t._v(" 商品ID："+t._s(o.goods_snapshot.gid)+" 商品名："+t._s(o.goods_snapshot.gname)+" 分类："+t._s(o.goods_snapshot.category)+" 价格："+t._s(o.goods_snapshot.price)+" 详情："+t._s(o.goods_snapshot.details)+" 备注："+t._s(o.goods_snapshot.remarks)+" ")])]}},{key:"top",fn:function(){return[a("v-toolbar",{attrs:{flat:""}},[a("v-toolbar-title",[t._v("订单列表")]),a("v-divider",{staticClass:"mx-4",attrs:{inset:"",vertical:""}}),a("v-spacer"),a("v-dialog",{attrs:{"max-width":"500px"},model:{value:t.dialogDelete,callback:function(e){t.dialogDelete=e},expression:"dialogDelete"}},[a("v-card",[a("v-card-title",{staticClass:"headline"},[t._v("确定删除该订单？")]),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:t.closeDelete}},[t._v("取消 ")]),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:t.deleteItemConfirm}},[t._v("确定删除 ")]),a("v-spacer")],1)],1)],1)],1)]},proxy:!0},{key:"item.actions",fn:function(e){var s=e.item;return[a("v-icon",{attrs:{small:""},on:{click:function(e){return t.deleteItem(s)}}},[t._v("mdi-delete")])]}},{key:"no-data",fn:function(){return[a("v-btn",{attrs:{color:"primary"},on:{click:function(e){return t.getOrdersByAll()}}},[t._v(" 当前无订单-点此刷新")])]},proxy:!0}],null,!0)})],1)},o=[],i=(a("a434"),a("4ec9"),a("d3b7"),a("3ca3"),a("ddb0"),a("b64b"),a("b0c0"),{name:"Admin-Order",components:{},data:function(){return{loading:!1,dialog:!1,dialogDelete:!1,serverItemsLength:0,headers:[{text:"订单ID",align:"start",sortable:!0,value:"oid"},{text:"商品ID",value:"gid"},{text:"商品名称",value:"goods_snapshot.gname",sortable:!1},{text:"订单时间",value:"ordertime"},{text:"折扣",value:"discount"},{text:"应付",value:"price"},{text:"实付",value:"pay"},{text:"用户id",value:"uid"},{text:"用户名",value:"user_snapshot.uname",sortable:!1},{text:"手机号",value:"user_snapshot.phone",sortable:!1},{text:"状态",value:"state"},{text:"展开快照",value:"data-table-expand"},{text:"操作",value:"actions",sortable:!1}],orders:[]}},watch:{dialog:function(t){t||this.close()},dialogDelete:function(t){t||this.closeDelete()}},created:function(){this.getOrdersCountByAll()},methods:{getOrdersCountByAll:function(){var t=this;this.$axios.get("/order/allCount").then((function(e){var a=t;200==e.data.code&&(a.loading=!1,a.serverItemsLength=e.data.data)})).catch((function(t){console.log(t)}))},getOrdersByAll:function(){var t=this;this.$axios.get("/order/all/page?pageNum=1&pageSize=10").then((function(e){var a=t;if(200==e.data.code){a.loading=!1;for(var s=e.data.data,o=0;o<e.data.data.length;o++)e.data.data[o].goods_snapshot=JSON.parse(e.data.data[o].goods_snapshot),e.data.data[o].user_snapshot=JSON.parse(e.data.data[o].user_snapshot);a.orders=s}})).catch((function(t){console.log(t)}))},getOrdersByOptions:function(t){var e=this;this.loading=!0;var a="";if(console.log(t.sortBy),0!=t.sortBy.length){var s=t.sortDesc[0]?"desc":"asc";a="&pageSort="+t.sortBy[0]+" "+s}this.$axios.get("/order/all/page?pageNum="+t.page+"&pageSize="+t.itemsPerPage+a).then((function(t){var a=e;if(200==t.data.code){a.loading=!1;for(var s=t.data.data,o=0;o<t.data.data.length;o++)t.data.data[o].goods_snapshot=JSON.parse(t.data.data[o].goods_snapshot),t.data.data[o].user_snapshot=JSON.parse(t.data.data[o].user_snapshot);a.orders=s}})).catch((function(t){console.log(t)}))},initialize:function(){this.orders=[{oid:1,uid:1,gid:2,ordertime:"2020-04-22 12:00:00",state:0,price:3,discount:1,pay:3,goods_snapshot:{gid:2,gname:"薯片",price:3,category:2,total:100,state:0,stock:99,remarks:"薯片好哈",details:"薯片薯片薯片薯片薯片",pic:"123"},user_snapshot:{birthday:"2002-06-02",email:"1277@qq.com",logo:"1",password:"1",phone:"18156551486",regtime:"2021-04-01",type:1,uname:"张东祥",uid:1}},{oid:2,uid:1,gid:2,ordertime:"2020-04-22 12:00:00",state:1,price:3,discount:1,pay:3,goods_snapshot:{gid:2,gname:"薯片",price:3,category:2,total:100,state:0,stock:99,remarks:"薯片好哈",details:"薯片薯片薯片薯片薯片",pic:"123"},user_snapshot:{birthday:"2002-06-02",email:"1277@qq.com",logo:"1",password:"1",phone:"18156551486",regtime:"2021-04-01",type:1,uname:"张东祥",uid:1}},{oid:2,uid:1,gid:2,ordertime:"2020-04-22 12:00:00",state:2,price:3,discount:1,pay:3,goods_snapshot:{gid:2,gname:"薯片",price:3,category:2,total:100,state:0,stock:99,remarks:"薯片好哈",details:"薯片薯片薯片薯片薯片",pic:"123"},user_snapshot:{birthday:"2002-06-02",email:"1277@qq.com",logo:"1",password:"1",phone:"18156551486",regtime:"2021-04-01",type:1,uname:"张东祥",uid:1}}]},editItem:function(t){this.editedIndex=this.orders.indexOf(t),this.editedItem=Object.assign({},t),this.dialog=!0},deleteItem:function(t){this.editedIndex=this.orders.indexOf(t),this.editedItem=Object.assign({},t),this.dialogDelete=!0},deleteItemConfirm:function(){this.orders.splice(this.editedIndex,1),this.closeDelete()},close:function(){var t=this;this.dialog=!1,this.$nextTick((function(){t.editedItem=Object.assign({},t.defaultItem),t.editedIndex=-1}))},closeDelete:function(){var t=this;this.dialogDelete=!1,this.$nextTick((function(){t.editedItem=Object.assign({},t.defaultItem),t.editedIndex=-1}))},save:function(){this.editedIndex>-1?Object.assign(this.orders[this.editedIndex],this.editedItem):this.orders.push(this.editedItem),this.close()},objToMap:function(t){for(var e=new Map,a=0,s=Object.keys(t);a<s.length;a++){var o=s[a];e.set(t[o].id,t[o].name)}this.categoryMap=e},addCategoryName:function(){for(var t=0;t<this.orders.length;t++){var e=this.orders[t];e.categoryName=this.categoryMap.get(e.category)}}}}),r=i,n=a("2877"),d=a("6544"),l=a.n(d),c=a("8336"),h=a("b0af"),u=a("99d9"),g=a("cc20"),p=a("a523"),v=a("8fea"),m=a("169a"),f=a("ce7e"),_=a("132d"),y=a("2fa4"),b=a("71d9"),x=a("2a7f"),I=Object(n["a"])(r,s,o,!1,null,null,null);e["default"]=I.exports;l()(I,{VBtn:c["a"],VCard:h["a"],VCardActions:u["a"],VCardTitle:u["c"],VChip:g["a"],VContainer:p["a"],VDataTable:v["a"],VDialog:m["a"],VDivider:f["a"],VIcon:_["a"],VSpacer:y["a"],VToolbar:b["a"],VToolbarTitle:x["a"]})}}]);
//# sourceMappingURL=chunk-2d228876.ba5eefe3.js.map