(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/tabBar/user/qrcode"],{"01f9":function(t,n,e){"use strict";var o=e("0742"),u=e.n(o);u.a},"06f5":function(t,n,e){"use strict";e.r(n);var o=e("ca58"),u=e.n(o);for(var a in o)"default"!==a&&function(t){e.d(n,t,(function(){return o[t]}))}(a);n["default"]=u.a},"0742":function(t,n,e){},"1db4":function(t,n,e){"use strict";(function(t){e("84c0"),e("921b");o(e("66fd"));var n=o(e("c577"));function o(t){return t&&t.__esModule?t:{default:t}}t(n.default)}).call(this,e("543d")["createPage"])},c577:function(t,n,e){"use strict";e.r(n);var o=e("f9d7"),u=e("06f5");for(var a in u)"default"!==a&&function(t){e.d(n,t,(function(){return u[t]}))}(a);e("01f9");var c,i=e("f0c5"),r=Object(i["a"])(u["default"],o["b"],o["c"],!1,null,null,null,!1,o["a"],c);n["default"]=r.exports},ca58:function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e={data:function(){return{savePhotos:"保存到相册",showBtn:!1}},onLoad:function(){},methods:{handleSavePhotos:function(){var n=this;this.savePhotos="正在保存...";var e=this.$mp.page.$getAppWebview(),o=new plus.nativeObj.Bitmap;this.showBtn=!1,this.$nextTick((function(){setTimeout((function(){e.draw(o,(function(e){o.save("_doc/Qr.jpg",{overwrite:!0,quality:100},(function(e){plus.gallery.save(e.target,(function(e){t.showToast({title:"保存成功"}),n.savePhotos="保存到相册",o.clear()}))}))}),(function(t){console.log("保存图片失败")}),(function(t){console.log("bitmap 绘制图片失败")}))}),200)}))}}};n.default=e}).call(this,e("543d")["default"])},f9d7:function(t,n,e){"use strict";var o,u=function(){var t=this,n=t.$createElement;t._self._c},a=[];e.d(n,"b",(function(){return u})),e.d(n,"c",(function(){return a})),e.d(n,"a",(function(){return o}))}},[["1db4","common/runtime","common/vendor"]]]);