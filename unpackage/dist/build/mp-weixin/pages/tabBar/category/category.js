(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/tabBar/category/category"],{"1b10":function(t,n,e){"use strict";e.r(n);var a=e("421b"),o=e("fa61");for(var u in o)"default"!==u&&function(t){e.d(n,t,(function(){return o[t]}))}(u);e("491f");var r,c=e("f0c5"),i=Object(c["a"])(o["default"],a["b"],a["c"],!1,null,null,null,!1,a["a"],r);n["default"]=i.exports},4064:function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var a=o(e("7d29"));function o(t){return t&&t.__esModule?t:{default:t}}var u=function(){e.e("components/pageheader/pageHeader").then(function(){return resolve(e("d937"))}.bind(null,e)).catch(e.oe)},r={data:function(){return{categoryList:[],showCategoryIndex:0}},onLoad:function(){this.initData()},components:{pageHeader:u},methods:{initData:function(){var t=this;this.request({url:a.default.getCategory,success:function(n){console.log(n),t.categoryList=n.data}})},handleCategory:function(t){this.showCategoryIndex=t},handleCategoryList:function(n){console.log(n.name),t.navigateTo({url:"../../goods/goodsList?name="+n.name})}}};n.default=r}).call(this,e("543d")["default"])},"421b":function(t,n,e){"use strict";var a,o=function(){var t=this,n=t.$createElement;t._self._c},u=[];e.d(n,"b",(function(){return o})),e.d(n,"c",(function(){return u})),e.d(n,"a",(function(){return a}))},"491f":function(t,n,e){"use strict";var a=e("8f61"),o=e.n(a);o.a},"4ca1":function(t,n,e){"use strict";(function(t){e("94a9"),e("921b");a(e("66fd"));var n=a(e("1b10"));function a(t){return t&&t.__esModule?t:{default:t}}t(n.default)}).call(this,e("543d")["createPage"])},"8f61":function(t,n,e){},fa61:function(t,n,e){"use strict";e.r(n);var a=e("4064"),o=e.n(a);for(var u in a)"default"!==u&&function(t){e.d(n,t,(function(){return a[t]}))}(u);n["default"]=o.a}},[["4ca1","common/runtime","common/vendor"]]]);