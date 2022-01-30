import store from '../store/store.js'
export default {
    data() {
        return {
            share: {
                // 转发的标题 （默认标题）
                title: '',
                // 默认是当前页面，必须是以‘/’开头的完整路径
                path: '',
                //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，
                //支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
                imageUrl: ''
            }
        }
    },
	onShow() {
		let pages = getCurrentPages();
		if (pages.length >= 1) {
			let page = pages[pages.length - 1];
			
			this.$wxShare.pageRouter = '/' + page.route
			
			// 拼接当前页面路径不包括分享码shareCode
			let options = page.options;
			
			// console.log({options});
			options['route'] = this.$wxShare.pageRouter;
			options['shareCode'] = store.state.m_user.shareCode;
			let strParam = '';
			if(Object.keys(options).length) {			
				
				// console.log(options)
				
				// 拼接参数
				let param = ''
				for (let key in options) {
					
					param += '&' + key + '=' + options[key]
					
				}
				
				//替换第一个&符号为?
				strParam = param.replace('&','?');
				
			}
				
			// console.log({options});

			//给路径添加分享码shareCode
			let pagesUrl = `${'/pages/index/index' + strParam}`;
			
			if(this.$wxShare.pageRouter){
				this.$wxShare.mpShare = {
					title: '', // 分享标题
					path: pagesUrl, // 默认为当前页面路径
					imageUrl: '' // 默认为当前页面的截图
				}
				
				// console.log(this.$wxShare.mpShare);
			}
			return ;
		}		
	},
    // 发送给朋友
    onShareAppMessage(res) {
		
		return this.$wxShare.mpShare
		
    },
    //分享到朋友圈
    onShareTimeline(res) {
		
		return this.$wxShare.mpShare
    }
}