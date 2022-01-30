<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">编辑收货地址</text></block>
			</cu-custom>
		</view>

		<view class="content" :style="{'top':tabFix}">
			<view class="address-form-wrap">
				<form @submit="saveAddress" class="address-form">
					<view class="address-form-item">
						<text class="label">收货地址</text>
						<view class="form-item-wrap">

							<picker @columnchange="bindPickerChange" @change="confirmAddress" mode="region"
								:value="index" :range="array" style="width: 100%;">
								<view class="uni-input">{{addressTxt}}</view>
							</picker>
							<image class="icon-arrows" src="../../static/icon-arrows.png"></image>
						</view>
					</view>
					<view class="address-form-item">
						<text class="label">门牌号</text>
						<view class="form-item-wrap">
							<input name="detailInfo" type="text" placeholder-style="color:#888888" class="address-input" :value="content.address"
								placeholder="详细地址，例1层101室">
						</view>
					</view>
					<view class="address-form-item">
						<text class="label">联系人</text>
						<view class="form-item-wrap">
							<input name="username" type="text" placeholder-style="color:#888888" class="address-input" :value="content.consignee"
								placeholder="请填写收货人姓名">
							<view class="sex">
								<label style="margin-right: 10rpx;" @click="checked(1)">
									<view class="red radio"><view :class="{'active':isCheck==false}"></view></view>先生
								</label>
								<label @click="checked(2)">
									<view class="red radio"><view :class="{'active':isCheck==true}"></view></view>小姐
								</label>
							</view>
						</view>
					</view>
					<view class="address-form-item">
						<text class="label">手机号：</text>
						<view class="form-item-wrap">
							<input name="telNumber" type="number" placeholder-style="color:#888888" class="address-input" :value="content.mobile"
								placeholder="请填写收货人手机号码">
						</view>
					</view>
					
					<view class="form-handle-wrap">
						<button formType="submit" class="btn-address-submit" @submit="saveAddress">保存地址</button>
						<button class="btn-address-delete" @click="delAddress">删除地址</button>
					</view>
					
				</form>
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
				isCheck:false,
				isDefault:false,
				index: [0, 0, 0],
				content: {
					id: 0,
					consignee: "",
					mobile: 0,
					province: "",
					city: "",
					block: "",
					address: "",
					wxUserId: 0,
					gender: 0,
					is_default: 0,
				},
				addressTxt: "请选择地区"
			}
		},
		onLoad(options) {
			this.content.id=options.id;
			this.getAddress();
			var _this = this
			uni.getSystemInfo({
				success: function(res) {
					_this.contentHeihgt = res.windowHeight - _this.CustomBar;
				}
			});
		},
		methods: {
			checked(sex){
				this.content.gender=sex;
				if(sex==1){
					this.isCheck=false;
				}else{
					this.isCheck=true;
				}
			},
			change(data) {
				this.value = data.data.join(' ')
			},
			confirmAddress(e) {
				this.content.province = e.detail.value[0],
				this.content.city = e.detail.value[1],
				this.content.block = e.detail.value[2],
				this.addressTxt = e.detail.value.join(" ");
			},
			//删除地址
			async delAddress(){
				//发起请求
				const res = await uni.$http.get(uni.$url.deleteAddress, {addressId:this.content.id});
				
				if (res.data.code !== 0) return uni.$showMsg();
				
				uni.showToast({
					title: '删除成功',
					icon: 'success'
				})
				
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					});
				}, 1000)
			},
			//获取地址数据
			async getAddress(){
				//发起请求
				const res = await uni.$http.get(uni.$url.editAddress, {addressId:this.content.id});
				
				if (res.data.code !== 0) return uni.$showMsg();
				
				this.content.id=res.data.data.addressId;
				this.content.mobile=res.data.data.mobile;
				this.content.consignee=res.data.data.consignee;
				this.content.province=res.data.data.province;
				this.content.city=res.data.data.city;
				this.content.block=res.data.data.block;
				this.content.address=res.data.data.address;
				this.content.gender=res.data.data.gender;
				this.content.is_default=res.data.data.isDefault;
				
				if(this.content.gender==1){
					this.isCheck=false;
				}else{
					this.isCheck=true;
				}
				this.addressTxt=this.content.province+' '+this.content.city+' '+this.content.block;
			},
			//保存地址
			async saveAddress(e) {
				//获取表单数据
				let data = e.detail.value;
				
				//正则验证手机号码
				let reg_mobile = new RegExp(/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/);
				// debugger

				let valueList = {
					'detailInfo': '门牌号',
					'username': '联系人',
					'telNumber': '手机号',
				}

				//判断输入值是否为空和验证手机号码
				for (const key in valueList) {
					if (data[key] == null || data[key] == "") {
						wx.showToast({
							title: valueList[key] + '不能为空',
							icon: 'none',
							duration: 4000
						});
						return;
					} else if (key == "telNumber") {
						if (!reg_mobile.test(data[key])) {
							wx.showToast({
								title: '请正确填写您的手机号码',
								icon: 'none',
								duration: 4000
							});
							return;
						}
					}
				}
					
				let query = {
					addressId: this.content.id,
					consignee: data.username,
					mobile: data.telNumber,
					province: this.content.province,
					city: this.content.city,
					block: this.content.block,
					address: data.detailInfo,
					gender: this.content.gender,
					isDefault: this.content.is_default,
				}
				
				//发起请求
				const res = await uni.$http.post(uni.$url.setAddress, query);

				if (res.data.code !== 0) return uni.$showMsg();

				uni.showToast({
					title: '保存成功',
					icon: 'success'
				})
		
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					});
				}, 1000)
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
	}

	/*新增收货地址*/
	.address-form-wrap {
		.form-handle-wrap {
			margin: 20rpx;
			.btn-address-submit {
				width: 100%;
				height: 68rpx;
				line-height: 68rpx;
				font-size: 30rpx;
				color: #ffffff;
				background: $custom-theme-color;
				border-radius: 10rpx;
			}
			.btn-address-delete {
				width: 100%;
				height: 68rpx;
				line-height: 68rpx;
				margin-top: 30rpx;
				font-size: 30rpx;
				color: #000;
				text-align: center;
				background: #FFFFFF;
				border: 1rpx solid #BFBFBF;
				border-radius: 10rpx;
			}
		}
		.address-form-item {
			display: flex;
			line-height: 30rpx;
			font-size: 28rpx;
			padding: 40rpx 5%;
			margin: 0 2%;
			border-bottom: 1rpx solid #F1F1F1;
			align-items: center;

			&:nth-last-child(1) {
				border: none;
			}

			.label {
				display: inline-block;
				flex: 1;
			}

			.form-item-wrap {
				position: relative;
				flex: 4;
				display: flex;
				
				.address-input {
					display: inline-block;
					vertical-align: middle;
					width: 300rpx;
				}

				.icon-location {
					display: inline-block;
					width: 17rpx;
					height: 21rpx;
					vertical-align: top;
					margin-top: 15rpx;
				}

				.icon-arrows {
					position: absolute;
					right: 0;
					top: 5rpx;
					display: inline-block;
					width: 13rpx;
					height: 25rpx;
				}

				.radio {
					display: inline-block;
					transform: scale(0.7);
					position: relative;
					top: 10rpx;
					width: 40rpx;
					height: 40rpx;
					background: #FFFFFF;
					border: 1px solid #BFBFBF;
					border-radius: 20rpx;
				}
				.active{
					width: 24rpx;
					height: 24rpx;
					background: #000000;
					border-radius: 50%;
					position: relative;
					top:7rpx;
					left: 7rpx;
				}
			}

			.btn-address-submit {
				width: 100%;
				height: 68rpx;
				line-height: 68rpx;
				font-size: 30rpx;
				color: #ffffff;
				background: $custom-theme-color;
				border-radius: 10rpx;
			}
		}
	}
</style>
