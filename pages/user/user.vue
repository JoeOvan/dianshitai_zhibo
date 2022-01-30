<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text>个人中心</text></block>
			</cu-custom>
		</view>

		<view class="content" :style="{'top':tabFix,'padding-bottom': tabbarHeight}">
			<view class="user-info-wrap">
				<view class="" v-if="!token">
					<button class="user-info" open-type="getUserInfo" @click="getUserProfile()">
						<view class="user-avatar">
							<image class="avatar" src="../../static/user.jpg"></image>
						</view>
						<view class="info">
							<view class="info-name">
								<!-- <button class="cu-btn bg-red margin-tb-sm lg btn-login" open-type="getUserInfo" @click="getUserProfile()">登录</button> -->
								<view class="btn-login">登录</view>
							</view>
						</view>
					</button>
				</view>
				<view class="user-info" v-if="token">
					<view class="user-avatar">
						<fr-image class="avatar" :src="userinfo.avatarUrl" mode="" />
					</view>
					<view class="info">
						<view class="info-name">{{userinfo.nickName}}</view>
					</view>
				</view>
			</view>

			<view class="info-list">
				<navigator class="info-list-item" url="/pages/order/order" v-if="token">
					<view class="text">我的订单</view>
					<image class="arrows" src="../../static/icon-arrows.png"></image>
				</navigator>
				<navigator class="info-list-item" url="/pages/user/comment" v-if="token">
					<view class="text">我的评价</view>
					<image class="arrows" src="../../static/icon-arrows.png"></image>
				</navigator>
				<navigator class="info-list-item" url="address-list" v-if="token">
					<view class="text">收货地址</view>
					<image class="arrows" src="../../static/icon-arrows.png"></image>
				</navigator>
				<view class="info-list-item">
					<button class="order-contact-service" open-type="contact">联系客服</button>
					<image class="arrows" src="../../static/icon-arrows.png"></image>
				</view>
				<navigator class="info-list-item" url="article">
					<view class="text">关于我们</view>
					<image class="arrows" src="../../static/icon-arrows.png"></image>
				</navigator>
			</view>

			<view v-if="token" class="btn-logout" @click="logout">
				<view class="text">退出账号</view>
			</view>
			<tabbar :current="3"></tabbar>
		</view>

		<login-modal :isShow='isLoginModalShow' @openModal="isLoginModalShow = true" @closeModal="isLoginModalShow = false">
			<template name='left-handle'>
				<button class="btn btn-cancel" @click="isLoginModalShow = false">取消</button>
			</template>
		</login-modal>

	</view>
</template>

<script>
	import FrImage from '@/components/fr-image/fr-image.vue'
	import tabbar from '@/components/tabbar/tabbar'
	// 按需导入 mapMutations 辅助函数
	import { mapState, mapMutations } from 'vuex'
	export default {
		computed: {
			// 将 m_user 模块中的 userinfo 映射到当前页面中使用
			...mapState('m_user', ['userinfo','token', 'shareCode']),
		},
		components:{FrImage,tabbar},
		data() {
			return {
				tabFix: this.CustomBar + 'px',
				tabbarHeight: 0,
				isLoginModalShow: false,  //登录模态框
			}
		},
		onLoad() {
			
			let systemInfo = wx.getSystemInfoSync();
			
			let windowHeight = systemInfo.windowHeight; //窗口高度
			let screenHeight = systemInfo.screenHeight; //屏幕高度
			let statusBarHeight = systemInfo.statusBarHeight; //设备状态栏高度
			let pixelRatio = systemInfo.pixelRatio;      //设备像素比

			let tabbarHeight = ( screenHeight - windowHeight - statusBarHeight ) * pixelRatio;

			this.tabbarHeight = tabbarHeight + "px";
		},
		async onShow() {
			
			
			uni.setStorageSync('orderStatus', "");
			uni.setStorageSync('currentIndex', "");
			uni.hideTabBar({
				animation: false
			})
			
			const authToken = await uni.$http.get(uni.$url.authToken);
			
			if(authToken.data.code == 401) this.updateToken('');
			
			let token = this.$store.state.m_user.token;
			
			if (!token || token == '') return this.isLoginModalShow = true;
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateShareCode']),
			// 获取微信用户的基本信息
			getUserProfile(e) {
				
				// this.isLoginModalShow = true;

				this.getCode();

				uni.getUserProfile({
					desc: '用于完善会员资料',
					success: (res) => {

						//将用户的基本信息存储到 vuex 中
						this.updateUserInfo(res.userInfo);

						// 获取登录成功后的 Token 字符串
						this.getToken(res)
 
					}
				});

			},
			toSetPhone(){
				uni.navigateTo({
				  url: '/pages/user/edit-phone'//实际路径要写全
				})
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
				
				if (loginResult.data.code !== 0) return uni.$showMsg('登录失败！')
				
				uni.showToast({
				 title: '登录成功',
				 icon: 'success'
				})
				
				this.updateShareCode(loginResult.data.data.shareCode);
				
				this.updateToken(loginResult.data.data.token);
			},
			// 退出登录
			async logout() {
				// 询问用户是否退出登录
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '确认退出登录吗？'
				}).catch(err => err)

				if (succ && succ.confirm) {
					// 用户确认了退出登录的操作
					// 需要清空 vuex 中的 userinfo、token 和 shareCode
					this.updateUserInfo({})
					this.updateToken('')
					this.updateShareCode('');
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f4f4f4;
	}
	.nav-fixed {
		position: fixed;
		width: 100%;
		z-index: 1000;
	}
	.fr_img{
		.fr_img_content{
			position:relative !important;
		}
	}
	.isfixed {
		background:#FF2222;
	}
	button::after{
		border: none;
	}
	.content {
		position: fixed;
		width: 100%;
		height: 100%;
		overflow-y: auto;

	}
	.order-contact-service {
		width: 710rpx;
		height: 84rpx;
		line-height: 85rpx;
		padding: 0;
		font-size: 30rpx;
		font-weight: 400;
		color: #333333;
		background: #ffffff;
		border-radius: 10px;
		border: none;
		text-align: left;
	}
	
	.cuIcon-back {
		display: none;
	}

	//个人中心
	.user-info-wrap {
		padding: 30rpx 60rpx 39rpx 60rpx;
		background: #FF2222;
		.user-info {
			text-align: center;
			background: #FF2222;
		}
		.user-avatar {
			display: inline-block;
			width: 120rpx;
			height: 120rpx;
			flex-shrink: 0;
			margin-bottom: 30rpx;
			image{
				border-radius: 50%;
			}
			.avatar {
				display: inline-block;
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		.info {
			font-weight: bold;
			color: #FFFFFF;
			.info-name {
				font-size: 34rpx;
				margin-bottom: 9rpx;
			}
			.info-number {
				font-size: 24rpx;
				font-weight: 400;
				.icon-edit-mini {
					display: inline-block;
					width: 20rpx;
					height: 20rpx;
					margin-left: 15rpx;
					top: 2rpx;
				}
			}
		}
	}

	//优惠券
	.coupon-wrap {
		margin: -120rpx 40rpx 0 40rpx;
		.coupon-card-wrap {
			position: relative;
			width: 670rpx;
			height: 240rpx;
			background: #FFFFFF;
			box-shadow: 0 20rpx 29rpx 2rpx rgba(233, 50, 26, 0.3);
			border-radius: 20rpx;
			z-index: 10;
			.coupon-card {
				display: flex;
				justify-content: space-between;
				.coupon-count {
					width: 285rpx;
					.label {
						margin: 30rpx;
						font-size: 30rpx;
						color: #009E00;
						.storng {
							font-weight: 400;
						}
					}
					.count {
						text-align: center;
						font-size: 24rpx;
						color: $custom-theme-color;
						.num {
							margin-right: 10rpx;
							font-size: 72rpx;
						}
					}
				}
				.coupon-share {
					width: 385rpx;
					.cover {
						width: 100%;
						border-radius: 0 20rpx 20rpx 0 ;
					}
				}
			}
		}
		.coupon-list-wrap {
			position: relative;
			width: 630rpx;
			margin: 0 auto;
			background: #FFFFFF;
			z-index: 9;
			.coupon-list {
				display: flex;
				justify-content: flex-start;
				height: 150rpx;
				padding: 30rpx;
				border-bottom: 1rpx solid #f1f1f1;
				box-sizing: border-box;
				&:last-child {
					border-bottom: none;
				}
				.coupon-cover {
					display: inline-block;
					width: 70rpx;
					height: 70rpx;
					.cover {
						display: inline-block;
						width: 100%;
						height: 100%;
					}
				}
				.coupon-info {
					width: 375rpx;
					margin: 0 20rpx;
					.coupon-intro {
						.title {
							font-size: 28rpx;
							font-weight: 400;
							color: #000000;
						}
						.intro {
							font-size: 20rpx;
							font-weight: 400;
							color: #888888;
							line-height: 30rpx;
						}
					}
				}
				.coupon-op {
					.price {
						font-size: 44rpx;
						font-weight: 400;
						color: $custom-theme-color;
						.sign {
							font-size: 30rpx;
						}
					}
					.btn-use {
						display: inline-block;
						padding: 0 5rpx;
						font-size: 20rpx;
						font-weight: 400;
						color: #FFFFFF;
						border: 2rpx solid #C73B29;
						background: $custom-theme-color;
						border-radius: 20rpx;
					}
				}
			}
		}
	}

	//用户信息列表
	.info-list {
		width: 670rpx;
		// height: 340rpx;
		margin: 50rpx 40rpx 40rpx 40rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		.info-list-item {
			position: relative;
			display: flex;
			height: 86rpx;
			line-height: 86rpx;
			padding: 0 30rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #000000;
			border-bottom: 1rpx solid #f1f1f1;
			justify-content: space-between;
			align-items: center;
			&:last-child {
				border-bottom: none;
			}
			.arrows {
				display: inline-block;
				width: 13rpx;
				height: 25rpx;
			}
		}
	}

	.btn-login {
		margin: 0 auto;
		line-height: 46rpx;
	}

	//退出按钮
	.btn-logout {
		font-size: 28rpx;
		font-weight: 400;
		color: #000000;
		width: 670rpx;
		height: 80rpx;
		line-height: 80rpx;
		margin: 40rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		text-align: center;
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
