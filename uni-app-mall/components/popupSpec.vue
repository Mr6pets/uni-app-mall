<template>
		<view class="popup spec" v-show="spaceInfo.showSpace" @tap="hideSpecifications">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer">
				<view class="content">
					<view class="title">选择规格：</view>
					<view class="sp">
						<view @tap.stop="handleSelectSpecification(item)" :class="{'on':item==goodsInfo.spec}" v-for="item in goodsData.spec" :key="item.id">
							{{item}}
						</view>
					</view>
					<view class="length">
						<view class="text">数量</view>
						<!-- 数量的组件 -->
						<counter :goodsInfo="goodsInfo" @sub="sub" @add="add"/>
					</view>
				</view>
				<!-- 确定按钮 -->
				<view class="btn" @tap="hideSpecifications">
					<view class="button">确定</view>
				</view>
			</view>
		</view>
</template>

<script>
	import counter from './counter.vue';
	export default {
		props:{
			spaceInfo: Object,
			goodsInfo:Object,
			goodsData:Object
		},
		methods:{
			//隐藏模态框
			hideSpecifications(){
				// this.spaceInfo.showSpace=false;
				this.$emit("hideSpec")
			},
			//模态框选择规格
			handleSelectSpecification(item){
				//组件里不能直接改动父级的数据
				// this.goodsInfo.spec=item;
				
				// 需要通过子级注册事件 父级执行方法 
				this.$emit("setSelectSpec",item)
			},
			sub(){
				this.$emit("sub")
			},
			add(){
				this.$emit("add")
			}
		},
		components:{
			counter
		}
	}
</script>

<style lang="scss">
	.popup {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 20;

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 21;
			background-color: rgba(0, 0, 0, 0.6);
		}

		.layer {
			position: fixed;
			z-index: 22;
			bottom: 0;
			width: 92%;
			padding: 0 4%;
			height: 70%;
			border-radius: 20upx 20upx 0 0;
			background-color: #fff;
			display: flex;
			flex-wrap: wrap;
			align-content: space-between;

			.content {
				width: 100%;
				padding: 20upx 0;
			}

			.btn {
				width: 100%;
				height: 100upx;

				.button {
					width: 100%;
					height: 80upx;
					border-radius: 40upx;
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #f47952;
					font-size: 28upx;
				}
			}
		}

		&.spec {
			.title {
				font-size: 30upx;
				margin: 30upx 0;
			}

			.sp {
				display: flex;

				view {
					font-size: 28upx;
					padding: 5upx 20upx;
					border-radius: 8upx;
					margin: 0 30upx 20upx 0;
					background-color: #f6f6f6;

					&.on {
						padding: 3upx 18upx;
						border: solid 1upx #f47925;
					}
				}
			}

			.length {
				margin-top: 30upx;
				border-top: solid 1upx #aaa;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-top: 20upx;

				.text {
					font-size: 30upx;
				}

			}

		}
	}
</style>

