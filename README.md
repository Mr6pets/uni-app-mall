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



