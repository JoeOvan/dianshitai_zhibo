<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">提交成功</text></block>
			</cu-custom>
		</view>
		
		<view class="content" :style="{'top':tabFix}">
			<scroll-view scroll-y="true" class="order-detail-content" :style="{'height': contentHeihgt+'px'}">
				
				<view class="order-refund">
					<view class="order-refund-title">
						<view style="color: #000000;font-size: 34rpx;margin-bottom: 36rpx;">您已提交退款申请，请耐心等待</view>
						<view>请耐心等待客服处理， </view>
						<view>退款申请通过后款项将原路返还。</view>
					</view>
					<view class="order-goods-count">
						<view class="goods-count-item" >
							<view class="op-wrap" style="margin-left:0" @click="sub">撤销退款申请</view>
							<view class="op-wrap btn-back" @click="toOrder">返回订单列表</view>
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
				orderSn: 0,
				isSub:true,
				
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
			
			this.orderSn=option.orderId;
		},
		methods: {
			toOrder(){
				uni.navigateTo({
				  url: '../order/order'
				})
			},
			async sub(){
				if(this.isSub==false){
					return uni.$showMsg("请勿重复提交",3500);
				}
				
				// 询问用户是否撤销退款
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '确认撤销退款吗？'
				}).catch(err => err)
				
				if (succ && succ.confirm) {
					//发起请求订单详情
					const res = await uni.$http.post(uni.$url.cancelRefundApply, {orderSn:this.orderSn});
					let errmsg = res.data.msg;
					if (res.data.code !== 0) return uni.$showMsg(errmsg,3500);
					
					uni.showToast({
						title: '撤销成功，自动返回订单列表',
						icon: 'success'
					})
					
					setTimeout(() => {
						this.toOrder()
					}, 1000);	
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
	
	
	.order-refund {
		width: 710rpx;
		margin: 20rpx;
		padding: 30rpx;
		background: #ffffff;
		border-radius: 20px;
		.order-refund-title{
			text-align: center;
			color: #888888;
			font-size: 24rpx;
			padding-bottom: 50rpx;
			border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
		}
		.order-goods-count {
			padding: 15rpx 0 0 0;
			
			.goods-count-item {
				display: flex;
				justify-content:center;
				padding: 15rpx 0;
				font-size: 24rpx;
				color: #888888;
				.op-wrap {
					font-size: 28rpx;
					font-weight: 400;
					border: 1px solid #AAAAAA;
					color:#AAAAAA;
					height: 60rpx;
					line-height: 60rpx;
					padding: 0 30rpx;
					border-radius: 30rpx;
					margin-left: 30rpx;
					&.btn-back {
						color: #333333;
					border: 1px solid #333333;
					}
				}
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
