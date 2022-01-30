<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="false">
				<block slot="backText"><text class="logo-tips">支付成功</text></block>
			</cu-custom>
		</view>
		
		<view class="content" :style="{'top':tabFix}">
			<view class="pay-done-tips">
				{{times}}秒后自动返回首页....
			</view>
			<view class="pay-done-tips">
				<image class="icon-pay-done" src="../../static/icon-pay-done.png"></image>
				<text class="text">支付成功</text>
			</view>
			
			<view class="handle-wrap">
				<view class="btn-order-detail" @click="toOrder" url="order">查看订单</view>
				
				<navigator class="btn-back-home"  url="../index/index" open-type="switchTab">返回首页</navigator>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabFix: this.CustomBar + 'px',
				contentHeihgt: 0,
				times:5,
				//订单id
				orderId: 0,
				timer:null
			}
		},
		onLoad(options) {
			
			this.orderId = options.orderId
			
			var _this = this
			uni.getSystemInfo({
			    success: function (res) {
					_this.contentHeihgt = res.windowHeight - _this.CustomBar;
			    }
			});
			this.getCode();
		},
		onUnload() {
			clearTimeout(this.timer);  
			this.timer = null;  
		},
		methods: {
			toOrder(){
				clearTimeout(this.timer);
				this.timer = null;  
				uni.navigateTo({
				  url: 'order'
				})
			},
			getCode() {
				this.show = false
				this.timer = setInterval(()=>{
					this.times--
					if(this.times===0){
						this.toPage();
						this.show = true
						clearInterval(this.timer)
					}
				},1000)
			},
			toPage(){
				uni.switchTab({
				  url: '../index/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f1f1f1;
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
	
	.pay-done-tips {
		color: $custom-theme-color;
		font-size: 44rpx;
		font-weight: 400;
		padding: 120rpx 0;
		text-align: center;
		.icon-pay-done {
			display: inline-block;
			width: 36rpx;
			height: 36rpx;
			margin-right: 10rpx;
		}
	}
	.handle-wrap {
		text-align: center;
		.btn-order-detail {
			display: block;
			width: 350rpx;
			height: 80rpx;
			line-height: 80rpx;
			padding: 0 40rpx;
			font-size: 32rpx;
			color: #ffffff;
			margin:0 auto 32rpx auto;
			background: $custom-theme-color;
			border-radius: 10rpx;
		}
		.btn-back-home {
			display: block;
			width: 350rpx;
			height: 80rpx;
			line-height: 80rpx;
			padding: 0 40rpx;
			font-size: 32rpx;
			color: $custom-theme-color;
			margin:0 auto 32rpx auto;
			border: none;
			background: #FFFFFF;
			border-radius: 10rpx;
		}
		.btn-back-home::after{
			border: none;
		}
	}
</style>
