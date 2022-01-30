<template>
	<view class="wrapper" v-if="content">

		<cu-custom class="nav-wrap" bgColor="text-white bg-red" :isBack="true">
			<text class="title" slot="backText">{{content.title}}</text>
		</cu-custom>

		<view class="container">			
			<!-- <view class="cover-wrap">
				<image class="cover" :src="content.imgUrl" mode=""></image>
			</view> -->
			<view class="content-wrap">
				<view class="info-wrap">
					<view class="title">{{ content.title }}</view>
					<view class="date">{{ content.createTime}}</view>
				</view>
				<view class="content">

					<u-parse :content="content.content|formatRichText" @preview="preview" @navigate="navigate"></u-parse>

				</view>
			</view>
			
			<view class="comment-wrap">
				<view class="comment-label">评论：</view>
				<block  v-for="(item,index) in content.commentList" :key="index">
					<view class="comment-item-wrap">
						<view class="comment-top">
							<view class="comment-top-item">
								<fr-image class="avatar" :src="item.avatar" mode="aspectFill" />
								<text class="username">{{ item.name }}</text>
							</view>
							<view class="comment-top-item right">{{item.createTime}}</view>
						</view>
						<view class="comment-content">
							<text>{{item.message}}</text>
						</view>
					</view>
				</block>
			</view>
			
			
		</view>
		
		<view class="comment-sub">
			<view class="comment-sub-content">
				<view class="comment-sub-inp">
					<input type="text" v-model="comment" placeholder="请发表你的看法" placeholder-style="color:#888888" cursor-spacing="20" />
				</view>
				<view class="comment-sub-btn" @click="sendComment">
					<image src="../../static/Send.png" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		
		<login-modal :isShow='isLoginModalShow' @openModal="isLoginModalShow = true" @closeModal="isLoginModalShow = false">
			<template name='left-handle'>
				<button class="btn btn-cancel" @click="isLoginModalShow = false">取消</button>
			</template>
		</login-modal>
		
	</view>
</template>

<script>
	// 按需导入 mapMutations 这个辅助方法
	import { mapState, mapMutations } from 'vuex'
	export default {
		computed: {
			// 将 m_user 模块中的 userinfo 映射到当前页面中使用
			...mapState('m_user', ['shareCode']),
		},
		data() {
			return {
				newsId: null, //资讯id
				content: null,
				comment: '',  //评论内容
				isLoginModalShow: false,  //登录模态框
			}
		},
		onLoad(options) {
			
			this.newsId = options.id
			this.getInfoById(options.id);
		},
		filters:{
			/**
			 * 处理富文本里的图片宽度自适应
			 * 1.去掉img、video标签里的style、width、height属性
			 * 2.修改所有style里的width属性为max-width:100%
			 * 3.img、video标签添加style属性：max-width:100%;height:auto
			 * 4.去掉<br/>标签
			 * @param html
			 * @return string
			 */
			formatRichText(html) { //控制小程序中图片大小
				// 去掉img标签里的style、width、height属性
				let newContent= html.replace(/<img[^>]*>/gi,function(match,capture){
					match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
					match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
					match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
					return match;
				});
				
				// 去掉video标签里的style、width、height属性
				newContent= html.replace(/<video[^>]*>/gi,function(match,capture){
					match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
					match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
					match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
					return match;
				});
				// 修改所有style里的width属性为max-width:100%
				// 去掉所有style里的font-size属性
				newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
					match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
					match = match.replace(/font-size:[^;]+;/gi, '');
					return match;
				});
				// 去掉<br/>标签
				newContent = newContent.replace(/<br[^>]*\/>/gi, '');
				// img标签添加style属性：max-width:100%;height:auto
				newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin:0px auto;"');
				// video标签添加style属性：max-width:100%;height:auto
				newContent = newContent.replace(/\<video/gi, '<video style="max-width:100%;height:auto;display:block;margin:0px auto;"');
				return newContent;
			}
		},
		// 发送给朋友
		onShareAppMessage(res) {
			
			this.$wxShare.mpShare['title'] = this.content.title || '龙眼直播';
			
			return this.$wxShare.mpShare
			
		},
		//分享到朋友圈
		onShareTimeline(res) {
			
			this.$wxShare.mpShare['title'] = this.content.title || '龙眼直播';
			
			return this.$wxShare.mpShare
		},
		methods: {
			...mapMutations('m_user', ['updateShareCode']),
			async getInfoById(id) {

				// 发起请求
				const res = await uni.$http.post(uni.$url.getInfoById, {
					infoId: id
				});

				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);

					let data = res.data.data;
					
					data.imgUrl = data.imgUrl !== null ? uni.$url.baseUrl + data.imgUrl : '../../static/img-null.jpg';
					
					if(data.content!==null){
						//修正图片的域名url
						let regStr = "class=\"richImg\" src=\""+`${uni.$url.baseUrl}`+"/profile/upload/";
						let reg = new RegExp("src=\"/profile/upload/","g");
						let contentString = data.content.replace(reg,regStr);
						data.content = contentString;
					}
				

					this.content = data;

			},
			async sendComment(){
				
				if(!this.comment || this.comment == '') return uni.$showMsg('评论不能为空');
				
				// 发起请求
				const res = await uni.$http.post(uni.$url.saveNewsComment,{infoId:this.newsId,message:this.comment});
							
				if (res.data.code == 401) return this.isLoginModalShow = true;
				
				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
				
				this.comment = '';
				
				uni.showToast({
					title: '评论成功待审核',
					duration: 3500,
					icon: 'success'
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #ffffff;
	}
	.wrapper {
		.nav-wrap {
			.title {
				display: inline-block;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				word-break: break-all;
			}
		}
		.container {
			padding-bottom: 120rpx;
			.cover-wrap {
				width: 750rpx;
				height: 400rpx;
				.cover {
					display: inline-block;
					width: 100%;
					height: 100%;
				}
			}

			.content-wrap {
				padding: 20rpx;
				.title {
					font-size: 34rpx;
					font-weight: bold;
					color: #000000;
				}
				.info-wrap {
					padding-bottom: 20rpx;
					margin-bottom: 20rpx;
					border-bottom: 1rpx solid #f1f1f1;
				}
				.content {
					video {
						width: 100% !important;
						// height: auto !important;
					}
				}
			}
			
		}
		// .richImg {
		// 	  width: 100% !important;
		// 	  height: auto !important;
		// }
		.content {
			img {
				width: 100% !important;
				height: auto !important;
			}
		}
	}
	
	
	.comment-sub{
		width: 100%;
		position: fixed;
		bottom: 0;
		border-top:1px #CCCCCC solid;
		padding: 20rpx 30rpx;
		background-color: #fff;
		image{
			width: 68rpx;
			height: 48rpx;
		}
		.comment-sub-content{
			display: flex;
			border: 1px #FF2222 solid;
			border-radius: 40rpx;
			height: 80rpx;
			line-height: 80rpx;
			width: 100%;
			justify-content:space-between;
			flex-direction:unset;
			background-color: #F4F4F4;
			.comment-sub-inp{
				margin-left:21rpx;
				width: 480rpx;
				input{
					margin-top: 16rpx;
				}
			}
			.comment-sub-btn{
				background: #FF2222;
				border-radius: 40rpx;
				width: 120rpx;
				padding-top: 14rpx;
				image{
					display: block;
					margin: 0 auto;
				}
			}
		}
	}
	
	
	
	.comment-wrap {
		margin-bottom: 120rpx;
		.comment-label {
			padding: 0 20rpx;
			&::before {
				display: inline-block;
				content: '';
				width: 5rpx;
				height: 25rpx;
				background: #333333;
				vertical-align: middle;
				margin-right: 10px;
			}
		}
		.comment-item-wrap{
			.comment-top{
				padding: 0 40rpx;
				height: 80rpx;
				display: flex;
				flex-direction: row;
				.comment-top-item {
					display: flex;
					position: relative;
					width: 50%;
					align-items: center;
					.avatar {
						display: inline-block;
						width: 48rpx;
						height: 48rpx;
						margin-right: 10rpx;
					}
					image{
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
					.username {
						display: inline-block;
					}
					.comment-top-from{
						font-size: 9px;
						color: #888888;
						text{
							color: #000000;
							margin-left: 5px;
						}
					}
				}
				.right{
					text-align: right;
					color: #888888;
					font-size: 12px;
					line-height: 80rpx;
					display: block;
				}
			}
			.comment-content{
				margin: 5rpx 28rpx 10rpx 100rpx;
				padding-bottom: 10px;
				border-bottom:1px #DDDDDD solid;
				color: #000000;
				text{
					margin-bottom: 10px;
				}
			}
		}
	}
	
	.btn {
		flex: 1;
		background: #ffffff;
		border: none;
		font-size: 40rpx;
	}
	.btn-cancel {
		color: #333333;
		border-right: 1rpx solid #f1f1f1;
	}
	.btn-login {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
