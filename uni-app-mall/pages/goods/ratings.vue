<template>
	<view>
		<video v-show="showVideo" class="myVideo" id="myVideo" :src="videoSrc" @fullscreenchange="videoControl"></video>
		<view class="content">
			<view class="label">
				<view v-for="(label,index) in labelList" :key="index" :class="{'on':index==labelIndex}" @tap="handleloadRtings(index)">
					{{label.name}}({{label.number}})
				</view>
			</view>
			<!-- 评论信息 -->
			<view class="list">
				<view class="ratings" v-for="(item,index) in ratingsList" :key="index">
					<view class="left">
						<view class="face">
							<image :src="item.face"></image>
						</view>
					</view>
					<view class="right">
						<!-- 用户名 和时间 -->
						<view class="name-date">
							<view class="username">{{item.username}}</view>
							<view class="date">{{item.date}}</view>
						</view>
						<!-- 用户买的规格 -->
						<view class="spec">{{item.spec}}</view>
						<!-- 图片和视频的展示 -->
						<view class="medias">
							<view class="content">{{item.content}}</view>
							<view class="img-video">
								<view class="box" @tap="playVideo(video.path)" v-for="video in item.video" :key="video.path">
									<image :src="video.img" mode="aspectFill"></image>
									<view class="playbtn">
										<view class="icon iconfont">&#xe7e9;</view>
									</view>
								</view>
								<!-- 图片 -->
								<view @tap="showBigImg(image,item.img)" class="box" v-for="(image,index) in item.img" :key="index">
									<image mode="aspectFill" :src="image"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
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
				labelIndex:0,
				videoSrc:"",
				videoContext:null,//用来存取实例化的内容
				showVideo:true//用来控制小程序端 视频显示或是不显示
				
			}
		},
		onLoad(){
			//判断是不是小程序, 如果是小程序那就影藏视频
			//#ifdef MP
			this.showVideo=false;
			//#endif
			
			try{
				//直接拿取localstorage的数据
				const comments=uni.getStorageSync('comments');
				if(comments){
					this.ratingsList=comments;
					console.log(this.ratingsList)
				}
			}catch(e){
				console.log(e);
			}
		},
		methods:{
			handleloadRtings(index){
				this.labelIndex=index;
			},
			//点击图片放大
			showBigImg(image,images){
				uni.previewImage({
					current:image,//表明显示的图片是谁
					urls:images//这个图片在哪个列表里
				})
			},
			//点击播放视频的按钮
			playVideo(path){
				// console.log(path)
				//将点击的视频地址赋值给变量
				this.videoSrc=path;
				
				//现在想在播放的时候实现全屏的状态，我们需要一个video的对象来控制，这个对象需要在页面的整个DOM对象都加载完毕的情况下创建对象
				//UNI这个提供了一个方法uni.createVideoContext();
				
				//全屏播放
				// Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新。
				// $nextTick 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用 $nextTick，则可以在回调中获取更新后的 DOM
				
				//这个个人的理解应该是 在页面渲染完毕后 在执行$nextTrick中的函数，如果没有DOM没有渲染完 这个全屏会出错
				this.$nextTick(()=>{
					//对象执行uni全屏的方法
					this.videoContext.requestFullScreen({
						direction:0
					})
				})
				//#ifdef MP
				this.showVideo=false;
				//#endif
			},
			//当@fullscreenchange改变为全屏时候触发一个方法videoControl
			videoControl(e){
				//提供一个事件对象,里面有一个detail里面有 fullScteen:true;
				// console.log(e)
				if(e.detail.fullScreen){//如果是全屏的情况下
					//让视频自动播放
					this.videoContext.play();
				}else{
					//停止播放视频
					// stop() 或者pause()方法 都有个问题就是小化后 视频依旧在继续播放
					// this.videoContext.stop();
					// 所以这里调用方法,直接让其播放的地址为空
					this.videoPause();
				}
			},
			videoPause(){
				this.videoSrc='';
				
				//#ifdef MP
				this.showVideo=false;
				//#endif
			}
			
		},
		//监听页面初次渲染完毕的时候执行
		onReady() {
			//uni.createVideoContext(参数')参数要指明元素
			this.videoContext=uni.createVideoContext('myVideo')
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
