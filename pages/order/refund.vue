<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">选择退款服务</text></block>
			</cu-custom>
		</view>
		
		<view class="content" :style="{'top':tabFix}">
			<scroll-view scroll-y="true" class="order-detail-content" :style="{'height': contentHeihgt+'px'}">

				<view class="order-detail-wrap">
				
					<view class="order-goods-list" >
						<!-- 商品列表 -->
						<block v-for="(item,index) in goodsList" :key="index" :data-id="index">
							<navigator class="cart-goods-item" :url="'../shop/shop?id='+orderInfo.brand_id">
								<view class="goods-cover">
									<fr-image class="cover" :src="baseUrl+item.goods.thumbImgUrl" mode="aspectFill" />
								</view>
								<view class="goods-info">
									<view class="title">{{item.goods.name}}</view>
									<view class="intro-wrap">
										<text class="intro"></text>
										<text class="count"><text class="sign">￥</text>{{item.price}}</text></view>
									<view class="num-wrap">
										<view class="num">x&nbsp;{{item.num}}</view>
									</view>
								</view>
							</navigator>
						</block>
					</view>
					<view class="order-goods-count">
						<view class="goods-count-item" >
							<text class="count-item-left">商品总价</text>
							<text class="count-item-right">¥&nbsp;{{orderInfo.totalMoney}}</text>
						</view>
						<view class="goods-count-item" >
							<text class="count-item-left">配送费</text>
							<text class="count-item-right">¥&nbsp;0</text>
						</view>
						
						<view class="goods-count-item">
							<text class="count-item-left" style="color: #000;font-size: 30rpx;">实付款：</text>
							<text class="count-item-right"><text class="count">¥&nbsp;{{orderInfo.totalMoney}}</text></text>
						</view>
					</view>
				</view>
				
				<view class="order-refund">
					<view class="order-refund-title">
						选择退款类型
					</view>
					<view class="order-goods-count">
						<!-- <view class="goods-count-item" @click="sub">
							<view class="order-refund-icon">
								<image src="../../static/Refresh.png" mode="aspectFill"></image>
							</view>
							<view class="order-refund-text">
								<view>我要退款（无需退货）</view>
								<view class="count-item-right">没收到货，或已协商同意不用退货只退款</view>
							</view>
						</view> -->
						
						<view class="goods-count-item" @click="toRefundMoney">
							<view class="order-refund-icon">
								<image src="../../static/Refresh.png" mode="aspectFill"></image>
							</view>
							<view class="order-refund-text">
								<view>我要退货退款</view>
								<view class="count-item-right">已收到货，需要退还收到的货物</view>
							</view>
						</view>
						
					</view>
				</view>
			</scroll-view>
		</view>
		
	</view>
</template>

<script>
	import FrImage from '@/components/fr-image/fr-image.vue'
	export default {
		data() {
			return {
				tabFix: this.CustomBar + 'px',
				// contentHeihgt: calc(100vh - (this.CustomBar + "px")),
				contentHeihgt: 0,
				orderId: 0,
				baseUrl: uni.$url.baseUrl,
				
				goodsList: {},//商品列表
				orderInfo: {},//订单信息
			}
		},
		components:{FrImage},
		onLoad(option) {
			var _this = this
			uni.getSystemInfo({
			    success: function (res) {
					_this.contentHeihgt = res.windowHeight - _this.CustomBar;
			    }
			});
			
			this.orderId=option.orderId;
			this.getOrderDetail();
		},
		methods: {
			toRefundMoney(id){
				uni.redirectTo({
					url: '../order/refund-money?orderId='+this.orderId
				});
			},
			async getOrderDetail() {
				//发起请求订单详情
				const res = await uni.$http.get(uni.$url.orderDetail, {orderId:this.orderId});
				let errmsg = res.data.errmsg;
				if (res.data.code !== 0) return uni.$showMsg(errmsg,3500);
				
				this.orderInfo = res.data.data;
				this.goodsList = res.data.data.orderDetailList;
			},
			async sub() {
				let query = {
					orderId:this.orderId,
					type:1,
					goodsStatus:1,
					reason:1,
					message:"",
					img:[],
					refundType:1,
				};
				
				// 询问用户是否申请退款
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '确认申请退款吗？'
				}).catch(err => err)
				
				if (succ && succ.confirm) {
					const res = await uni.$http.post(uni.$url.refundApply, query);
					let errmsg = res.data.msg;
					
					if (res.data.code !== 0) return uni.$showMsg(errmsg,3500);
					
					uni.navigateTo({
						url: '../order/refund-succee'//实际路径要写全
					})
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
	
	.isfixed {
		background: #FF2222;
	}
	
	.content {
		position: fixed;
		width: 100%;
	}
	
	.order-detail-wrap {
		width: 710rpx;
		margin: 20rpx;
		padding: 30rpx;
		background: #ffffff;
		border-radius: 20px;
		.order-shop-wrap {
			.order-shop-name {
				display: inline-block;
				font-size: 30rpx;
				font-weight: 400;
				color: #000000;
				margin-right: 10rpx;
			}
		
			.icon-arrows {
				display: inline-block;
				width: 13rpx;
				height: 25rpx;
			}
		}
		
		.order-goods-list {
			padding-bottom: 25rpx;
			border-bottom: 1px solid #f1f1f1;
			.cart-goods-item {
				display: flex;
				padding: 15rpx 0;
				background: #ffffff;
				.goods-cover {
					// flex: 1;
					width: 120rpx;
					height: 120rpx;
					margin-right: 20rpx;
					.cover {
						display: inline-block;
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
				}
				.goods-info {
					flex: 5;
					text-align: left;
					.title {
						height: 45rpx;
						line-height: 45rpx;
						font-size: 34rpx;
						font-weight: 400;
						color: #000000;
					}
					.intro-wrap {
						display: flex;
						justify-content: space-between;
						height: 35rpx;
						line-height: 35rpx;
						color: #666666;
						.intro {
							font-size: 24rpx;
							font-weight: 400;
						}
						.count {
							font-size: 34rpx;
							font-weight: 400;
							color: #000000;
							.sign {
								font-size: 24rpx;
							}
						}
					}
					.num-wrap {
						display: flex;
						justify-content: space-between;
						.num {
							font-size: 34rpx;
							height: 40rpx;
							line-height: 40rpx;
							color: #000000;
						}
					}
				}
			}
		}
		.order-goods-count {
			padding: 15rpx 0 0 0;
			.goods-count-item {
				display: flex;
				justify-content: space-between;
				padding: 15rpx 0;
				font-size: 24rpx;
				color: #888888;
				.count {
					color: $custom-theme-color;
					font-size: 34rpx;
					font-weight: 400;
				}
			}
		}
		
	}
	
	.order-refund {
		width: 710rpx;
		margin: 20rpx;
		padding: 30rpx;
		background: #ffffff;
		border-radius: 20px;
		.order-refund-title{
			font-weight: bold;
			color: #000000;
			font-size: 30rpx;
		}
		.order-goods-count {
			padding: 15rpx 0 0 0;
			
			.goods-count-item {
				display: flex;
				flex-direction:row;
				padding: 15rpx 0;
				font-size: 24rpx;
				color: #888888;
				image{
					width: 29rpx;
					height: 30rpx;
				}
				.count {
					color: $custom-theme-color;
					font-size: 34rpx;
					font-weight: 400;
				}
				.order-refund-text{
					color: #000000;
					font-size: 28rpx;
					.count-item-right{
						margin-top: 14rpx;
						font-size: 24rpx;
						color: #888888;
					}
				}
				.order-refund-icon{
					margin: 24rpx 29rpx 0 0;
				}
			}
		}
		
	}
</style>
