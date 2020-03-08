# uni-app-mall
这是一个基于uniapp的一个商城类的测试练习;

后台接口数据采用公用的数据接口，

uniapp取消默认的导航栏（在pages.json中设置）

~~~js
{
  "path": "pages/tabBar/home/home",
    "style": {
      "navigationBarTitleText": "首页",
        "app-plus":{//去除系统默认的导航栏样式
          "titleNView":false,
            "bounce":"none"//没有回弹效果
        }

    }
}
~~~



> ​	一些注意的知识点uniApp注册全局组件

main.js

~~~js
//引入状态栏组件
import status from './components/status.vue';

//全局注册组件(将引入的status作为全局组件page-status来使用)
Vue.component('page-status',status);
~~~



关于导航栏

uniapp：

WAP端：有自定义的导航栏，如果不想使用可以在packge.json中设置

~~~js
"style": {
				"navigationBarTitleText": "商品",
				"h5":{
					"titleNView":false//在h5的页面让导航栏的显示没有
				}
			}
~~~

移动端：

1.禁用移动端导航栏；

~~~js
"style": {
				"navigationBarTitleText": "商品",
				"app-plus":{//这里让 APP iOS端的导航栏消失
					"titleNView":false,
					"bounce":"none"
				}
			}
~~~



2.移动端有默认的状态栏，有些还是沉浸式的状态栏，所以我们需要自定义 状态栏来放置在页面上，放置我们写的会上移

状态栏：status.vue ，同时还要全局注册

~~~js
<template>
	<!-- 状态栏 -->
	<view class="status"></view>
</template>

<script>
</script>

<style lang="scss">
	.status {
		width: 100%;
		position: fixed;
		z-index: 10;
		background-color: #fff;
		top: 0;
		height: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */
	}
</style>
~~~

在main.js中全局注册

~~~js
//引入状态栏组件
import status from './components/status.vue';

//全局注册组件(将引入的status作为全局组件page-status来使用)
Vue.component('page-status',status);
~~~

