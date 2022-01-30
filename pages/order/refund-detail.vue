<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">订单详情</text></block>
			</cu-custom>
		</view>
		
		<view class="content" :style="{'top':tabFix}">
			<scroll-view scroll-y="true" class="order-detail-content" :style="{'height': contentHeihgt+'px'}">		
				<!-- 待付款 -->
				<block>
					<view class="order-status-wrap order-status-delay">
						<view class="order-status">
							<text class="status" v-if="orderInfo.orderStatus == 400">退款中</text>
							<text class="status" v-if="orderInfo.orderStatus == 403">已退款</text>
							<text class="status" v-if="orderInfo.orderStatus == 404">拒绝退款</text>
						</view>
						<view class="order-address">
							<view class="address">
								{{orderInfo.province}}{{orderInfo.city}}{{orderInfo.city}}{{orderInfo.address}}
							</view>
							<view class="user-info">
								<text class="name">{{orderInfo.consignee}}</text>
								<text class="number">{{orderInfo.mobile}}</text>
							</view>
						</view>
					</view>
				</block>
				
				<view class="order-detail-wrap">
					<view class="order-goods-list" >
						<!-- 商品列表 -->
						<block v-for="(item,index) in goodsList" :key="index" :data-id="index">
							<navigator class="cart-goods-item" :url="'../shop/goods?id='+item.goodsId">
								<view class="goods-cover">
									<fr-image class="cover" :src="baseUrl+item.goods.thumbImgUrl" mode="aspectFill" />
								</view>
								<view class="goods-info">
									<view class="title">{{item.goods.name}}</view>
									<view class="intro-wrap">
										<text class="intro" v-if="item.skuName!=null">{{item.skuName}}</text>
										<text class="intro" v-if="item.skuName==null"></text>
										<text class="count"><text class="sign">￥</text>{{item.price}}</text></view>
									<view class="num-wrap">
										<view class="num">x&nbsp;{{item.num}}</view>
									</view>
								</view>
							</navigator>
						</block>
					</view>
					<view class="order-goods-count">
						<view class="goods-count-item">
							<text class="count-item-left">商品总价</text>
							<text class="count-item-right">¥&nbsp;{{orderInfo.totalMoney}}</text>
						</view>
						<view class="goods-count-item">
							<text class="count-item-left">配送费</text>
							<text class="count-item-right">¥&nbsp;0</text>
						</view>
						
						<view class="goods-count-item">
							<text class="count-item-left" style="color: #000;font-size: 30rpx;">实付款：</text>
							<text class="count-item-right"><text class="count">¥&nbsp;{{orderInfo.totalMoney}}</text></text>
						</view>
					</view>
					
					
				</view>
				
				<view class="order-detail-wrap" style="padding: 0 30rpx;">
					<view class="order-goods-info">
						<view class="goods-info-item">
							<text class="goods-info-label" style="font-size: 30rpx;color: #000000;font-weight: bold;">退款信息</text>
						</view>
						<!-- <view class="goods-info-item">
							<text class="goods-info-label">货物状态：</text>
							<text class="goods-info-text">{{feedback.goodsStatus}}</text>
						</view> -->
						<view class="goods-info-item">
							<text class="goods-info-label">退货原因：</text>
							<text class="goods-info-text">{{feedback.reasonTxt}}</text>
						</view>
						<view class="goods-info-item">
							<text class="goods-info-label">退款金额：</text>
							<text class="goods-info-text" style="color: #FF2222;">{{feedback.exceptRefundMoney}}</text>
						</view>
						<view class="goods-info-item">
							<text class="goods-info-label">退款时间：</text>
							<text class="goods-info-text">{{feedback.createTime}}</text>
						</view>
						<view class="goods-info-item">
							<text class="goods-info-label">补充信息：</text>
							<text class="goods-info-text" v-if="feedback.message!=null">{{feedback.message}}</text>
							<text class="goods-info-text" v-if="feedback.message==null"></text>
						</view>
						<view class="goods-info-item">
							<view class="goods-info-text" style="margin-left: 120rpx;">
								<block v-if="feedback.imgUrls.length>0">
									<image v-for="(item,index) in feedback.imgUrls" :key="index" :src="baseUrl+item" mode="aspectFill"></image>
								</block>
							</view>
						</view>
					</view>
				</view>
				
				<button class="order-contact-service" open-type="contact">联系客服</button>
			</scroll-view>
			
			<view class="cart-wrap">
				<view class="op-wrap" style="border: 1px solid #AAAAAA;color:#AAAAAA;"  @click="cancelRefund(orderInfo.orderId)" v-if='orderInfo.orderStatus==400'>撤销退款</view>
				<view class="op-wrap" style="border: 1px solid #AAAAAA;color:#AAAAAA;" @click="delOrder(orderInfo.orderId)" v-if='orderInfo.orderStatus==404 || orderInfo.orderStatus==403'>删除</view>
			</view>
		</view>
	</view>
</template>

<script>
	import FrImage from '@/components/fr-image/fr-image.vue'
	export default {
		data() {
			return {
				tabFix: this.CustomBar + 'px',
				contentHeihgt: 0,
				goodsId: 0,
				baseUrl: uni.$url.baseUrl,
				
				goodsList: {},//商品列表
				orderInfo: {},//订单信息
				feedback: {},//退款信息
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
			
			this.goodsId=option.orderId;
			this.getOrderDetail(option.orderId);
		},
		methods: {
			toRefund(){
				uni.navigateTo({
				  url: '../order/refund?orderId='+this.goodsId
				})
			},
			toOrder(){
				uni.navigateTo({
				  url: '../order/order'
				})
			},
			async getOrderDetail(orderSn) {
				//发起请求订单详情
				const res = await uni.$http.get(uni.$url.refundInfo, {orderId:orderSn});
				
				if (res.data.code !== 0) return uni.$showMsg(res.data.msg,3500);
				
				this.orderInfo = res.data.data.order;
				this.goodsList = res.data.data.order.orderDetailList;
				this.feedback = res.data.data.feedback;
				switch(this.feedback.reason){
					case 1:
						this.feedback.reasonTxt = "尺寸拍错/不喜欢/效果不好";
						break;
					case 2:
						this.feedback.reasonTxt = "卖家发错货";
						break;
					case 3:
						this.feedback.reasonTxt = "主商品破损";
						break;
					case 4:
						this.feedback.reasonTxt = "质量问题";
						break;
				}
			},
			//删除订单
			delOrder(id,index){
				let that=this;
				uni.showModal({
				    title: '提示',
				    content: '确定删除订单吗？',
				    success: function (res) {
				        if (res.confirm) {
				            that.delOrderData(id);
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			async delOrderData(id){
				let res = await uni.$http.post(uni.$url.deleteOrder, {orderId:id});
				
				if (res.data.code !== 0) return uni.$showMsg(msg,3500);
				
				if (res.data.code == 0) {
					
					uni.showToast({
						title: "删除成功",
						duration: 1500,
						icon: 'success'
					})
					
					this.toOrder();
				}
			},
			//撤销退款
			async cancelRefund(id){
				//发起请求订单详情
				const res = await uni.$http.post(uni.$url.cancelRefundApply, {orderSn:id});
				
				if (res.data.code !== 0) return uni.$showMsg(res.data.msg,3500);
				
				this.getOrderDetail(this.goodsId);
				
				uni.showToast({
					title: '撤销成功',
					duration: 1500,
					icon: 'success'
				})
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
	
	/* 订单状态*/
	.order-detail-content {
		padding: 0 0 100rpx 0;
	}
	
	//购物车
	.cart-wrap {
		display: flex;
		position: fixed;
		flex-direction:row-reverse;
		bottom: 0;
		height: 100rpx;
		line-height: 100rpx;
		background: #FFFFFF;
		z-index: 1111;
		width: 100%;
		padding: 20rpx 20rpx 0 20rpx;
	
		.op-wrap {
			font-size: 28rpx;
			font-weight: 400;
			color: #FF2222;
			height: 60rpx;
			line-height: 60rpx;
			padding: 0 30rpx;
			border-radius: 30rpx;
			border: 1px solid #FF2222;
			margin-left: 30rpx;
		}
	}
	.order-status-wrap {
		width: 710rpx;
		margin: 20rpx;
		padding: 30rpx;
		background: #ffffff;
		border-radius: 20px;
		.order-status {
			text-align: center;
			margin-bottom: 30rpx;
			.status {
				font-weight: 34rpx;
				font-weight: bold;
				color: #FF2222;
			}
		}
		.order-address {
			padding: 20rpx 0;
			background: #ffffff;
			border-top: 1px solid #f1f1f1;
			.address {
				line-height: 80rpx;
				font-size: 34rpx;
				font-weight: 400;
				color: #000000;
			}
			.name {
				margin-right: 30rpx;
				line-height: 35rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
			}
			.number {
				line-height: 35rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
			}
		}
		.order-handle {
			display: flex;
			justify-content: space-between;
			padding-top: 30rpx;
			.time-wrap {
				font-size: 28rpx;
				color: #000;
			}
			.time {
				color: #009E00;
			}
			.btn-order-handle {
				height: 60rpx;
				line-height: 60rpx;
				padding: 0 35rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #FFFFFF;
				background: $custom-theme-color;
				border-radius: 30rpx;
				text-align: center;
			}
			.btn-order-delete {
				margin-top: 20rpx;
				height: 60rpx;
				line-height: 60rpx;
				padding: 0 35rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #000000;
				background: #ffffff;
				border: 1px solid #000;
				border-radius: 30rpx;
			}
			.btn-order-again {
				height: 60rpx;
				line-height: 60rpx;
				padding: 0 35rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #000000;
				background: #ffffff;
				border: 1px solid #000;
				border-radius: 30rpx;
			}
		}
	}
	
	.order-status-done {
		.order-status {			
			.status {
				font-size: 34rpx;
				color: #FF2222;
			}
		}
	}
	
	.order-status-delay {
		.order-handle {
			display: flex;
			justify-content: flex-end;
			.op-wrap {
				.btn-order-pay {
					display: inline-block;
					height: 60rpx;
					line-height: 60rpx;
					padding: 0 35rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #FFFFFF;
					background: $custom-theme-color;
					border-radius: 30rpx;
				}
				.btn-order-delete {
					display: inline-block;
					margin-right: 30rpx;
					height: 60rpx;
					line-height: 60rpx;
					padding: 0 35rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #000000;
					background: #ffffff;
					border: 1px solid #000;
					border-radius: 30rpx;
				}
			}
		}
	}

	.order-detail-wrap {
		width: 710rpx;
		margin: 20rpx;
		padding: 30rpx 30rpx 20rpx 30rpx;
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
							color: #888888;
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
				.count-item-left {
					
				}
				.count-item-right {
					
				}
				.count {
					color: $custom-theme-color;
					font-size: 34rpx;
					font-weight: 400;
				}
			}
		}
		.order-goods-info {
			padding: 15rpx 0;
			.goods-info-item {
				padding: 15rpx 0;
				image{
					margin-right: 20rpx;
					width: 100rpx;
					height: 100rpx;
				}
				.cover {
					display: inline-block;
					width: 100%;
					height: 100%;
					border-radius: 10rpx;
				}
				.goods-info-label {
					color: #888888;
					font-size: 24rpx;
				}
			}
		}
	}

	.order-contact-service {
		width: 710rpx;
		height: 90rpx;
		line-height: 90rpx;
		margin: 20rpx;
		padding: 0 30rpx;
		font-size: 30rpx;
		font-weight: 400;
		color: #333333;
		background: #ffffff;
		border-radius: 10px;
		border: none;
		text-align: center;
	}
</style>
