(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/goods/goods"],{"30e9":function(o,n,t){},"35a6":function(o,n,t){"use strict";(function(o){t("94a9"),t("921b");e(t("66fd"));var n=e(t("4683"));function e(o){return o&&o.__esModule?o:{default:o}}o(n.default)}).call(this,t("543d")["createPage"])},4683:function(o,n,t){"use strict";t.r(n);var e=t("76bf"),s=t("cd76");for(var c in s)"default"!==c&&function(o){t.d(n,o,(function(){return s[o]}))}(c);t("6b18");var u,i=t("f0c5"),a=Object(i["a"])(s["default"],e["b"],e["c"],!1,null,null,null,!1,e["a"],u);n["default"]=a.exports},"6b18":function(o,n,t){"use strict";var e=t("30e9"),s=t.n(e);s.a},"76bf":function(o,n,t){"use strict";var e={popupSpec:function(){return t.e("components/popupSpec/popupSpec").then(t.bind(null,"9a7a"))}},s=function(){var o=this,n=o.$createElement;o._self._c;o._isMounted||(o.e0=function(n){o.spaceInfo.showSpace=!0})},c=[];t.d(n,"b",(function(){return s})),t.d(n,"c",(function(){return c})),t.d(n,"a",(function(){return e}))},cd76:function(o,n,t){"use strict";t.r(n);var e=t("e59b"),s=t.n(e);for(var c in e)"default"!==c&&function(o){t.d(n,o,(function(){return e[o]}))}(c);n["default"]=s.a},e59b:function(o,n,t){"use strict";(function(o){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e=s(t("7d29"));function s(o){return o&&o.__esModule?o:{default:o}}var c=function(){t.e("pages/goods/goodsHeader").then(function(){return resolve(t("b755"))}.bind(null,t)).catch(t.oe)},u=function(){t.e("components/popupSpec/popupSpec").then(function(){return resolve(t("9a7a"))}.bind(null,t)).catch(t.oe)},i={data:function(){return{isKeep:!1,goodsData:{swiperList:[],spec:[],comment:[{face:"",content:"",username:""}],descriptionStr:""},goodsInfo:{name:"",price:"",number:1,spec:""},currentSwiper:0,spaceInfo:{showSpace:!1}}},onLoad:function(n){n.goodsInfo?(this.goodsInfo=JSON.parse(n.goodsInfo),this.initData()):o.switchTab({url:"../tabBar/category/category"})},components:{goodsHeader:c,popupSpec:u},methods:{initData:function(){var o=this;this.request({url:e.default.getGoods,success:function(n){o.goodsData=n.data}})},swiperChange:function(o){this.currentSwiper=o.detail.current},setSelectSpec:function(o){this.goodsInfo.spec=o},hideSpec:function(){this.spaceInfo.showSpace=!1},add:function(){this.goodsInfo.number++},sub:function(){this.goodsInfo.number<=1||this.goodsInfo.number--},handleRatings:function(){o.setStorageSync("comments",this.goodsData.comment),o.navigateTo({url:"./ratings"})},keep:function(){this.isKeep=!this.isKeep,this.isKeep?o.showToast({icon:"success",title:"收藏成功"}):o.showToast({icon:"success",title:"取消收藏"})},joinCart:function(){var n=this;o.getStorage({key:"goodsList",success:function(o){var t=o.data,e=!1;t.forEach((function(o){o.goods_id==n.goodsInfo.goods_id&&o.spec==n.goodsInfo.spec&&(o.number+=Number(n.goodsInfo.number),e=!0)})),e||t.push(n.goodsInfo),n.setGoodsList(t)},fail:function(o){var t=[];t.push(n.goodsInfo),n.setGoodsList(t)}})},setGoodsList:function(n){o.setStorage({key:"goodsList",data:n,success:function(){o.showToast({icon:"success",title:"添加购物车成功"})}})},handleBuy:function(){var n=[];n.push(this.goodsInfo),o.setStorage({key:"confirmList",data:n,success:function(){o.navigateTo({url:"../order/order"})}})}}};n.default=i}).call(this,t("543d")["default"])}},[["35a6","common/runtime","common/vendor"]]]);