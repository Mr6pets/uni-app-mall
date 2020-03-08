<template>
	<view>
		<view class="header">
			<view class="target" v-for="(target,index) in filterByList" :key="index" :class="{'on':target.selected}" @tap="handleSelct(index)">
				{{target.text}}
			</view>
		</view>	
		<!-- 占位 -->
		<view class="place"></view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="product-list">
				<view class="product" v-for="goods in goodsList" :key="goods.goods_id" @tap="handleGoods(goods)">
					<!-- mode="widthFix" 表示宽度不变 -->
					<image :src="goods.img" mode="widthFix"></image>
					<view class="name">{{goods.name}}</view>
					<view class="info">
						<view class="price">
							<text>$</text>
							{{goods.price}}
						</view>
						<view class="slogan">
							{{goods.slogan}}
						</view>
					</view>
				</view>
			</view>
			<view class="loading-text">
				{{loadingText}}
			</view>
		</view>
		
	</view>
</template>

<script>
	import interfaces from '../../utils/interfaces.js';
	export default{
		data(){
			return{
				filterByList:[
					{text:'全部',selected:true,filterby:"all"},
					{text:'口碑',selected:false,filterby:"public"},
					{text:'热门',selected:false,filterby:"hot"}
				],
				goodsList:[],//所有商品列表存放的地方
				filterby:"all",//默认选择的tab
				page:1,//默认请求第一页
				size:6,//默认请求6组数据
				loadingText:"正在加载数据...."
			}	
		},
		methods:{
			//点击进入商品详情页
			handleGoods(goods){
				uni.navigateTo({
					url:'./goods?goodsInfo='+JSON.stringify(goods)
				})
			},
			handleSelct(index){
				this.filterByList[index].selected=true;
				//其他内容selected为false
				for(let i=0;i<this.filterByList.length;i++){
					if(i!=index){
						this.filterByList[i].selected=false;
					}
				};
				//点击全部 口碑 热门 分别请求数据
				this.filterby=this.filterByList[index].filterby;
				this.page=1;
				this.loadingText="加载中....";
				this.goodsList=[];
				this.loadData();
			},
			loadData(){
				//请求接口示例：https://uniapp-interface.herokuapp.com/api/profiles/goodslist/all/1/6
				//这里请求的接口需要带值，这个值不是死的，所以 我们需要在data中定义这几个值。请求的类型（fileterby:"all",page:1,size:6）
				//在URL中进行拼接
				this.request({
					url:`${interfaces.getGoodsList}/${this.filterby}/${this.page}/${this.size}`,
					success:((res)=>{
						// this.goodsList=res.data;
						// console.log(this.goodsList);
						if(res.data.length>0){//如果请求的数据是有值的，那么遍历每个对象放到goodsList这个大的数组中；
							res.data.forEach(item=>{
								this.goodsList.push(item);
							})
						}else{//如果请求的数据length值都小于0了 那就改动laodingTex的值提示没有数据了或者是到底了
							this.loadingText="你触碰到我的底线了"
						}
						
					})
				})
			}
		},
		//页面进入就会执行
		onLoad(option) {
			// console.log(option);
			//动态修改packge.json中navigater title
			uni.setNavigationBarTitle({
				title:option.name
			})
			//加载数据
			this.loadData();
		},
		//下拉刷新
		onPullDownRefresh(){
			// 思路就是重新请求数据
			setTimeout(()=>{
				this.page=1;
				this.loadingText="加载中....";
				this.goodsList=[];
				this.loadData();
				uni.stopPullDownRefresh();
			},1000)
		},
		//上拉加载
		onReachBottom() {
			this.page++;
			this.loadData();
			
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
