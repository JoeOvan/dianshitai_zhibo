<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">提交订单</text></block>
			</cu-custom>
		</view>

		<view class="content" :style="{'top':tabFix}">
			<scroll-view scroll-y="true" class="order-detail-content" :style="{'height': contentHeihgt+'px'}">
				<view class="order-address-wrap">
					<view class="add-address-wrap" v-if="hasAddress == false">
						<view class="btn-add-address" @click="addAddress">
							<image class="icon-add" src="../../static/add.png"></image>
							<text class="text">新增收货地址</text>
						</view>
					</view>
					<navigator class="order-address" url="../user/address-list" v-else>
						<view class="user-info">
							<text class="name">{{address.consignee}}</text>
							<text class="number">{{address.mobile}}</text>
						</view>
						<view class="address">
							{{address.province}}{{address.city}}{{address.block}}{{address.address}}
						</view>
						
						<view class="arrows-wrap">
							<image class="icon-arrows" src="../../static/icon-arrows.png"></image>
						</view>
					</navigator>
				</view>

				<view class="order-detail-wrap">
					<view class="order-goods-list">
						<view class="cart-goods-item">
							<view class="goods-cover">
								<image class="cover" :src="baseUrl+order.goods.thumbImgUrl" mode="aspectFill"></image>
							</view>
							<view class="goods-info">
								<view class="title">{{order.goods.name}}</view>
								<view class="intro-wrap" v-if="order.skuName!=null"><text class="intro">{{order.skuName}}</text></view>
								<view class="intro-wrap" v-if="order.skuName==null"><text class="intro"></text></view>
								<view class="price-wrap">
									<view class="price"><text class="sign">￥</text>{{order.price}}</view>
									<view class="goods-sum">
										<view class="num">X{{order.number}}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="order-goods-count">
						<view class="goods-count-item" >
							<text class="count-item-left">配送方式</text>
							<view class="count-item-right">快递 免邮</view>
						</view>
						<view class="goods-count-item">
							<text class="count-item-left">订单备注</text>
							<view class="count-item-right"><input class="remark-input" placeholder-style="color:#888888"
									placeholder="备注内容选填" :value="postscript" @input="onInputPostscript"/></view>
						</view>
					</view>
				</view>

				<view class="cart-wrap">
					<view class="price-wrap">共{{order.number}}件，合计<text>¥</text><text style="font-weight: bold;font-size: 28px;">{{order.totalCost}}</text></view>
					<view class="op-wrap" @click="payOrder" v-if="isLoad==false">提交订单</view>
					<view class="op-wrap" style="background:#AAAAAA;color: #FFFFFF ;" v-if="isLoad==true">提交订单</view>
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
				contentHeihgt: 0,

				// 收货地址
				address: {
					addressId:"",
					block:"",
					city:"",
					province:"",
					consignee:"",
					mobile:"",
					address:"",
				},

				//购物车
				goodsCount: 0,
				goodsPrice: 0,
				
				order:{},
				goodsId:0,
				skuId:0,
				goodsNum:0,
				
				hasAddress:true,
				//订单备注
				postscript: '',
				isLoad: false,
				baseUrl: uni.$url.baseUrl,
				type: 1,  //1为直播间 2商品详情
			}
		},
		components:{FrImage},
		onLoad(options) {
			
			//1为直播间 2商品详情
			this.type = options.type || 2;
			
			this.goodsId=options.goodsId;
			this.skuId=options.skuId;
			this.goodsNum=options.number;

			//直播间信息
			this.liveRoomId = options.liveRoomId || '';
			this.anchorId = options.anchorId || '';
			
			this.getLiveGoodsData();
			
			var _this = this
			uni.getSystemInfo({
				success: function(res) {
					_this.contentHeihgt = res.windowHeight - _this.CustomBar;
				}
			});
		},
		onShow() {
			this.getAddressList();
		},
		methods: {
			addAddress() {
				uni.navigateTo({
					url: '/pages/user/add-address'
				})
			},
			//直播间商品结算
			async getLiveGoodsData() {
				// 发起请求
				let query={};
				if(this.skuId==0){
					query = {
						goodsId:this.goodsId,
						number:this.goodsNum,
						orderSourceType: this.type,
						liveRoomId: this.liveRoomId,
						anchorId: this.anchorId
					}
				}else{
					query = {
						goodsId:this.goodsId,
						skuId:this.skuId,
						number:this.goodsNum,
						orderSourceType: this.type,
						liveRoomId: this.liveRoomId,
						anchorId: this.anchorId
					}
				}
				const res = await uni.$http.post(uni.$url.transFormOrder,query);

				if (res.data.code !== 0) return uni.$showMsg(); 
				
				this.order = res.data.data;
				
			},
			onInputPostscript(e) {
				this.postscript = e.detail.value;
			},
			async getAddressList() {
				// 发起请求
				const res = await uni.$http.post(uni.$url.getAddressList);
			
				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
				
				for(let i=0;i<res.data.data.length;i++){
					if(res.data.data[i].isDefault==1){
						this.hasAddress=true;
						this.address.addressId=res.data.data[i].addressId;
						this.address.block=res.data.data[i].block;
						this.address.city=res.data.data[i].city;
						this.address.province=res.data.data[i].province;
						this.address.consignee=res.data.data[i].consignee;
						this.address.mobile=res.data.data[i].mobile;
						this.address.address=res.data.data[i].address;
					}
				};
				if(this.address.addressId==0){
					this.hasAddress=false;
				}
			
			},
			//下单支付
			async payOrder() {
				uni.showLoading({
					title: '等待下单成功'
				})
				

				
				if(this.address.addressId == null || this.address.addressId == '') return uni.$showMsg('请填写地址！');
			
				
				let orderInfo = {
					remake:this.postscript,
					addressId: this.address.addressId,
					goodsId: this.goodsId,
					skuId: this.skuId,
					number: this.goodsNum,
					orderSourceType: this.type,
					liveRoomId: this.liveRoomId,
					anchorId: this.anchorId
				}
				
				//防止短时间内重复提交
				if(this.isLoad) return uni.hideLoading();
				
				// this.isLoad = false;
				this.isLoad = true;
				
				//发起请求创建订单
				const res = await uni.$http.post(uni.$url.simpleSubmitOrder, orderInfo);
				
				//防止短时间内重复提交
				//1.5秒后取消button禁用
				setTimeout(() => {
					this.isLoad = false;
				},1500);

				if (res.data.code !== 0) return uni.$showMsg("支付失败",3500);
				
				//得到服务器响应的“订单编号”
				const orderId = res.data.data.paySn;

				// 订单预支付
				// 发起请求获取订单的支付信息
				const res2 = await uni.$http.get(uni.$url.orderPay, { paySn: orderId });
				
				// 预付订单生成失败
				if (res2.data.code !== 0) return uni.$showMsg('预付订单生成失败！', 3500);

				// 得到订单支付相关的必要参数
				const payInfo = res2.data.data
			
				if(res2.data.code == 0){
					uni.hideLoading();
					// this.isLoad=false;
				}
			
				// 真实支付
				// 发起微信支付
				// 调用 uni.requestPayment() 发起微信支付
				const [err, succ] = await uni.requestPayment(payInfo)
				// 未完成支付
				if (err) {
					
					 uni.$showMsg('订单未支付！');
					 
					 // uni.redirectTo({
						// url: "./detail?orderId=" + orderId
					 // })
					 
					 uni.redirectTo({
					 	url: '/pages/order/order'
					 })
					 
					 return 
				}
				// //模拟支付成功回调
				// const res3 = await uni.$http.post(uni.$url.orderPayNotify, { orderSn: orderSn })
				
				// if (res.statusCode !== 200) return uni.$showMsg('订单未支付！');
				
				// 完成了支付，进一步查询支付的结果
				// const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
				// // 检测到订单未支付
				// if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
				// 检测到订单支付完成

				uni.showToast({
				 title: '支付完成！',
				 icon: 'success'
				})
			
				uni.reLaunch({
					url: "./done?orderId=" + orderId
				})
				
			},
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

	//购物车
	.cart-wrap {
		display: flex;
		position: fixed;
		bottom: 0;
		height: 100rpx;
		line-height: 100rpx;
		background: #FFFFFF;
		text-align: right;
		z-index: 1111;
		width: 100%;

		.price-wrap {
			width: 520rpx;
			font-size: 24rpx;
			color: #888888;
			text{
				color: #FF2222;
			}
		}

		.op-wrap {
			position: absolute;
			right: 40rpx;
			font-size: 30rpx;
			top: 20rpx;
			font-weight: 400;
			color: #FFFFFF;
			height: 60rpx;
			line-height: 60rpx;
			padding: 0 30rpx;
			background: linear-gradient(0deg, #030000 0%, #FF0054 0%, #FFA14D 100%);
			border-radius: 15px;
		}
	}

	/*购物车*/
	.order-address-wrap {
		width: 710rpx;
		margin: 20rpx;
		padding: 30rpx;
		background: #ffffff;
		border-radius: 20px;

		.add-address-wrap {
			text-align: center;

			.btn-add-address {
				display: inline-block;
				width: 340rpx;
				height: 68rpx;
				line-height: 68rpx;
				margin: 15rpx 0;
				color: #000000;
				font-size: 30rpx;
				font-weight: 400;
				border-radius: 34rpx;
				background: #FFFFFF;
				border: 1px solid #AAAAAA;
				.icon-add {
					display: inline-block;
					width: 18rpx;
					height: 18rpx;
					margin-right: 15rpx;
					vertical-align: middle;
					bottom: 2px;
				}
			}
		}

		.order-address {
			position: relative;
			padding: 0 0 20rpx 0;
			background: #ffffff;

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

			.number {
				line-height: 80rpx;
				font-size: 34rpx;
				font-weight: 400;
				color: #000000;
			}

			.arrows-wrap {
				position: absolute;
				right: 10rpx;
				top: 55rpx;
				display: inline-block;
				width: 13rpx;
				height: 25rpx;

				.icon-arrows {
					display: inline-block;
					width: 100%;
					height: 100%;
				}
			}
		}

		.order-time-wrap {
			display: flex;
			justify-content: space-between;
			color: #000000;
			font-size: 28rpx;
			padding-top: 30rpx;
			border-top: 1rpx solid #f1f1f1;

			.order-time-left {
				font-weight: 400;
			}

			.order-time-right {
				font-weight: 400;

				.text {
					color: #009E00;
				}

				.arrows-wrap {
					display: inline-block;
					width: 13rpx;
					height: 25rpx;
					margin-left: 27rpx;

					.icon-arrows {
						display: inline-block;
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}

	/*订单信息*/
	.order-detail-wrap {
		width: 710rpx;
		margin: 20rpx;
		padding: 20rpx 30rpx;
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
						text-overflow: ellipsis;
						overflow: hidden;
						width: 50%;
						display: inline-block;
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
						}
					}

					.price-wrap {
						display: flex;
						justify-content: space-between;

						.price {
							font-size: 34rpx;
							height: 40rpx;
							line-height: 40rpx;
							color: $custom-theme-color;
							font-weight: bold;

							.sign {
								font-size: 24rpx;
							}
						}
						.goods-sum{
							position: absolute;
							right: 50rpx;
							flex-direction: row;
							image{
								width: 25px;
								height: 25px;
							}
							.subtract {
								display: inline-block;
								width: 50rpx;
								height: 50rpx;
							
								.icon-subtract {
									display: inline-block;
									
								}
							}
							
							.add {
								display: inline-block;
								width: 50rpx;
								height: 50rpx;
							
								.icon-add {
									display: inline-block;
									
								}
							}
							
							.num {
								display: inline-block;  
								margin: 0 28rpx;
								position: relative;
								top: 7rpx;
							}
						}
					}
				}
			}
		}

		.order-goods-count {
			padding: 15rpx 0 0 0;
			.goods-count-item {
				position: relative;
				display: flex;
				justify-content: space-between;
				padding: 15rpx 0;
				font-size: 30rpx;
				.goods-sum{
					position: absolute;
					right: 0;
					flex-direction: row;
					image{
						width: 25px;
						height: 25px;
					}
					.subtract {
						display: inline-block;
						width: 50rpx;
						height: 50rpx;
					
						.icon-subtract {
							display: inline-block;
						}
					}
					
					.add {
						display: inline-block;
						width: 50rpx;
						height: 50rpx;
					
						.icon-add {
							display: inline-block;
							
						}
					}
					
					.num {
						display: inline-block;  
						margin: 0 28rpx;
						position: relative;
						bottom: 6px;
					}
				}
				.icon-arrows {
					display: inline-block;
					width: 13rpx;
					height: 25rpx;
					margin-left: 25rpx;
				}

				.count {
					color: $custom-theme-color;
					font-size: 34rpx;
					font-weight: 400;
				}

				.remark-input {
					text-align: right;
				}
			}
		}
	}
</style>
