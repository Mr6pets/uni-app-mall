(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/order/cofirm"],{"47c2":function(t,e,o){"use strict";o.r(e);var n=o("a452"),r=o.n(n);for(var c in n)"default"!==c&&function(t){o.d(e,t,(function(){return n[t]}))}(c);e["default"]=r.a},"9c84":function(t,e,o){"use strict";(function(t){o("84c0"),o("921b");n(o("66fd"));var e=n(o("bd6b"));function n(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,o("543d")["createPage"])},a452:function(t,e,o){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o={data:function(){return{goodsList:[],goodsPrice:0,sumPrice:0,freight:12}},onShow:function(){var e=this;t.getStorage({key:"comfirmList",success:function(t){e.goodsList=t.data;for(var o=0;o<e.goodsList.length;o++)e.goodsPrice=e.goodsPrice+e.goodsList[o].number*e.goodsList[o].price;e.sumPrice=e.goodsPrice+e.freight}})},filters:{toFixed:function(t){return parseFloat(t).toFixed()}},onBackPress:function(){this.clearOrder()},methods:{clearOrder:function(){var e=this;t.removeStorage({key:"conformList",success:function(t){e.goodsList=[]}})}}};e.default=o}).call(this,o("543d")["default"])},bd6b:function(t,e,o){"use strict";o.r(e);var n=o("eef6"),r=o("47c2");for(var c in r)"default"!==c&&function(t){o.d(e,t,(function(){return r[t]}))}(c);o("ca62");var i,u=o("f0c5"),s=Object(u["a"])(r["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],i);e["default"]=s.exports},ca62:function(t,e,o){"use strict";var n=o("da59"),r=o.n(n);r.a},da59:function(t,e,o){},eef6:function(t,e,o){"use strict";var n,r=function(){var t=this,e=t.$createElement,o=(t._self._c,t._f("toFixed")(t.goodsPrice)),n=t._f("toFixed")(t.freight),r=t._f("toFixed")(t.sumPrice);t.$mp.data=Object.assign({},{$root:{f0:o,f1:n,f2:r}})},c=[];o.d(e,"b",(function(){return r})),o.d(e,"c",(function(){return c})),o.d(e,"a",(function(){return n}))}},[["9c84","common/runtime","common/vendor"]]]);