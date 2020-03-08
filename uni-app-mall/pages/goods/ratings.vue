<template>
	<view class="content">
		<view class="label">
			<view v-for="(label,index) in labelList" :key="index" :class="{'on':index==labelIndex}" @tap="handleloadRtings(index)">
				{{label.name}}({{label.number}})
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				ratingsList:[],
				labelList:[
					{name: '全部',number: 25,type: 'all'},
					{name: '好评',number: 23,type: 'good'},
					{name: '中评',number: 1,type: 'secondary'},
					{name: '差评',number: 1,type: 'poor'},
					{name: '有图',number: 12,type: 'img'},
					{name: '视频',number: 2,type: 'video'},
					{name: '追加',number: 2,type: 'append'}
				],
				labelIndex:0
			}
		},
		onLoad(){
			try{
				//直接拿取localstorage的数据
				const comments=uni.getStorageInfoSync('comments');
				if(comments){
					this.ratingsList=comments;
				}
			}catch(e){
				console.log(e);
			}
		},
		methods:{
			handleloadRtings(index){
				this.labelIndex=index;
			}
		}
	}
</script>

<style lang="scss">
	
	.content {
		view {
			display: flex;
		}

		width: 94%;
		padding: 0 3%;

		.label {
			width: 100%;
			flex-wrap: wrap;

			view {
				padding: 0 20upx;
				height: 50upx;
				border-radius: 40upx;
				border: solid 1upx #ddd;
				align-items: center;
				color: #555;
				font-size: 26upx;
				background-color: #f9f9f9;
				margin: 10upx 20upx 10upx 0;

				&.on {
					border: solid 1upx #f06c7a;
					color: #f06c7a;
				}
			}
		}
	}

	.list {
		width: 100%;
		flex-wrap: wrap;
		padding: 20upx 0;

		.ratings {
			width: 100%;
			margin-top: 30upx;

			.left {
				width: 10vw;
				flex-shrink: 0;
				margin-right: 10upx;

				.face {
					width: 100%;

					image {
						width: 10vw;
						height: 10vw;
						border-radius: 100%;
					}

				}
			}

			.right {
				width: 100%;
				flex-wrap: wrap;

				.name-date {
					width: 100%;
					justify-content: space-between;
					align-items: baseline;

					.username {
						font-size: 32upx;
						color: #555;
					}

					.date {
						font-size: 28upx;
						color: #aaa;
					}
				}

				.spec {
					width: 100%;
					color: #aaa;
					font-size: 26upx;
				}

				.medias {
					width: 100%;
					flex-wrap: wrap;

					.content {
						font-size: 30upx;
					}

					.img-video {
						width: 100%;
						flex-wrap: wrap;

						.box {
							width: calc((84.6vw - 50upx)/4);
							height: calc((84.6vw - 50upx)/4);
							margin: 5upx 5upx;
							position: relative;
							justify-content: center;
							align-items: center;

							image {
								position: absolute;
								width: 100%;
								height: 100%;
								border-radius: 10upx;
							}

							.playbtn {
								position: absolute;

								.icon {
									font-size: 80upx;
									color: rgba(255, 255, 255, .9)
								}
							}
						}
					}
				}
			}
		}
	}
	
	.myVideo{
		position: fixed;
		top: 50%;
		right: 100%;
		// #ifdef  MP
		top: 0;
		right: 0;
		z-index: 99;
		width: 100%;
		height: 100%;
		// #endif
	}
	
</style>
