<template>
	<view>
		<!-- 如果不放置状态栏，这里的这个组件会上移，主要会体现在 移动端 -->
		<!-- 状态栏 -->
		<page-status></page-status>
		<goodsHeader></goodsHeader>
		<!-- 轮播图 -->
		<view class="swiper-box">
			<swiper circular="true" autoplay="true" @change="swiperChange">
				<swiper-item v-for="swiper in goodsData.swiperList" :key="swiper.id">
					<image :src="swiper.img"></image>
				</swiper-item>
			</swiper>
			<!-- 轮播指示图 -->
			<view class="indicator">
				{{currentSwiper+1}}/{{goodsData.swiperList.length}}
			</view>
		</view>
		<!-- 标题和价格 -->
		<view class="info-box goods-info">
			<view class="price">${{goodsInfo.price}}</view>
			<view class="title">{{goodsInfo.name}}</view>
		</view>
		<!-- 选择规格 -->
		<view class="info-box">
			<view class="row" @tap="spaceInfo.showSpace=true">
				<view class="text">选择</view>
				<view class="content">
					<view>选择规格:</view>
					<view class="sp">
						<view :class="{'on':item == goodsInfo.spec}" v-for="(item , index) in goodsData.spec" :key="index">
							{{item}}
						</view>
					</view>
				</view>
				<!-- 箭头 -->
				<view class="arrow">
					<view class="icon iconfont">&#xe6a3;</view>
				</view>
			</view>
		</view>
		<!-- 摸态框 -->
		<popupSpec :spaceInfo="spaceInfo" :goodsInfo="goodsInfo" :goodsData="goodsData"></popupSpec>
		<!-- 评价 -->
		<view class="info-box comments">
			<view class="row">
				<view class="text">商品评价({{goodsData.comment.length}})</view>
				<view class="arrow">
					<view class="show" @tap="handleRatings">
						查看全部
						<view class="icon iconfont">&#xe6a3;</view>
					</view>
				</view>
			</view>
			<view class="comment" @tap="handleRatings">
				<view class="user-info">
					<view class="face">
						<image :src="goodsData.comment[0].face"></image>
					</view>
					<view class="username">{{goodsData.comment[0].username}}</view>
				</view>
				<view class="content">
					{{goodsData.comment[0].content}}
				</view>
			</view>
		</view>
		<!-- 商品详情 -->
		<view class="description">
			<view class="title">————商品详情————</view>
			<view class="content">
				<!-- 可以插入元素节点 -->
				<rich-text :nodes="goodsData.descriptionStr"></rich-text>
			</view>
		</view>
		<!-- 底部菜单 -->
		<view class="footer">
			<view class="icons">
				<view class="box">
					<view class="icon iconfont">&#xe7e0;</view>
					<view class="text">分享</view>
				</view>
				<view class="box" @tap="keep">
					<view class="icon iconfont" v-if="isKeep">&#xe64b;</view>
					<view class="icon iconfont" v-else>&#xe64c;</view>
					<view class="text">{{isKeep?"已":''}}收藏</view>
				</view>
			</view>
			<view class="btn">
				<view @tap="joinCart" class="joinCart">加入购物车</view>
				<view class="buy">立即购买</view>
			</view>
		</view>
	</view>
</template>

<script>
	import goodsHeader from "./goodsHeader.vue";
	import interfaces from '../../utils/interfaces.js';
	import popupSpec from '../../components/popupSpec.vue'
	export default{
		data(){
			return{
				isKeep:false,//收藏开关
				currentSwiper:0,//轮播图下标
				goodsData:{//包含轮播图 规格 评论 详情
					swiperList:[],
					spec:[],
					comment:[
						{face:"",content:"",username:""}
					],
					descriptionStr:"",
				},
				goodsInfo:{//包含名字 价格 数量 规格
					name:"",
					price:"",
					number:1,
					spec:""
				},
				spaceInfo: {
					showSpace: false
				}
			}
		},
		components:{
			goodsHeader,
			popupSpec
		},
		onLoad(option){
			// console.log(option);
			this.goodsInfo = JSON.parse(option.goodsInfo)
			this.initDate()
		},
		methods:{
			initDate(){
				this.request({
					url:interfaces.getGoods,
					success:((res)=>{
						// console.log(res.data);
						this.goodsData=res.data
					})
				})
			},
			swiperChange(event){
				this.currentSwiper=event.detail.current;
			},
			//查看所有评价
			handleRatings(){
				// 本地存储
				//uni的本地同步存储uni.setStorageSync(key名，value值)
				uni.setStorageSync('comments',this.goodsData.comment);
				uni.navigateTo({
					url:'./ratings'
				})
			},
			keep(){
				this.isKeep=!this.isKeep;
				if(this.isKeep){
					uni.showToast({
						title:"已收藏",
						icon:"success"
					})
				}else{
					uni.showToast({
						title:"取消收藏",
						icon:"success"
					})
				}
			},
			joinCart(){//加入购物车
				//存储到本地
				//现在本地存储去取
				uni.getStorage({
					key:"goodsList",
					success:(res=>{
						// console.log(res.data);
						// 如果是拿到的数据
						let goodsList=res.data;
						
						//定义一个开关 查找商品是够存在
						let isExist=false;
						
						//这里的遍历的作用是用来判断 你点击购物车的商品是不是同一个东西 如果是同一个东西那就数量累加 如果是同一个商品的id但是不同的规格 那就再次存储
						goodsList.forEach(goods =>{
							if(goods.goods_id==this.goodsInfo.goods_id && goods.spec==this.goodsInfo.spec){
								goods.number+=Number(this.goodsInfo.number);
								isExist=true;
							}
							
						})
						if(!isExist){
							goodsList.push(this.goodsInfo);
							//跟新本地存储
							this.setGoodsList(goodsList);
						}
						
					}),
					fail:(err=>{//第一次加入购物车 没有得到数据 所以fail就存储
					
						let goodsList=[];
						//将goodInfo 信息放到定义的空数组里 准备存入本地存储
						goodsList.push(this.goodsInfo);
						
						//本地存储中存储数据
						this.setGoodsList(goodsList);
					})
				})
			},
			setGoodsList(goodsList){
				//往本地存储 存储数据
				uni.setStorage({
					key:"goodsList",
					data:goodsList,
					success:function(){
						uni.showToast({
							icon:"success",
							title:"添加成功"
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	/*  修改状态栏样式 如果是移动端那就添加一个opacity的属性*/
	.status {
		/* #ifdef APP-PLUS */
			opacity: 0;
		/* #endif */
	}

	.swiper-box {
		position: relative;
		width: 100%;
		height: 100vw;

		swiper {
			width: 100%;
			height: 100vw;

			swiper-item {
				image {
					width: 100%;
					height: 100vw;
				}
			}
		}

		.indicator {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 25upx;
			height: 40upx;
			border-radius: 40upx;
			font-size: 22upx;
			position: absolute;
			bottom: 20upx;
			right: 20upx;
			color: #fff;
			background-color: rgba(0, 0, 0, 0.2);
		}
	}

	.info-box {
		width: 92%;
		padding: 20upx 4%;
		background-color: #fff;
		margin-bottom: 20upx;
	}

	.goods-info {
		.price {
			font-size: 46upx;
			font-weight: 600;
			color: #f47925;
		}

		.title {
			font-size: 30upx;
		}
	}

	.row {
		width: 100%;
		display: flex;
		align-items: center;
		margin: 0 0 30upx 0;

		.text {
			font-size: 28upx;
			color: #a2a2a2;
			margin-right: 20upx;
		}

		.content {
			font-size: 28upx;
			display: flex;
			flex-wrap: wrap;

			.serviceitem {
				margin-right: 10upx;
			}

			.sp {
				width: 100%;
				display: flex;

				view {
					background-color: #f6f6f6;
					padding: 10upx;
					color: #999;
					margin-right: 10upx;
					font-size: 20upx;
					border-radius: 5upx;

					&.on {
						border: solid 1upx #f47952;
						padding: 4upx 8upx;
					}
				}
			}
		}

		.arrow {
			position: absolute;
			right: 4%;

			.icon {
				color: #ccc;
			}
		}
	}

	.comments {
		.row {
			width: 100%;
			height: 40upx;
			display: flex;
			align-items: center;
			margin: 0 0 30upx 0;

			.text {
				font-size: 30upx;
			}

			.arrow {
				font-size: 28upx;
				position: absolute;
				right: 4%;
				color: #17e6a1;

				.show {
					display: flex;
					align-items: center;

					.icon {
						color: #17e6a1;
					}
				}
			}
		}

		.comment {
			width: 100%;

			.user-info {
				width: 100%;
				height: 40upx;
				display: flex;
				align-items: center;

				.face {
					width: 40upx;
					height: 40upx;
					margin-right: 8upx;

					image {
						width: 40upx;
						height: 40upx;
						border-radius: 100%;
					}
				}

				.username {
					font-size: 24upx;
					color: #999;
				}
			}

			.content {
				margin-top: 10upx;
				font-size: 26upx;
			}
		}
	}

	.description {
		.title {
			width: 100%;
			height: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: #999;
		}
	}

	.footer {
		position: fixed;
		bottom: 0upx;
		width: 92%;
		padding: 0 4%;
		height: 99upx;
		border-top: solid 1upx #eee;
		background-color: #fff;
		z-index: 2;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.icons {
			display: flex;
			height: 80upx;
			margin-left: -4%;

			.box {
				width: 80upx;
				height: 80upx;
				display: flex;
				justify-content: center;
				flex-wrap: wrap;

				.icon {
					font-size: 40upx;
					color: #828282;
				}

				.text {
					display: flex;
					justify-content: center;
					width: 100%;
					font-size: 22upx;
					color: #666;
				}
			}
		}

		.btn {
			height: 80upx;
			border-radius: 40upx;
			overflow: hidden;
			display: flex;
			margin-right: -2%;

			.joinCart,
			.buy {
				height: 80upx;
				padding: 0 40upx;
				color: #fff;
				display: flex;
				align-items: center;
				font-size: 28upx;
			}

			.joinCart {
				background-color: #f0b46c;
			}

			.buy {
				background-color: #f06c7a;
			}
		}
	}
</style>

