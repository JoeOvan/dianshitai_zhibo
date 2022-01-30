<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">我的收货地址</text></block>
			</cu-custom>
		</view>

		<view class="content" :style="{'top':tabFix,'padding-bottom': tabbarHeight}">
			<view class="order-address-wrap">
				<block v-for="(item,index) in addressList" :key="index">
					<navigator class="order-address">
						
						<view class="user-info" @click="setDefault(item.addressId)">
							<text class="name">{{item.consignee}}</text>
							<text class="number">{{item.mobile}}</text>
							 <text v-if="item.isDefault==1" class="default-text">默认</text>
						</view>
						<view class="address" @click="setDefault(item.addressId)">
							{{item.province+item.city+item.block+item.address}}
						</view>
						<view class="edit-wrap" @click="editAddress" :data-addressid="item.addressId">
							<image class="icon-edit" src="../../static/icon-edit.png"></image>
						</view>
					</navigator>
				</block>
			</view>
			<button class="btn-add-address" @click="addAddress">新增收货地址</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabFix: this.CustomBar + 'px',
				tabbarHeight: '110rpx',
				addressList: [],
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.getAddressList();
		},
		methods: {
			//设置默认地址
			async setDefault(addressId){
				
				const res = await uni.$http.get(uni.$url.setDefault,{addressId});
				
				if(res.data.code !== 0) return uni.$showMsg(res.data.msg);
				
				//添加成功提示
				uni.showToast({
				    title: '已成功默认收货地址',
				    duration: 1000
				});
				
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					});
				}, 1000)
			},
			async getAddressList() {
				// 发起请求
				const res = await uni.$http.post(uni.$url.getAddressList);

				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
				
				this.addressList = res.data.data;

			},
			editAddress(e) {
				uni.navigateTo({
					url: './edit-address?id='+e.currentTarget.dataset.addressid
				})
			},
			addAddress() {
				uni.navigateTo({
					url: './add-address'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #ffffff;
	}
	.nav-fixed {
		position: fixed;
		width: 100%;
		z-index: 1000;
	}

	.isfixed {
		background: $custom-theme-color;
	}

	.content {
		position: fixed;
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}
	
	.default-text{
		margin-left: 10px;
		background: $custom-theme-color;
		padding: 5px 10px;
		font-size: 14px;
		color: #FFFFFF;
		border-radius: 5px;
	}
	
	/*订单地址*/
	.order-address-wrap {
		width: 710rpx;
		margin: 20rpx;
		.order-address {
			position: relative;
			padding: 0 20rpx 20rpx 20rpx;
			border-bottom: 1rpx solid #f1f1f1;
			.address {
				line-height: 35rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
			}
			.name {
				margin-right: 30rpx;
				line-height: 80rpx;
				font-size: 34rpx;
				font-weight: 400;
				color: #000000;
				
			}
			.edit-wrap {
				position: absolute;
				right: 10rpx;
				top: 28rpx;
				display: inline-block;
				width: 91rpx;
				height: 90rpx;
				.icon-edit {
					display: inline-block;
					width: 31rpx;
					height: 30rpx;
					margin: 30rpx;
				}
			}
		}
	}

	//新增收货地址
	.btn-add-address {
		position: fixed;
		bottom: 30rpx;
		width: 710rpx;
		height: 68rpx;
		line-height: 68rpx;
		margin: 0 20rpx;
		font-size: 30rpx;
		text-align: center;
		background: #FFFFFF;
		border: 1rpx solid #BFBFBF;
		border-radius: 10rpx;
		z-index: 1111;
	}
</style>
