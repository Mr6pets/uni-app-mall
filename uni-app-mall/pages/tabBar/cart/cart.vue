<template>
	<view>
		<view class="goods-list">
			<view class="empty" v-show="goodsList.length==0">购物车啥也没有,心里没点逼数吗...</view>
			<view class="row" v-for="(item,index) in goodsList" :key="index">
				<!-- 删除按钮 -->
				<view class="menu" >
					<view class="icon iconfont">&#xe6a6;</view>
				</view>
				<!-- 商品 -->
				<view class="production" 
				@touchstart="handleTouchStart(index,$event)"
				@touchmove="handleTouchMove(index,$event)"
				@touchend="handleTouchEnd(index,$event)"
				:class="[theIndex==index ? 'open' : oldIndex==index ? 'close' : '']">
					<!-- checkbox -->
					<view class="container" @tap="handleCheckbox(item)">
						<view class="checkbox">
							<view :class="{'on':item.selected}"></view>
						</view>
					</view>
					<!-- 商品详情 -->
					<view class="goods-info" @tap="handleGoodsInfo(item)">
						<view class="img">
							<image :src="item.img"></image>
						</view>
						<view class="info">
							<view class="title">{{item.name}}</view>
							<view class="spec">{{item.spec}}</view>
							<view class="price-number">
								<view class="price">￥{{item.price}}</view>
								<counter :goodsInfo="item"/>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部菜单 -->
		<view class="footer" :style="{bottom:footerbottom}">
			<!-- checkbox -->
			<view class="container">
				<view class="checkbox">
					<view></view>
				</view>
			</view>
			<!-- 其他的操作 -->
			<view class="delBtn">删除</view>
			<view class="settlement">
				<view class="sum">合计：<view class="money">59999</view></view>
				<view class="btn">结算0</view>
			</view>
		</view>
	</view>
</template>

<script>
	import counter from "../../../components/counter.vue"
	export default{
		data(){
			return{
				goodsList:[],
				theIndex:null,//控制滑动效果 当前滑动下标
				oldIndex:null,//上一个左滑下标
				footerbottom:0//这个用来获取底部tabbear的高度值，解决WAP端的兼容问题
			}
		},
		onLoad() {
			// 获取tabbar的高度值
			//兼容h5下的底部菜单
			// #ifdef H5
				this.footerbottom=document.getElementsByTagName("uni-tabbar")[0].offsetHeight+'px';
			// #endif
		},
		onShow() {//当页面显示的时候
		//点击加入购物车 本地有了数据 或者没有数据 点击进入购物车直接开始取本地数据
			uni.getStorage({
				key:"goodsList",
				success:(res=>{
					// console.log(res.data);
					// 将所有商品的选中状态设置为false 即未选中
					for(let i=0;i<res.data.length;i++){
						res.data[i].selected=false;
					}
					this.goodsList=res.data;
				})
			})
		},
		components:{
			counter
		},
		methods:{
			handleCheckbox(item){// 点击选中或者不选中
				// console.log(item);
				item.selected=!item.selected;
			},
			handleGoodsInfo(item){//点击跳转回详情页
				uni.navigateTo({
					url:"../../goods/goods?goodsInfo="+JSON.stringify(item)
				})
			},
			handleTouchStart(index,event){
				// console.log(event);
				// 多点触控不触发
				if(event.touches.length>1){
					//事件对象中 如果touches.length是大于1的那就是多点触发
					return
				}
				
				//当我touchStart的时候，依旧修改了关闭？？？？？这里不明白
				this.oldIndex=this.theIndex;
				this.theIndex=null;
				
				//初始化一个坐标,追加一个initXY的数组
				this.initXY = [event.touches[0].pageX, event.touches[0].pageY];
				
				
			},
			handleTouchMove(index,event){
				// 多点触控不触发
				if(event.touches.length>1){
					//事件对象中 如果touches.length是大于1的那就是多点触发
					return
				}
				
				//移动的位置
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];
				
				
				//如果滑动的位置小 ，那就不触发 Math.abs()取绝对值
				if(Math.abs(moveX)<5){
					return
				}
				
				//竖向滑动也不触发
				if(Math.abs(moveY)>Math.abs(moveX)){
					return;
				}
				
				//判断左滑
				if(moveX<0){
					this.theIndex=index;
				}
			},
			handleTouchEnd(index,event){
				
			}
		}
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		align-items: center;

		.checkbox {
			width: 35upx;
			height: 35upx;
			border-radius: 100%;
			border: solid 2upx #f06c7a;
			display: flex;
			justify-content: center;
			align-items: center;

			.on {
				width: 25upx;
				height: 25upx;
				border-radius: 100%;
				background-color: #f06c7a;
			}
		}

		.text {
			font-size: 28upx;
			margin-left: 10upx;
		}
	}


	.goods-list {
		width: 100%;
		padding: 20upx 0 120upx 0;

		.empty {
			width: 100%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
			color: #a7a7a7;
		}

		.row {
			width: calc(92%);
			height: calc(22vw + 40upx);
			margin: 20upx auto;

			border-radius: 15upx;
			box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
			display: flex;
			align-items: center;
			position: relative;
			overflow: hidden;
			z-index: 4;
			border: 0;

			.menu {
				.icon {
					color: #fff;
					font-size: 60upx;
				}

				position: absolute;
				width: 30%;
				height: 100%;
				right: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: red;
				color: #fff;
				z-index: 2;
			}

			.production {
				@keyframes showMenu {
					0% {
						transform: translateX(0);
					}

					100% {
						transform: translateX(-30%);
					}
				}

				@keyframes closeMenu {
					0% {
						transform: translateX(-30%);
					}

					100% {
						transform: translateX(0);
					}
				}

				&.open {
					animation: showMenu 0.25s linear both;
				}

				&.close {
					animation: closeMenu 0.15s linear both;
				}

				background-color: #fff;

				.container {
					padding-left: 20upx;
					flex-shrink: 0;
					height: 22vw;
					margin-right: 20upx;
				}

				position: absolute;
				width: 100%;
				padding: 0 0;
				height: 100%;
				z-index: 3;
				display: flex;
				align-items: center;

				.goods-info {
					width: 100%;
					display: flex;
					padding-right: 20upx;

					.img {
						width: 22vw;
						height: 22vw;
						border-radius: 10upx;
						overflow: hidden;
						flex-shrink: 0;
						margin-right: 10upx;

						image {
							width: 22vw;
							height: 22vw;
						}
					}

					.info {
						width: 100%;
						height: 22vw;
						overflow: hidden;
						display: flex;
						flex-wrap: wrap;
						position: relative;

						.title {
							width: 100%;
							font-size: 28upx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							// text-align: justify;
							overflow: hidden;
						}

						.spec {
							font-size: 20upx;
							background-color: #f3f3f3;
							color: #a7a7a7;
							height: 30upx;
							display: flex;
							align-items: center;
							padding: 0 10upx;
							border-radius: 15upx;
							margin-bottom: 20vw;
						}

						.price-number {
							position: absolute;
							width: 100%;
							bottom: 0upx;
							display: flex;
							justify-content: space-between;
							align-items: flex-end;
							font-size: 28upx;
							height: 60upx;

							.price {}

						}
					}
				}
			}
		}
	}

	.footer {
		width: 92%;
		padding: 0 4%;
		background-color: #fbfbfb;
		height: 100upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28upx;
		position: fixed;
		bottom: 0upx;
		z-index: 5;

		.delBtn {
			border: solid 1upx #f06c7a;
			color: #f06c7a;
			padding: 0 30upx;
			height: 50upx;
			border-radius: 30upx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.settlement {
			width: 60%;
			display: flex;
			justify-content: flex-end;
			align-items: center;

			.sum {
				width: 50%;
				font-size: 28upx;
				margin-right: 10upx;
				display: flex;
				justify-content: flex-end;

				.money {
					font-weight: 600;
				}
			}

			.btn {
				padding: 0 30upx;
				height: 50upx;
				background-color: #f06c7a;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;

				border-radius: 30upx;
			}
		}
	}
</style>

