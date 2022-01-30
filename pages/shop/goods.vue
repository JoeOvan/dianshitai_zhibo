<template>
	<view class="wrapper">
		<view class="nav-fixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="text">商品详情</text></block>
			</cu-custom>
		</view>

		<view class="content" :style="{'top':tabFix}">
			
			<view class="swiper-wrap">

		        <swiper class="screen-swiper" :current="tabIndex" :indicator-dots="false" :circular="true" :autoplay="false" interval="5000"
					duration="500" @change="onswiperchange">
					<swiper-item v-for="(item,index) in goodsData.imgList" :key="index">
						<fr-image class="swiper" :src="item" mode="aspectFill" />
					</swiper-item>
				</swiper>
				
				<button class="tab-left" @click="prevSwiper" :disabled="tabIndex == 0">
					<image class="icon-arrow-left" src="../../static/icon-arrow-left-active.png" mode="aspectFill"
						v-if="tabIndex !== 0"></image>
					<image class="icon-arrow-left" src="../../static/icon-arrow-left.png" mode="aspectFill" v-else>
					</image>
				</button>
				<button class="tab-right" @click="nextSwiper" :disabled="tabIndex == goodsData.imgList.length - 1">
					<image class="icon-arrow-right" src="../../static/icon-arrow-right-active.png" mode="aspectFill"
						v-if="tabIndex !== goodsData.imgList.length - 1"></image>
					<image class="icon-arrow-right" src="../../static/icon-arrow-right.png" mode="aspectFill" v-else>
					</image>
				</button>
				
				<view class="total-wrap">
					<text class="total">{{tabIndex + 1}}/{{goodsData.imgList.length}}</text>
				</view>
				
			</view>

			<view class="goods-info-wrap">
				<view class="goods-intro">
					<view class="goods-intro-discounts">
						<text style="font-size: 30rpx;font-weight: 400;">￥</text><text>{{goodsData.minPrice}}起</text>
					</view>
	<!-- 				<view class="goods-intro-original">
						<text>原价￥{{goodsData.materialDesc}}</text>
					</view> -->
				</view>
				<view class="goods-title">
					<view class="goods-title-text">
						{{goodsData.name}}
					</view>
					<view class="goods-weight">
						<text v-if="goodsData.specList.length>=1">规格：
							<text v-for="(item,index) in goodsData.specList" :key='index'>{{item}}</text>
						</text>
						<text>运费：{{goodsData.shippingName}}</text>
					</view>
				</view>
				<view class="goods-content" v-if="goodsData.content">
					<u-parse :content="goodsData.content|formatRichText"></u-parse>
				</view>
				<view v-else class="tips">
					没有内容
				</view>
				
				<view class="comment-wrap">
					<view class="comment-label">评价：</view>
					<block  v-for="(item,index) in goodsData.commentsList" :key="index">
						<view class="comment-item-wrap">
							<view class="comment-top">
								<view class="comment-top-item">
									<fr-image class="avatar" :src="item.userAvatar" mode="aspectFill" />
									<text class="username">{{ item.createBy }}</text>
								</view>
								<view class="comment-top-item right">{{item.createTime}}</view>
							</view>
							<view class="comment-content">
								<text>{{item.comment}}</text>
								<view class="image-layout-wrap">
									
									<view class="image-wrap image-layout-one" v-if="item.commentImgs.length == 1">
										
										<block v-for="(item1,index1) in item.commentImgs"  :key="index1">
											<image class="swiper" :src="baseUrl+item1" mode="aspectFill" style="height: 422rpx;" @click="getImgIndex(index1,item.commentImgs)"></image>
											
										</block>
									</view>
									
									<view class="image-wrap image-layout-four" v-else-if="item.commentImgs.length >= 2">
										
										<block v-for="(item1,index1) in item.commentImgs"  :key="index1">
											<view class="cover-wrap">
												<image class="swiper" :src="baseUrl+item1" mode="aspectFill" @click="getImgIndex(index1,item.commentImgs)"></image>
											</view>
											
										</block>
									</view>
									
								</view>
							</view>
						</view>
					</block>
				</view>
				
			</view>

		</view>

		
		
		
		<view class="goods-money" style="height: 110rpx;margin-bottom: 0;align-items: center;position: fixed;bottom: 0;">

			<view class="goods-btn">
				<view class="goods-money-cart"  @click="setCart">
					加入购物车
				</view>
				<view class="goods-money-button" @click="toOrderSub">
					立即购买
				</view>
			</view>
		</view>
		<!--商品规格弹框-->
		<sku :open="openSkuModal" :goodsId="goodsId" :isLive="isLive" :liveRoomId="liveRoomId" :anchorId="anchorId" @state='closeSkuModal' @openLoginModal='isLoginModalShow = true' @closeLoginModal='isLoginModalShow = false' style="z-index: 999;height: 0;"></sku>
		
		<login-modal :isShow='isLoginModalShow' @openModal="isLoginModalShow = true" @closeModal="isLoginModalShow = false">
			<template name='left-handle'>
				<button class="btn btn-cancel" @click="isLoginModalShow = false">取消</button>
			</template>
		</login-modal>
		
	</view>
</template>

<script>
	import FrImage from '@/components/fr-image/fr-image.vue'
	import sku from '@/components/sku.vue'
	// 按需导入 mapMutations 这个辅助方法
	import { mapState, mapMutations } from 'vuex'
	export default {
		computed: {
			// 将 m_user 模块中的 userinfo 映射到当前页面中使用
			...mapState('m_user', ['shareCode']),
		},
		components: {FrImage,sku},
		data() {
			return {
				//是否固定顶部
				isfixed: false, 
				tabFix: this.CustomBar + 'px',
				//模态框
				openSkuModal: false,
				
				goodsData: {
					id:0,
					cartNum:0,
					minPrice: 0,
					multity: 0,
					imgList:[],
					name:"",
					materialDesc:"564644",
					isDiscount:0,
					discountPrice:"0.00",
					originalPrice:"0.00",
					skuList:[],
					specList:[],
					content: '',
					shippingName: '',
					thumbImgUrl: '../../static/img-null.jpg',
					commentsList: [],
				},
				goodsId:0,
				baseUrl: uni.$url.baseUrl,
				liveRoomId: 0, //直播间ID
				anchorId: 0,	//主播ID
				type: 1,  //1直播 2商城
				isLive: false   ,//true直播 false商城
				isLoginModalShow: false,  //登录模态框
				
				tabIndex: 0, //swiper切换索引
				
			}
		},
		onLoad(options) {
			
			this.isLive = options.isLive;
			this.type = options.type || '';
			this.liveRoomId = options.liveRoomId || ''; //直播间ID
			this.anchorId = options.anchorId || '';	//主播ID
			
			this.goodsId=options.id;
			this.getGoodsData();
		},
		filters:{
			/**
			 * 处理富文本里的图片宽度自适应
			 * 1.去掉img、video标签里的style、width、height属性
			 * 2.修改所有style里的width属性为max-width:100%
			 * 3.img、video标签添加style属性：max-width:100%;height:auto
			 * 4.去掉<br/>标签
			 * @param html
			 * @return string
			 */
			formatRichText(html) { //控制小程序中图片大小
				// 去掉img标签里的style、width、height属性
				let newContent= html.replace(/<img[^>]*>/gi,function(match,capture){
					match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
					match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
					match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
					return match;
				});
				
				// 去掉video标签里的style、width、height属性
				newContent= html.replace(/<video[^>]*>/gi,function(match,capture){
					match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
					match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
					match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
					return match;
				});
				// 修改所有style里的width属性为max-width:100%
				// 去掉所有style里的font-size属性
				newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
					match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
					match = match.replace(/font-size:[^;]+;/gi, '');
					return match;
				});
				// 去掉<br/>标签
				newContent = newContent.replace(/<br[^>]*\/>/gi, '');
				// img标签添加style属性：max-width:100%;height:auto
				newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin:0px auto;"');
				// video标签添加style属性：max-width:100%;height:auto
				newContent = newContent.replace(/\<video/gi, '<video style="max-width:100%;height:auto;display:block;margin:0px auto;"');
				return newContent;
			}
		},
		// 发送给朋友
		onShareAppMessage(res) {
			
			this.$wxShare.mpShare['title'] = this.goodsData.name || '龙眼直播';
			
			return this.$wxShare.mpShare
			
		},
		//分享到朋友圈
		onShareTimeline(res) {
			
			this.$wxShare.mpShare['title'] = this.goodsData.name || '龙眼直播';
			
			return this.$wxShare.mpShare
		},
		methods: {
			...mapMutations('m_user', ['updateShareCode']),
			onswiperchange(e) {
				
				this.tabIndex = e.detail.current;

			},
			prevSwiper() {
			
				this.tabIndex = --this.tabIndex;
			
			},
			nextSwiper() {
			
				this.tabIndex = ++this.tabIndex;
			
			},
			moveHandle: function() {
				return false
			},
			setCart(){
				if(this.goodsData.multity==2){
					this.addCart()
				}else{
					this.openSkuModal = true;
				}
			},
			toOrderSub(id){
				if(this.goodsData.multity==2){
					this.toOrder();
				}else{
					this.openSkuModal = true;
				}
			},
			async toOrder(){
				let query = {
					goodsId:this.goodsId,
					number:1,
					orderSourceType: this.type,
				}
				
				const res = await uni.$http.post(uni.$url.transFormOrder,query);
				
				if(res.data.code == 401) return this.isLoginModalShow = true;

				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);

				uni.navigateTo({
					url: '../order/liveOrder-submit?type='+this.type+'&goodsId='+this.goodsId+'&skuId=0&number=1&liveRoomId='+this.liveRoomId+'&anchorId='+this.anchorId//实际路径要写全
				})
			},
			//添加购物车
			async addCart(){
				// 发起请求
				const res = await uni.$http.get(uni.$url.addBySkuUrl+"?goodsId="+this.goodsId+"&number=1");
			
				if(res.data.code == 401) return this.isLoginModalShow = true;
			
				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
			
				uni.showToast({
					title: '成功加入购物车',
					icon: 'success'
				})
			},
			// 获取商品详情数据的方法
			async getGoodsData() {
				let res = await uni.$http.get(uni.$url.getGoodsById+this.goodsId);
				
				if(res.data.code !== 0) return uni.$showMsg(res.data.msg);
				
				let data = res.data.data;
				let newImgList = [];
				let newSpecList = [];
				
				if(data.imgList.length>0){
					data.imgList.forEach(item=>{
						let itemImg = item.url !== null ? uni.$url.baseUrl+item.url : '../../static/img-null.jpg';
						newImgList.push(itemImg);
					})
				}else{
					newImgList.push('../../static/img-null.jpg');
				}
				
				if(data.specList.length>0){
					data.specList.forEach(item=> {
						newSpecList.push(item.key)
					})
				}
				
				this.goodsData.imgList = newImgList;
				this.goodsData.name = data.name;
				this.goodsData.minPrice = data.minPrice;
				this.goodsData.multity = data.multity;
				this.goodsData.specList = newSpecList;
				this.goodsData.shippingName = data.shippingName;
				this.goodsData.stock = data.stock;
				this.goodsData.thumbImgUrl = data.thumbImgUrl !== null ? uni.$url.baseUrl + "/" + data.thumbImgUrl : '../../static/img-null.jpg';
				this.goodsData.commentsList = data.commentsList;

				if(data.content!==null){
					//修正图片的域名url
					let regStr = "class=\"richImg\" src=\""+`${this.baseUrl}`+"/profile/upload/";
					let reg = new RegExp("src=\"/profile/upload/","g");
					let contentString = data.content.replace(reg,regStr);
					this.goodsData.content = contentString;
				}
			},
			moveHandle() {
				return false;
			},
			closeSkuModal(e){
				this.openSkuModal=e;
			},
			getImgIndex(index,photos){
				//准备一个装图片路径的  数组imgs
				let imgs = photos.map( item =>{
				//只返回图片路径
					return this.baseUrl + item 
				})
				// console.log(imgs);
				//调用预览图片的方法
				uni.previewImage({
					urls:imgs,
					current:index
				})
			}
		},
	}
</script>

<style lang="scss">
	page {
		background: #f4f4f4;
	}

	.wrapper {
		&.fixed {
			position: fixed;
			width: 100%;
			z-index: 100;
		}
		.content {
			position: relative;
		}
	}

	.nav-fixed {
		position: fixed;
		width: 100%;
		z-index: 1000;
		background: #FF2222;
	}

	.isfixed {

	}

	.swiper-wrap {
		position: relative;
		//轮播图
		.screen-swiper {
			width: 750rpx;
			height: 750rpx;
		}
		.total-wrap {
			position: absolute;
			right: 20rpx;
			bottom: 20rpx;
			.total {
				color: #FFFFFF;
				padding: 10rpx;
				border-radius: 10rpx;
				background: rgba($color: #000000, $alpha: 0.5);
			}
		}
		button[disabled]:not([type]) {
			background-color: transparent;
		}
		.tab-left {
			position: absolute;
			top: 45%;
			left: 0;
			padding: 0;
			margin: 0;
			line-height: 1;
			background-color: transparent;
			border: none;
	
			&::after {
				content: '';
				border: none;
			}
	
			.icon-arrow-left {
				display: inline-block;
				width: 17rpx;
				height: 28rpx;
				padding: 22rpx 20rpx;
				box-sizing: content-box;
				border: none;
			}
		}
	
		.tab-right {
			position: absolute;
			top: 45%;
			right: 0;
			padding: 0;
			margin: 0;
			line-height: 1;
			background-color: transparent;
			border: none;
	
			&::after {
				content: '';
				border: none;
			}
	
			.icon-arrow-right {
				display: inline-block;
				width: 17rpx;
				height: 28rpx;
				padding: 22rpx 20rpx;
				box-sizing: content-box;
				border: none;
			}
		}
	}

	.goods-money{
		flex-direction: row;
		display: flex;
		font-size: 14px;
		margin-bottom: 10px;
		bottom: 0px;
		width: 100%;
		background: #fff;
		.goods-money-num{
			font-weight: bold;
			color: #FF2222;
			font-size:20px;
			width: 280rpx;
		}
		.goods-btn{
			display: flex;
			flex-direction: row;
			position: absolute;
			right: 0;
			margin-right: 20rpx;
			.goods-money-button{
				font-weight: 400;
				color: #FFFFFF;
				height: 30px;
				line-height: 30px;
				padding: 0 15px;
				background: linear-gradient(0deg, #030000 0%, #FF0054 0%, #FFA14D 100%);
				border-radius: 15px;
			}
			.goods-money-cart{
				font-weight: 400;
				color: #FF2222;
				height: 30px;
				line-height: 30px;
				padding: 0 10px;
				border-radius: 15px;
				border: 1px solid #FF2222;
				margin-right: 20rpx;
			}
		}

	}
	//购物车
	.cart-wrap {
		display: flex;
		position: fixed;
		bottom: 0;
		width: 710rpx;
		height: 100rpx;
		line-height: 100rpx;
		background: #FFFFFF;
		border-radius: 50rpx;
		margin: 20rpx;
		text-align: center;
		box-shadow: 0px 3px 19px 1px rgba(0, 0, 0, 0.3);
		z-index: 1111;

		.price-wrap {
			width: 180rpx;

			.price {
				font-size: 44rpx;
				font-weight: bold;
				color: #FF5D48;
			}
		}

		.tips {
			width: 300rpx;
			font-size: 30rpx;
			color: #888888;
		}

		.op-wrap {
			width: 250rpx;
			font-size: 30rpx;
			font-weight: 400;
			color: #FFFFFF;
			background: $custom-theme-color;
			border-radius: 0px 50px 50px 0px;
		}
	}

	//商品信息
	.goods-info-wrap {
		background: #ffffff;
		box-sizing: border-box;

		.goods-intro {
			background-color: #FF2222;
			font-size: 30rpx;
			font-weight: 400;
			color: #fff;
			padding: 30rpx;
			display: flex;
			.goods-intro-discounts{
				font-size: 44rpx;
				font-weight: bold;
			}
			.goods-intro-original{
				margin:8rpx 0 0 57rpx;

			}
		}
		.goods-title {
			font-size: 34rpx;
			color: #000;
			padding: 30rpx;
			word-wrap:break-word;
			.goods-weight{
				margin-top: 20rpx;
				color: #666666;
				font-size: 24rpx;
				text {
					margin-right: 50rpx;
				}
			}
		}
		.goods-content{
			background-color: #f6f6f6;
			padding: 20rpx 0 130rpx 0;
			display: flex;
			flex-direction:column;
		}
		.tips {
			text-align: center;
			padding: 50rpx;
		}
	}
	
	.goods-content {
		video {
			width: 100% !important;
		}
	}

	.richImg {
		max-width: 100%;
	}
	
	.comment-wrap {
		background: #f7f4f8;
		margin-bottom: 120rpx;
		.comment-label {
			padding: 0 20rpx;
			&::before {
				display: inline-block;
				content: '';
				width: 5rpx;
				height: 25rpx;
				background: #333333;
				vertical-align: middle;
				margin-right: 10px;
			}
		}
		.comment-item-wrap{
			.comment-top{
				padding: 0 40rpx;
				height: 80rpx;
				display: flex;
				flex-direction: row;
				.comment-top-item {
					display: flex;
					position: relative;
					width: 50%;
					align-items: center;
					.avatar {
						display: inline-block;
						width: 48rpx;
						height: 48rpx;
						margin-right: 10rpx;
					}
					image{
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
					.username {
						display: inline-block;
					}
					.comment-top-from{
						font-size: 9px;
						color: #888888;
						text{
							color: #000000;
							margin-left: 5px;
						}
					}
				}
				.right{
					text-align: right;
					color: #888888;
					font-size: 12px;
					line-height: 80rpx;
					display: block;
				}
			}
			.comment-content{
				margin: 5rpx 28rpx 10rpx 100rpx;
				padding-bottom: 10px;
				border-bottom:1px #DDDDDD solid;
				color: #000000;
				text{
					margin-bottom: 10px;
				}
				.image-layout-wrap {
					// display: inline-block;;
					// overflow:hidden;
					.image-wrap {
						
					}
					.image-layout-one {
						
					}
					.image-layout-four {
						display: flex;
						flex-wrap: wrap;
						flex-direction: row;
						width: calc(100% + 30rpx);
						position: relative;
						left: -15rpx;
						.cover-wrap {
							position: relative;
							display: inline-block;
							width: 46%;
							height:0;
							padding-top:45%;
							margin: 2%;
							overflow: hidden;
							.swiper {
								position: absolute;
								left: 0;
								top: 0;
								display: inline-block;
								width: 100%;
								height: 100%;
							}
						}
					}
				}
			}
		}
	}
	
	.btn {
		flex: 1;
		background: #ffffff;
		border: none;
		font-size: 40rpx;
	}
	.btn-cancel {
		color: #333333;
		border-right: 1rpx solid #f1f1f1;
	}
	.btn-login {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
</style>
