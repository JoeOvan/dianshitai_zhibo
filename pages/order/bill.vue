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
				<text v-if="current == 0" class="btn">普通发票</text>
				<text v-if="current == 1" :class="[ billType == 0 ? 'btn': 'btn btn-gray']" @click="billTypeChange(0)">普通发票</text>
				<text v-if="current == 1" :class="[ billType == 1 ? 'btn': 'btn btn-gray']" @click="billTypeChange(1)">专用发票</text>
			</view>
			<view class="item-wrap">
				<text class="label">发票内容：</text>
				<text class="btn">商品明细</text>
			</view>
			<view class="item-wrap">
				<text class="label">抬头类型：</text>
				<text :class="[ current == 0 ? 'btn': 'btn btn-gray']" @click="tabsChange(0)">个人</text>
				<text :class="[ current == 1 ? 'btn': 'btn btn-gray']" @click="tabsChange(1)">单位</text>
			</view>
			<view class="tabs-wrap">
				<view :class="[ current == 0 ? 'item-tabs active': 'item-tabs']">
					<view class="item-wrap">
						<text class="label">抬头名称：</text>
						<input v-model="personHead" type="text" class="input-text" placeholder="请输入抬头名称">
					</view>
					<view class="item-wrap">
						<text class="label">手机号码：</text>
						<input v-model="personMobile" type="number" class="input-text" placeholder="请输入手机号码">
					</view>
				</view>
				<view :class="[ current == 1 ? 'item-tabs active': 'item-tabs']">
					<view class="item-wrap">
						<text class="label">抬头名称：</text>
						<input v-model="unitHead" type="text" class="input-text" placeholder="请输入抬头名称">
					</view>
					<view class="item-wrap">
						<text class="label">单位税号：</text>
						<input v-model="unitTaxNo" type="text" class="input-text" placeholder="请输入单位税号">
					</view>
					
					<view :class="[ isShow ? 'toggle-wrap show': 'toggle-wrap']">
						
						<view class="item-wrap">
							<text class="label">注册地址：</text>
							<input v-model="registerAddress" type="text" class="input-text" placeholder="选填">
						</view>
						<view class="item-wrap">
							<text class="label">注册电话：</text>
							<input v-model="registerMobile" type="text" class="input-text" placeholder="选填">
						</view>
						<view class="item-wrap">
							<text class="label">开户银行：</text>
							<input v-model="bankName" type="text" class="input-text" placeholder="选填">
						</view>
						<view class="item-wrap">
							<text class="label">银行账号：</text>
							<input v-model="bankAccount" type="text" class="input-text" placeholder="选填">
						</view>

					</view>
					
					<view class="item-wrap handler-toggle">
						<view class="btn-toggle" @click="toggle">更多选填项 <view :class="[ isShow ? 'triangle-up': 'triangle-down']"></view></view>
					</view>
					
					<view class="item-wrap">
						<text class="label">手机号码：</text>
						<input v-model="unitMobile" type="number" class="input-text" placeholder="请输入手机号码">
					</view>
					
				</view>
			</view>
			
		</view>
		
		<view class="handler-wrap">
			<view class="btn-submit" @click="saveInvoice">申请开票</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabFix: this.CustomBar + 'px',
				billType: 0,  //发票类型  0是普票 1是专票
				current: 0,
				isShow: false,  //是否显示多选
				orderId: null,
				
				personHead: '', //个人抬头
				personMobile: '', //个人手机号
				
				unitHead: '', //单位抬头
				unitTaxNo: '', //单位税号
				unitMobile: '', //单位手机号
				registerAddress: '', //注册地址
				registerMobile: '',  //注册电话
				bankName: '',  //开户银行
				bankAccount: '',  //银行账号
			}
		},
		onLoad(options) {
			
			this.orderId = options.orderId;
			
			console.log(this.orderId);
		},
		methods: {
			tabsChange(type) {
				this.current = type;
			},
			billTypeChange(type) {
				this.billType = type;
			},
			toggle() {
				this.isShow = !this.isShow;
			},
			async saveInvoice() {
				
				let query = {}
				//正则验证手机号码
				let reg_mobile = new RegExp(/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/);
				
				if(this.current == 0) {
					
					if(!this.personHead) return uni.$showMsg('抬头名称不能为空',3500);
					
					if(!this.personMobile) return uni.$showMsg('手机号不能为空',3500);
					
					if(!reg_mobile.test(this.personMobile)) return uni.$showMsg('请正确填写您的手机号码',3500);
					
					query = {
						type: 1,
						orderId: this.orderId,
						headType: 1,
						head: this.personHead,
						mobile: this.personMobile,
					}
					
				} else {
					
					if(!this.unitHead) return uni.$showMsg('抬头名称不能为空',3500);
					
					if(!this.unitTaxNo) return uni.$showMsg('单位税号不能为空',3500);
					
					if(!this.unitMobile) return uni.$showMsg('手机号不能为空',3500);
					
					if(!reg_mobile.test(this.unitMobile)) return uni.$showMsg('请正确填写您的手机号码',3500);
					
					query = {
						type: this.billType == 0 ? 1 : 2,  //发票类型  1是普票 2是专票
						orderId: this.orderId,
						headType: 2,
						head: this.unitHead,
						mobile: this.unitMobile,
						taxNo: this.unitTaxNo,
						registerAddress: this.registerAddress,
						registerMobile: this.registerMobile,
						bankName: this.bankName,
						bankAccount: this.bankAccount,
					}
					
				}
				
				console.log(query)
				
				// 询问用户是否提交
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '确认发票信息无误，只允许提交一次？'
				}).catch(err => err)
				
				if (err || !succ || !succ.confirm) return;
				
				//保存发票
				const res = await uni.$http.post(uni.$url.saveInvoice, query);
				
				if (res.data.code !== 0) return uni.$showMsg(res.data.msg,3500);
				
				uni.$showMsg(res.data.msg,3500);
				
				uni.redirectTo({
					url: '/pages/order/detail?orderId=' + this.orderId
				})
				
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
				height: 106rpx;
				line-height: 106rpx;
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
