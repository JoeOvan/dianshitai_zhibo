<template>
	<view class="wrapper">
		
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">我的订单</text></block>
			</cu-custom>
		</view>
		
		<view class="content bill-wrap" :style="{'top': tabFix}">
			
			<view class="item-wrap">
				<text class="label">发票类型：</text>
				<text class="btn">电子普通发票</text>
			</view>
			<view class="item-wrap">
				<text class="label">发票内容：</text>
				<text class="btn">商品明细</text>
			</view>
			<view class="item-wrap">
				<text class="label">抬头类型：</text>
				<text class="btn" v-if="billData.headType == 1">个人</text>
				<text class="btn" v-else>单位</text>
			</view>
			<view class="tabs-wrap">
				<view v-if="billData.headType == 1" class="item-tabs active">
					<view class="item-wrap">
						<text class="label">抬头名称：</text>
						<text class="text">{{billData.head}}</text>
					</view>
					<view class="item-wrap">
						<text class="label">手机号码：</text>
						<text class="text">{{billData.mobile}}</text>
					</view>
				</view>
				<view v-else class="item-tabs active">
					<view class="item-wrap">
						<text class="label">抬头名称：</text>
						<text class="text">{{billData.head}}</text>
					</view>
					<view class="item-wrap">
						<text class="label">单位税号：</text>
						<text class="text">{{billData.mobile}}</text>
					</view>
					
					<view class="item-wrap" v-if="billData.registerAddress">
						<text class="label">注册地址：</text>
						<text class="text">{{billData.registerAddress}}</text>
					</view>
					<view class="item-wrap" v-if="billData.registerMobile">
						<text class="label">注册电话：</text>
						<text class="text">{{billData.registerMobile}}</text>
					</view>
					<view class="item-wrap" v-if="billData.bankName">
						<text class="label">开户银行：</text>
						<text class="text">{{billData.bankName}}</text>
					</view>
					<view class="item-wrap" v-if="billData.bankAccount">
						<text class="label">银行账号：</text>
						<text class="text">{{billData.bankAccount}}</text>
					</view>
					
					<view class="item-wrap">
						<text class="label">手机号码：</text>
						<text class="text">{{billData.mobile}}</text>
					</view>
					
				</view>
			</view>
			
		</view>

		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabFix: this.CustomBar + 'px',
				orderId: null,
				billData: {},
			}
		},
		onLoad(options) {
			
			this.orderId = options.orderId;
			
			this.getInvoice();
			
		},
		methods: {
			tabsChange(type) {
				console.log(type);
				this.current = type;
			},
			toggle() {
				this.isShow = !this.isShow;
			},
			async getInvoice() {
				
				//保存发票
				const res = await uni.$http.get(uni.$url.getInvoice, { 	
orderId: this.orderId });
				
				if (res.data.code !== 0) return uni.$showMsg(res.data.msg,3500);
				
				this.billData = res.data.data;
				
			}
		}
	}
</script>

<style lang="scss">
	
	page {
		background: #FFFFFF;
	}
	
	.wrapper {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	
	.nav-fixed {
		position: fixed;
		/* position: relative; */
		width: 100%;
		z-index: 1000;
	}
	
	.isfixed {
		background: #FF2222;
	}
	
	.content {
		position: fixed;
		width: 100%;
		bottom: 108rpx;
		overflow: auto;
	}
	
	.bill-wrap {
		.item-wrap {
			display: flex;
			line-height: 106rpx;
			margin: 0 20rpx;
			padding: 0 20rpx;
			border-bottom: 1rpx solid #F1F1F1;
			align-items: center;
			.label {
				width: 160rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #000000;
				flex-shrink: 0;
			}
			.btn {
				display: inline-block;
				height: 50rpx;
				line-height: 50rpx;
				padding: 0 25rpx;
				margin-right: 30rpx;
				background: #FFE2E2;
				border: 1rpx solid #FF2222;
				border-radius: 25rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #FF2222;
			}
			.btn-gray {
				color: #000000;
				background: #DDDDDD;
				border: none;
			}
			.input-text {
				width: 100%;
			}
		}
		
		.tabs-wrap {
			.item-tabs {
				display: none;
				&.active {
					display: block;
				}
			}
		}
		
		.toggle-wrap {
			display: none;
			&.show {
				display: block;
			}
		}
		
		.handler-toggle {
			display: flex;
			height: 106rpx;
			justify-content: center;
			.btn-toggle {
				display: inline-block;
				height: 50rpx;
				line-height: 50rpx;
				padding: 0 25rpx;
				background: #F6F6F6;
				border: 1rpx solid #888888;
				border-radius: 25rpx;
			}
			
			.triangle-down, .triangle-up {
			  border: 5px dashed transparent;
			  display: inline-block;
			  width: 0;
			  height: 0;
			  line-height: 0;
			  font-size: 0;
			  overflow: hidden;
			  margin-left: 10rpx;
			}
			
			.triangle-down {
			  border-top: 5px solid #888888;
			}
			
			.triangle-up {
			  border-bottom: 5px solid #888888;
			  vertical-align: text-top;
			}
			
		}
		
		
	}

	.handler-wrap {
		position: fixed;
		bottom: 20rpx;
		.btn-submit {
			width: 710rpx;
			height: 68rpx;
			line-height: 68rpx;
			margin: 0 20rpx;
			background: #FF2222;
			border-radius: 10rpx;
			font-size: 30rpx;
			font-weight: 400;
			color: #FFFFFF;
			text-align: center;
		}
	}
</style>
