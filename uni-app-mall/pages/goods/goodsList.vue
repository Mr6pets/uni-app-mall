<template>
	<view class="header">
		<view class="target" v-for="(target,index) in filterByList" :key="index" :class="{'on':target.selected}" @tap="handleSelct(index)">
			{{target.text}}
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				filterByList:[
					{text:'全部',selected:true,filterby:"all"},
					{text:'口碑',selected:false,filterby:"public"},
					{text:'热门',selected:false,filterby:"hot"}
				]
			}	
		},
		//页面进入就会执行
		onLoad(option) {
			// console.log(option);
			//动态修改packge.json中navigater title
			uni.setNavigationBarTitle({
				title:option.name
			})
		},
		methods:{
			handleSelct(index){
				this.filterByList[index].selected=true;
				//其他内容selected为false
				for(let i=0;i<this.filterByList.length;i++){
					if(i!=index){
						this.filterByList[i].selected=false;
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.header {
			width: 92%;
			padding: 0 4%;
			height: 79upx;
			display: flex;
			justify-content: space-around;
			align-items: flex-end;
			position: fixed;
			z-index: 10;
			background-color: #fff;
			border-bottom: solid 1upx #eee;
	
			.target {
				width: 20%;
				height: 60upx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28upx;
				margin-bottom: -2upx;
				color: #aaa;
	
				&.on {
					color: #555;
					border-bottom: 4upx solid #f06c7a;
					font-weight: 600;
					font-size: 30upx;
				}
	
				.icon {
					font-size: 26upx;
				}
			}
		}
	
		.place {
			background-color: #ffffff;
			height: 100upx;
		}
	
		.goods-list {
			.loading-text {
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 60upx;
				color: #979797;
				font-size: 24upx;
			}
	
			.product-list {
				width: 92%;
				padding: 0 4% 3vw 4%;
				column-count: 2;
				column-gap: 1em;
	
				.product {
					break-inside: avoid;
					border-radius: 20upx;
					background-color: #fff;
					margin: 0 0 15upx 0;
					box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);
	
					image {
						width: 100%;
						border-radius: 20upx 20upx 0 0;
					}
	
					.name {
						width: 92%;
						padding: 6upx 4%;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						text-align: justify;
						overflow: hidden;
						font-size: 30upx;
					}
	
					.info {
						display: flex;
						justify-content: space-between;
						align-items: flex-end;
						width: 92%;
						padding: 10upx 4% 10upx 4%;
	
						.price {
							color: #e65339;
							font-size: 30upx;
							font-weight: 600;
						}
	
						.slogan {
							color: #807c87;
							font-size: 24upx;
						}
					}
				}
	
			}
		}
</style>
