<template>
	<view :class="isShow ? 'modal-wrap modal-open-wrap':'modal-wrap'">
		<view class="modal-mask-wrap"></view>
		<view class="modal-content-wrap">				
			<view class="title">提示</view>
			<view class="tips">请确认登录</view>
			<view class="handle-wrap">
				<!-- <slot name="left-handle"></slot> -->
				<slot slot="left-handle">
					<button class="btn btn-cancel" @click="cancelHandle()">取消</button>
				</slot>
				<button class="btn btn-login" open-type="getUserInfo" @click="getUserProfile()">登录</button>
			</view>
		</view>
	</view>
</template>

<script>
	// 按需导入 mapMutations 辅助函数
	import { mapState, mapMutations } from 'vuex'
	export default {
		name:"login-modal",
		computed: {
			// 将 m_user 模块中的 userinfo 映射到当前页面中使用
			...mapState('m_user', ['userinfo','token','shareCode']),
		},
        props:{
			isShow: {
				type: Boolean,
				default: false,
			},
		},
		mounted(){
			
			// this.onCheckLogin();
			
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateShareCode']),
			// 获取微信用户的基本信息
			getUserProfile(e) {
				
				uni.showLoading({
				  title: '数据加载中...',
				  mask: true
				})
			
				this.getCode();
	
				uni.getUserProfile({
					desc: '用于完善会员资料',
					success: (res) => {
			
						//将用户的基本信息存储到 vuex 中
						this.updateUserInfo(res.userInfo);
			
						// 获取登录成功后的 Token 字符串
						this.getToken(res)
						
						uni.hideLoading()
					},
					fail: (res) => {
						console.log(res)
						
						if (res.errMsg !== "getUserProfile:fail auth deny") return uni.$showError('登录失败！');
						
						uni.hideLoading()
					}
					
				});
			
			},
			async getCode() {
				// 调用微信登录接口
				const [err, res] = await uni.login().catch(err => err);
				
				// 判断是否 uni.login() 调用失败
				if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
			
				uni.setStorageSync('code', res.code);
			},
			// 调用登录接口，换取永久的 token
			async getToken(info) {
				// 准备参数对象
				const query = {
					code: uni.getStorageSync('code'),
					avatar: info.userInfo.avatarUrl,
					nickName: info.userInfo.nickName,
					shareCode: this.$store.state.m_user.shareCode || ''
				}
				
				
				// 换取 token
				const loginResult = await uni.$http.post(uni.$url.wxLoginUrl, query)
				
				this.$emit("closeModal");
				
				if (loginResult.data.code !== 0) return uni.$showMsg(loginResult.data.msg);
				
				
				uni.showToast({
				 title: '登录成功',
				 icon: 'success'
				})
				
				this.updateShareCode(loginResult.data.data.shareCode);
				
				this.updateToken(loginResult.data.data.token);
				
				this.$emit("getCart");
			},
			cancelHandle() {
				console.log('取消')
				
				uni.navigateBack();
				
				this.$emit("closeModal");
			},
			cancelHandleClose() {
				console.log('取消')
				
				this.$emit("closeModal");
			}
		}
	}
</script>

<style lang="scss">
	
	.modal-wrap {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
        width: 100%;
        height: 100%;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		&.modal-open-wrap {
			display: flex;
			transition: all 0.3s ease;
			transform: translateY(0%) !important;
			.modal-content-wrap {
				display: block;
			}
			.modal-mask-wrap {
				display: block;
			}
		}
		.modal-mask-wrap {
			display: none;
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0rpx; left: 0rpx; bottom: 0rpx; right: 0rpx;
			background-color: rgba(0, 0, 0, 0.5);
			transition: .3s;
			z-index: 222;
		}
		.modal-content-wrap {
			display: none;
			position: relative;
			width: 650rpx;
			border-radius: 30rpx;
			background: #ffffff;
			z-index: 1000;
			overflow: hidden;
			text-align: center;
			.title {
				padding: 60rpx 0 20rpx 0;
				font-size: 45rpx;
				color: #000000;
				font-weight: bold;
			}
			.tips {
				margin-bottom: 60rpx;
				font-size: 35rpx;
				color: #333333;
			}
			.handle-wrap {
				display: flex;
				flex-direction: row;
				border-top: 1rpx solid #f1f1f1;
				button::after {
					 border: none;
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
					color: #4c4a5c;
				}
			}
		}
	}
	
</style>
