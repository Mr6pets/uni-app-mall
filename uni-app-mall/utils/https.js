//封装请求方法
module.exports=(param)=>{
	var url=param.url;
	var method=param.method;
	var header=param.header || {};
	var data=param.data|| {};
	
	//请求的方式
	if(method){
		method=method.toUpperCase();//小写转大写
		if(method=="POST"){
			header={"content-type":"application/x-www-form-urlencoded"};
		}
	};
	//发起请求 加载动画
	if(!param.hideLoading()){//
		uni.showLoading({
			title:"加载中"
		})
	}
	
	//发起网络请求
	uni.request({
		url:url,
		method:method || "GET",
		header:header,
		data:data,
		success:function(res){
			if(res.statusCode && res.statusCode!=200){//接口有问题
				uni.showModal({
					content:res.msg
				})
			}
			typeof param.success=="function" && param.success(res.data)
			
		}
	})
	
}