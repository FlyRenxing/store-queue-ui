(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0ae5d6"],{"0a6e":function(t,o,a){"use strict";a.r(o);var e=function(){var t=this,o=t.$createElement,a=t._self._c||o;return a("v-container",[a("div",[a("h1",[t._v("仪表盘")]),a("v-row",{staticStyle:{position:"relative",top:"10px"}},[a("v-col",{attrs:{cols:"12",sm:"6",md:"3"}},[a("v-card",{attrs:{light:"",height:"80",color:"deep-purple lighten-3"}},[a("v-card-text",[a("h2",[t._v("订单总数："+t._s(t.info.orderNum))])])],1)],1),a("v-col",{attrs:{cols:"12",sm:"6",md:"3"}},[a("v-card",{attrs:{light:"",height:"80",color:"light-green accent-2"}},[a("v-card-text",[a("h2",[t._v("订单总额："+t._s(t.info.gvm))])])],1)],1),a("v-col",{attrs:{cols:"12",sm:"6",md:"3"}},[a("v-card",{attrs:{light:"",height:"80",color:"cyan accent-1"}},[a("v-card-text",[a("h2",[t._v("商品总数："+t._s(t.info.goodsNum))])])],1)],1),a("v-col",{attrs:{cols:"12",sm:"6",md:"3"}},[a("v-card",{attrs:{light:"",height:"80",color:"deep-orange lighten-1"}},[a("v-card-text",[a("h2",[t._v("用户总数："+t._s(t.info.userNum))])])],1)],1)],1),a("v-row",[a("v-col",[t._v(" 假装我是个图表=。= ")])],1)],1)])},n=[],r={name:"Admin-Dashboard",components:{},data:function(){return{info:{orderNum:0,gmv:0,goodsNum:0,userNum:0}}},mounted:function(){this.getInfo()},methods:{getInfo:function(){var t=this;this.$axios.get("/admin/dashboard").then((function(o){var a=t;if(200==o.data.code){var e=o.data.data;a.info=e}})).catch((function(t){console.log(t)}))}}},c=r,s=a("2877"),i=a("6544"),d=a.n(i),l=a("b0af"),h=a("99d9"),v=a("62ad"),u=a("a523"),m=a("0fd9"),g=Object(s["a"])(c,e,n,!1,null,null,null);o["default"]=g.exports;d()(g,{VCard:l["a"],VCardText:h["b"],VCol:v["a"],VContainer:u["a"],VRow:m["a"]})}}]);
//# sourceMappingURL=chunk-2d0ae5d6.6a4ac4cd.js.map