<template>
	<!-- 自定义顶部导航栏 -->
	<pageHeader/>
</template>

<script>
	//引入pageHeader作为组件
	import pageHeader from './pageHeader.vue';
	//接口引进来
	import interfaces from '../../../utils/interfaces.js'
	export default{
		data(){
			return {
				swiperList:[],这里用来存储轮播数组,
				category:[],//分类
				promation:[]//活动
			}
		},
		components:{
			pageHeader
		},
		onLoad() {
			//初始化执行下拿取数据
			this.initData();
		},
		methods:{
			initData(){
				uni.request({
				    url: interfaces.getMallData,
				    success: (res) => {
				        this.swiperList=res.data.swiperList;
						this.category=res.data.category;
						this.promation=res.data.promation;
				    }
				});
			}
		}
	}
</script>

<style lang="scss">
	
</style>
