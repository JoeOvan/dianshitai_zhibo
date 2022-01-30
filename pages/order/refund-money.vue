<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">申请退款</text></block>
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
						退款信息
					</view>
					<view class="order-goods-count">
						<view class="goods-count-item" >
							<view class="order-refund-left">
								<view>货物状态<text>*</text></view>
							</view>
							<view class="order-refund-text">
								<!-- <picker @columnchange="bindPickerChange" @change="confirmGoods" mode="selector" :value="index" :range="goodsArray">
									<view class="uni-input" :class="{'active':goodsChange==true}">{{goodsTxt}}</view>
								</picker> -->
								<view class="uni-input">已收到货退款</view>
								<!-- <view><image class="arrows" src="../../static/icon-arrows.png"></image></view> -->
							</view>
						</view>
						
						<view class="goods-count-item" >
							<view class="order-refund-left">
								<view>退款原因<text>*</text></view>
							</view>
							<view class="order-refund-text">
								<picker @columnchange="bindPickerChange" @change="confirmRefund" mode="selector" :value="index" :range="refundArray">
									<view class="uni-input" :class="{'active':refundChange==true}">{{refundTxt}}</view>
								</picker>
								<view><image class="arrows" src="../../static/icon-arrows.png"></image></view>
							</view>
						</view>
						
						<view class="goods-count-item" >
							<view class="order-refund-left">
								<view>选择退货方式<text>*</text></view>
							</view>
							<view class="order-refund-text">
								<picker @columnchange="bindPickerChange" @change="confirmRefundAction" mode="selector" :value="index" :range="refundAction">
									<view class="uni-input" :class="{'active':refundActionChange==true}">{{refundActionTxt}}</view>
								</picker>
								<view><image class="arrows" src="../../static/icon-arrows.png"></image></view>
							</view>
						</view>
						
						<view class="goods-count-item" >
							<view class="order-refund-left">
								<view>退款金额<text>*</text></view>
								<view style="color: #999999;font-size: 24rpx;">不可修改</view>
							</view>
							<view class="order-refund-text" style="color: #FF2222;font-weight: bold;">￥{{orderInfo.totalMoney}}</view>
						</view>
					</view>
					
				</view>
				<view class="order-refund-info">
					<view class="order-refund-title">
						补充描述和凭证
					</view>
					<view class="order-refund-text">
						<view class="order-refund-inp">
							<textarea @input="sumText" v-model="msgText" class="order-refund-textarea" maxlength="200" value="" placeholder="补充描述,有助于商家更好的处理售后问题" />
							<view style="text-align: right;">{{numText}}/200</view>
						</view>
						<view class="order-refund-img">
							<view class="order-refund-up">
								<image src="../../static/upload.png" @click="uploadImg" mode=""></image>
							</view>
							<view class="order-refund-imgList">
								<view v-for="(item,index) in imgArr" :key="index" style="position: relative;">
									<image src="../../static/delImg.png" class="order-refund-del"  @click="delImg(index)"></image>
									<image :src="baseUrl+item">
								</view>
							</view>
						</view>
					</view>
					
				</view>
			</scroll-view>
			<view class="cart-wrap">
				<view class="op-wrap" style="border: 1px solid #333333;color:#333333;" @click="sub">提交</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import FrImage from '@/components/fr-image/fr-image.vue'
	import { mapState, mapMutations } from 'vuex'
	export default {
		computed: {
			// 将 m_user 模块中的 userinfo 映射到当前页面中使用
			...mapState('m_user', ['userinfo','token']),
		},
		data() {
			return {
				tabFix: this.CustomBar + 'px',
				// contentHeihgt: calc(100vh - (this.CustomBar + "px")),
				contentHeihgt: 0,
				orderId: 0,
				index:0,
				goodsStatus:2,
				refundActionStatus:1,
				refundStatus:1,
				goodsChange:false,
				refundChange:false,
				refundActionChange:false,
				baseUrl: uni.$url.baseUrl,
				goodsList: {},//商品列表
				orderInfo: {},//订单信息
				isSub:true,
				goodsTxt:"请选择",
				refundTxt:"请选择",
				refundActionTxt:"请选择",
				imgArr:[],
				goodsArray:["已收到货退款","未收到货退款"],
				refundAction:["快递寄回","本地退回"],
				refundArray:["尺寸拍错/不喜欢/效果不好","卖家发错货","主商品破损","质量问题"],
				numText:0
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
			this.getOrderDetail(option.orderId);
		},
		methods: {
			toOrder(){
				uni.navigateTo({
				  url: '../order/order'//实际路径要写全
				})
			},
			confirmGoods(e){
				this.goodsChange=true;
				this.goodsTxt=this.goodsArray[e.detail.value];
				if(this.goodsTxt){
					this.goodsStatus=2
				}
			},
			confirmRefund(e){
				this.refundChange=true;	
				this.refundTxt=this.refundArray[e.detail.value];
				this.refundStatus=parseInt(e.detail.value)+1;
			},
			confirmRefundAction(e){
				this.refundActionChange=true;	
				this.refundActionTxt=this.refundAction[e.detail.value];
				if(this.refundActionTxt=="本地退回"){
					this.refundActionStatus=2
				}
			},
			
			delImg(e){
				 this.imgArr.splice(e,1);
			},
			sumText(e){
				this.numText=e.detail.value.length;
			},
			uploadImg(){
				let that = this
				uni.chooseImage({
					success: (res) => {
						
						if(res.tempFiles.length > 4 || res.tempFiles.length + that.imgArr.length > 4) return uni.$showMsg("已超出4张图片",2000);
						
						const tempFilePaths = res.tempFilePaths;
						for(let i = 0;i < tempFilePaths.length; i++) {
							uni.uploadFile({
								url: uni.$url.upload, //仅为示例，非真实的接口地址
								filePath: tempFilePaths[i],
								name: 'file_data',
								header: {
									'X-Winzkj-Token': this.$store.state.m_user.token,
								},
								success: (uploadFileRes) => {
									let arr = JSON.parse(uploadFileRes.data)
									that.imgArr.push(arr.fileName);
								}
							});
						}
					}
				})
				
			},
			toRefund(id){
				uni.navigateTo({
				  url: '../order/detail?orderId='+id//实际路径要写全
				})
			},
			async sub() {
				if(this.refundTxt == "请选择"){
					return uni.$showMsg("请选择退款原因",3500);
				}
				if(this.isSub==false){
					return uni.$showMsg("请勿重复提交",3500);
				}
				let query = {
					orderId:this.orderId,
					message:this.msgText,
					type:2,
					goodsStatus:this.goodsStatus,
					refundType:this.refundActionStatus,
					reason:this.refundStatus,
					img:this.imgArr
				};
				
				const res = await uni.$http.post(uni.$url.refundApply, query);
				let errmsg = res.data.msg;
				
				if (res.data.code !== 0) return uni.$showMsg(errmsg,3500);
				
				this.isSub==false;
				uni.redirectTo({
					url: '../order/refund-succee?orderId='+this.orderId//实际路径要写全
				})
			},
			async getOrderDetail() {
				//发起请求订单详情
				const res = await uni.$http.get(uni.$url.orderDetail, {orderId:this.orderId});
				let errmsg = res.data.errmsg;
				if (res.data.code !== 0) return uni.$showMsg(errmsg,3500);
				
				this.orderInfo = res.data.data;
				this.goodsList = res.data.data.orderDetailList;
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
	.order-detail-content{
		padding: 0 0 100rpx 0;
	}
	.content {
		position: fixed;
		width: 100%;
	}
	.active{
		color: #000000;
		font-size: 28rpx;
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
				justify-content: space-between;
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
					display: flex;
					flex-direction:row;
					font-size: 28rpx;
					color: #888888;
					.arrows {
						display: inline-block;
						width: 13rpx;
						height: 25rpx;
						margin: 6rpx 0 0 22rpx;
					}
				}
				.order-refund-left{
					font-size: 28rpx;
					color: #000000;
					text{
						color: #FF2222;
					}
				}
			}
		}
		
	}
	//购物车
	.cart-wrap {
		display: flex;
		position: fixed;
		justify-content:center;
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
	.order-refund-info {
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
		.order-refund-text{
			background-color: #F6F6F6;
			border-radius: 10rpx;
			padding: 20rpx;
			margin: 25rpx 0 0rpx 0;
			.order-refund-textarea{
				width: 607rpx;
				height: 100rpx;
				margin-bottom: 20rpx;
			}
			.order-refund-img{
				display: flex;
				flex-direction:row;
				margin-top: 22rpx;
				image{
					margin-right: 20rpx;
					width: 100rpx;
					height: 100rpx;
				}
				.order-refund-up{
					margin-right: 20rpx;
					width: 100rpx;
					height: 100rpx;
				}
				.order-refund-imgList{
					display: flex;
					flex-direction:row;
					.order-refund-del{
						position: absolute;
						top:-10rpx;
						right: -10rpx;
						width: 28rpx;
						height: 28rpx;
						z-index: 999;
					}
				}
				
			}
		}
		
	}
</style>
