<template>
	<view>
		<view class="block"></view>
		<view class="QR">
			<image src="../../../static/img/qrcode.jpg"></image>
		</view>
		<view class="title">
			爱咋咋地......
		</view>
		<view class="btn" v-show="showBtn" @tap="handleSavePhotos">
			{{savePhotos}}
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				savePhotos:"保存到相册",
				showBtn:false//这里控制这个savePhotos 是否显示
			}
		},
		onLoad() {
			//#ifdef APP-PLUS
			this.showBtn=true
			//#endif
		},
		methods:{
			handleSavePhotos(){
				//调用系统方法实现图片保存
				this.savePhotos="正在保存...";
				//实例化一个小程序的页面对象
				let ws=this.$mp.page.$getAppWebview()
				
				//nativeObj管理系统原生对象。
				let bitmap=new plus.nativeObj.Bitmap();
				
				this.showBtn=false;
				//确保页面DOM生成成功了 执行方法
				this.$nextTick(()=>{
					setTimeout(()=>{
						//画图
						//draw():将Webview窗口的可视区域截屏并绘制到Bitmap图片对象中。
						//draw(你要绘制的图片对象,success回调，err的回调，option的回调)
						ws.draw(bitmap,(success)=>{
							//成功的回调
							bitmap.save("_doc/Qr.jpg",{
								overwrite:true,//每次保存的时候是否要重写 true为重写
								quality:100//保存的质量
							},(success)=>{
								//画图画好了之后调用原生的相册系统管理
								plus.gallery.save(success.target,(e)=>{
									uni.showToast({
										title:"保存成功"
									})
									this.savePhotos="保存到相册"
									//销毁创建的对象
									bitmap.clear();
								})
							})
						},(err)=>{
							console.log("保存图片失败")
						},(option)=>{
							console.log("bitmap 绘制图片失败")
						})
						
					},200)
				})
				
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f06c7a;
	}

	.block {
		width: 100%;
		height: 30vh;
		background-color: #fff;
		display: flex;
		justify-content: center;
	}

	.QR {
		width: 60vw;
		height: 80vw;
		margin: -40vw auto 0 auto;
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;

		image {
			width: 50vw;
			height: 50vw;
		}
	}

	.title {
		width: 100%;
		margin-top: 50upx;
		display: flex;
		justify-content: center;
		font-size: 36upx;
		color: #fff;
	}

	.btn {
		width: 50%;
		height: 80upx;
		border-radius: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 20upx;
		margin: 0 auto;
		margin-top: 50upx;
		background-color: rgba(255, 255, 255, .8);
	}
</style>

