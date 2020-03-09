<template>
	<view>
		<view class="goods-list">
			<view class="empty" v-show="goodsList.length==0">购物车啥也没有,心里没点逼数吗...</view>
			<view class="row" v-for="(item,index) in goodsList" :key="index">
				<!-- 删除按钮 -->
				<view class="menu" @tap="handleSingleDelete(item)">
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
								<counter :goodsInfo="item" @add="add(item)" @sub="sub(item)"/>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部菜单 -->
		<view class="footer" :style="{bottom:footerbottom}">
			<!-- checkbox -->
			<view class="container" @tap="handleSelectAll">
				<view class="checkbox">
					<view :class="{'on':isAllSelected}"></view>
				</view>
				<view class="text">全选</view>
			</view>
			<!-- 其他的操作 -->
			<view class="delBtn" @tap="handleMulDelete" v-if="selectedList.length>0">删除</view>
			<view class="settlement">
				<view class="sum">合计：<view class="money">￥{{sumPrice}}</view></view>
				<view class="btn" @tap="handleConfirm">结算{{selectedList.length}}</view>
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
				footerbottom:0,//这个用来获取底部tabbear的高度值，解决WAP端的兼容问题
				selectedList:[],//用来存储选中的数据
				isAllSelected:false,//判断是不是全选状态的开关
				sumPrice:'0.00'//用来显示核算的总值
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
					
					//当获取本地数据的时候，将其他的数据初始化
					this.selectedList=[];
					this.isAllSelected=false;
					this.sumPrice='0.00'
					
				})
			})
		},
		components:{
			counter
		},
		methods:{
			sub(item){//子组件传递过来的sub方法
				item.number++;
				this.sum()
			},
			add(item){//子组件传递过来的add方法
				if(item.number <= 1){
					return;
				}
				item.number--;
				this.sum();
			},
			handleCheckbox(item){// 点击选中或者不选中
				// console.log(item);
				item.selected=!item.selected;
				
				//selectedlist数组中是否包含该元素
				let isExist=this.selectedList.indexOf(item);
				if(isExist > -1){//表明已经查到了 删除这个对象
					this.selectedList.splice(isExist,1)
				}else{
					// 将点击的选中的添加到一个selected的数组里
					this.selectedList.push(item);
				}
				
				//全选状态
				if(this.selectedList.length==this.goodsList.length){
					this.isAllSelected=true;
				}else{
					this.isAllSelected=false;
				}
				
				this.sum();
			},
			handleSelectAll(){//点击底部  --全选
				this.isAllSelected=!this.isAllSelected;
				
				//点击底部全选按钮后 goodList数组的中的数据处理
				let arr=[];
				this.goodsList.forEach((item,index)=>{
					//遍历所有的数据让里面的selected全部变成我们点击后的false 或者是true
					item.selected=this.isAllSelected;
					arr.push(item);
				})
				// 如果说isAllSelected都是将这个arr数组给selectedList ????
				this.selectedList= this.isAllSelected ? arr : [];
				
				this.sum();
			},
			sum(){//核计
				this.sumPrice=0;
				this.goodsList.forEach((item,index)=>{
					//遍历所有的值，选中的价格进行核算
					if(item.selected){
						this.sumPrice=this.sumPrice+(item.number*item.price);
					}
				})
				//保留后面2位小数
				this.sumPrice=this.sumPrice.toFixed(2);
			},
			handleSingleDelete(item){//单个删除
				//更新本地storage
				uni.getStorage({
					key:"goodsList",
					success:(res)=>{
						//拿到本地数据将传递过来的item这个对象的数据删掉
						res.data.splice(res.data.indexOf(item),1)
						// 删除过后也同步再次存储
						uni.setStorageSync("goodsList",res.data);
					}
				})
				//更新数组
				this.goodsList.splice(this.goodsList.indexOf(item,1));
				this.selectedList.splice(this.selectedList.indexOf(item,1));
				
				// 删除的时候同时也把滑动的数据重置
				this.oldIndex=null;
				this.theIndex=null;
				//删除过后也是需要合计也需要重新执行
				this.sum();
			},
			handleMulDelete(){//全部删除
				//循环删除所有选中的商品
				while(this.selectedList.length>0){
					//将选中的数组中每一个都走一遍 追个删除选中的列表；
					this.handleSingleDelete(this.selectedList[0]);
				}
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
				
			},
			handleConfirm(){//结算
				if(this.selectedList.length<1){
					uni.showToast({
						icon:"none",
						title:"请选择结算商品"
					})
					return;
				}
				//本地存储
				uni.setStorage({
					key:"comfirmList",
					data:this.selectedList,
					success() {
						uni.navigateTo({
							url:"../../order/cofirm"
						})
					}
				})
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

