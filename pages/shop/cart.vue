<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">购物车</text></block>
			</cu-custom>
		</view>

		<view class="content" :style="{'top':tabFix}">
			<view class="tabContent">
				<!-- 展示列表内容 -->
				<block v-if="goodsData.length>0">
					<view class="cart-goods-item" v-for="(item,index) in goodsData" :key="index">
						<view class="goods-del" @click="delCart(index)">
							<image src="../../static/del.png" mode="aspectFill"></image>
						</view>
						<view class="goods-checked" @click="setCheckbox(item.cartId)">
							<image src="../../static/checkbox.png" v-if="item.isChecked==2" mode="aspectFill"></image>
							<image src="../../static/checkbox-active.png" v-else mode="aspectFill"></image>
						</view>
						<view class="goods-cover" @click="setCheckbox(item.cartId)" style="position: relative;">
							<fr-image class="cover" :src="baseUrl+item.goods.thumbImgUrl" mode="aspectFill" />
							<block v-if="item.sku!=null">
								<view class="goods-cover-img" v-if="item.sku.isDelete==true">
									<view>无货</view>
									<view>Soid out</view>
								</view>
							</block>
						</view>
						<view class="goods-info">
							<view class="title" @click="toPage(item.goodsId)">{{item.goods.name}}</view>
							<view class="intro-wrap"><text class="intro"
									v-if="item.skuName!=null">{{item.skuName}}</text></view>
							<view class="price-wrap">
								<view class="price"><text class="sign">￥</text>{{item.price}}</view>
								<view class="goods-sum">
									<view class="subtract" @click="reduce(index)">
										<image class="icon-subtract" src="../../static/-.png"></image>
									</view>
									<view class="num">{{item.number}}</view>
									<view class="add" @click="add(index)">
										<image class="icon-add" src="../../static/+.png"></image>
									</view>
								</view>
							</view>
						</view>
						<block v-if="item.sku!=null">
							<view class="goods-null" v-if="item.sku.isDelete==true"></view>
						</block>
					</view>
				</block>
				<block v-else>
					<view style="text-align: center;margin: 100rpx 0 30rpx 0;font-size: 16px;">购物车是空的</view>
					<view style="display: flex;justify-content:center">
						<view style="padding: 5rpx 15rpx;border: 1px #888888 solid;border-radius: 25rpx;"
							@click="toShop">
							逛逛商城
						</view>
					</view>
				</block>
			</view>
			<view class="cart-wrap">
				<view class="price-wrap">共{{goodsNum}}件，合计<text>¥</text><text
						style="font-weight: bold;font-size: 28px;">{{goodsPrice}}</text></view>
				<view class="op-wrap" @click="payOrder" v-if="goodsIds.length>0">去结算</view>
				<view class="op-wrap" style="background: #888888;color: #FFFFFF;" v-if="goodsIds.length==0">去结算</view>
			</view>
		</view>

		<login-modal :isShow='isLoginModalShow' @openModal="isLoginModalShow = true"
			@closeModal="isLoginModalShow = false" @getCart="getData"></login-modal>

	</view>
</template>

<script>
	import FrImage from '@/components/fr-image/fr-image.vue'
	export default {
		components: {
			FrImage
		},
		data() {
			return {
				topRange: 0, //导航栏初始化距顶部的距离
				scrollSize: 0, //滚动距离
				isfixed: false, //是否固定顶部
				isChecked: 2,
				isLoad: false,

				//防止与弹出层同步滚动
				isWrapperFixed: false,
				tabFix: this.CustomBar + 'px',
				isTabFix: {
					top: 'auto'
				},

				swiperContentHeight: 0, //切换内容固定高度
				swiperHeight: 500, //这里是动态赋值的高度
				isloading: false, // 是否正在请求数据

				swiper: {},
				goodsData: [],
				goodsPrice: 0,
				goodsNum: 0,
				goodsIds: [],
				baseUrl: uni.$url.baseUrl,

				isLoginModalShow: false, //登录模态框
			}
		},
		onLoad() {
			this.getData()
		},
		onShow() {
			this.onCheckLogin();
		},
		//下拉刷新
		onPullDownRefresh() {
			this.getData()
			uni.stopPullDownRefresh();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			async onCheckLogin(e) {

				let code = await this.getAuthToken();

				if (code !== 401) return;

				// if(this.token) return;
				this.updateUserInfo({})
				this.updateToken('')

				this.isLoginModalShow = true;
				// this.$emit("openModal");

			},
			async getAuthToken() {
				let token = this.$store.state.m_user.token;
				if (!token || token == '') {

					this.isLoginModalShow = true;

					return 0;
				} else {

					const res = await uni.$http.get(uni.$url.authToken);

					return res.data.code;

				}

			},
			//获取列表数据
			async getData() {
				
				// 发起请求
				const res = await uni.$http.get(uni.$url.getCartUrl);

				if (res.data.code == 401) return this.isLoginModalShow = true;
				
				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);

				this.goodsData = res.data.data;
				for (let i = 0; i < this.goodsData.length; i++) {
					let sum = this.goodsData[i].price * this.goodsData[i].number;

					if (this.goodsData[i].isChecked == 1) {
						this.goodsIds.push(this.goodsData[i].goodsId);
						this.goodsPrice = this.accAdd(this.goodsPrice, sum);
						this.goodsNum += this.goodsData[i].number;
					}
				}
			},
			//更新选中
			setCheckbox(id) {
				for (let i = 0; i < this.goodsData.length; i++) {
					if (this.goodsData[i].cartId == id) {
						//更新选中状态和计算结算总额
						let sum = this.goodsData[i].price * this.goodsData[i].number;

						if (this.goodsData[i].isChecked == 1) {
							for (let k = 0; k < this.goodsIds.length; k++) {
								if (this.goodsIds[k] == id) {
									this.goodsIds.splice(k, 1);
								}
							}

							this.goodsPrice = this.accSubtr(this.goodsPrice, sum);
							this.goodsNum -= this.goodsData[i].number;
							this.goodsData[i].isChecked = 2;
							this.reduceCartOrder(this.goodsData[i].cartId);
						} else {
							this.goodsIds.push(id);
							this.goodsPrice = this.accAdd(this.goodsPrice, sum);
							this.goodsNum += this.goodsData[i].number;
							this.goodsData[i].isChecked = 1;
							this.addCartOrder(this.goodsData[i].cartId);
						}
					}
				}
			},
			//减法浮点数运算
			accSubtr(arg1, arg2) {
				var r1, r2, m, n;
				try {
					r1 = arg1.toString().split(".")[1].length
				} catch (e) {
					r1 = 0
				}
				try {
					r2 = arg2.toString().split(".")[1].length
				} catch (e) {
					r2 = 0
				}
				m = Math.pow(10, Math.max(r1, r2));
				//动态控制精度长度
				n = (r1 >= r2) ? r1 : r2;

				//字符串转数字
				return parseFloat(((arg1 * m - arg2 * m) / m).toFixed(n));
			},
			//加法浮点运算
			accAdd(arg1, arg2) {
				var r1, r2, m;
				try {
					r1 = arg1.toString().split(".")[1].length
				} catch (e) {
					r1 = 0
				}
				try {
					r2 = arg2.toString().split(".")[1].length
				} catch (e) {
					r2 = 0
				}
				m = Math.pow(10, Math.max(r1, r2))
				return parseFloat(((arg1 * m + arg2 * m) / m).toFixed(2));
			},
			//统计价格总和
			sumGoodsPrice(i, type) {
				if (this.goodsData[i].isChecked == 1) {
					if (type == 0) {
						this.goodsPrice = this.accAdd(this.goodsPrice, this.goodsData[i].price);
					} else {
						this.goodsPrice = this.accSubtr(this.goodsPrice, this.goodsData[i].price);
					}
				}
			},
			//选中购物车
			async addCartOrder(id) {
				// 发起请求
				const res = await uni.$http.get(uni.$url.confirmChecked, {
					cartId: id
				});

				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
			},
			//取消选中购物车
			async reduceCartOrder(id) {
				// 发起请求
				const res = await uni.$http.get(uni.$url.cancelChecked, {
					cartId: id
				});

				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
			},
			//商品数量增加
			async add(i) {
				// 发起请求
				const res = await uni.$http.get(uni.$url.addCart, {
					cartId: this.goodsData[i].cartId
				});

				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);

				this.goodsData[i].number++;
				this.goodsNum++;
				this.sumGoodsPrice(i, 0);
			},
			//商品数量减少
			async reduce(i) {
				if (this.goodsData[i].number == 1) return false;
				// 发起请求
				const res = await uni.$http.get(uni.$url.delCart, {
					cartId: this.goodsData[i].cartId
				});

				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);

				this.goodsData[i].number--;
				this.goodsNum--;
				this.sumGoodsPrice(i, 1);
			},
			//删除购物车商品
			delCart(i) {
				let that = this;
				// 询问用户是否登录
				uni.showModal({
					title: '删除提示',
					content: '确认删除吗？',
					success: function(res) {
						if (res.confirm) {
							that.delCartApi(i);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//删除购物车商品
			async delCartApi(i) {
				let sum = this.goodsData[i].price * this.goodsData[i].number;
				this.goodsPrice = this.accSubtr(this.goodsPrice, sum);
				this.goodsNum -= this.goodsData[i].number;

				// 发起请求
				let that = this;
				const res = await uni.$http.get(uni.$url.delAllCart, {
					ids: this.goodsData[i].cartId
				});

				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);

				uni.showToast({
					title: '删除成功',
					icon: 'success'
				})

				this.goodsData.splice(i, 1)
			},
			//订单结算跳转
			async payOrder() {
				const res = await uni.$http.post(uni.$url.settlement);

				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);

				uni.navigateTo({
					url: '../order/order-submit?type=1'
				})
			},
			//跳转商品详情
			toPage(id) {
				uni.navigateTo({
					url: '../shop/goods?id=' + id
				})
			},
			toShop() {
				uni.navigateBack({
					delta: 1
				});
			}
		},
		onPageScroll(e) {
			this.scrollSize = e.scrollTop
		},
		computed: {
			// 监听筛选组件置顶和不置顶
			openFixed() {
				// 如果页面滚动的高度大于筛选组件距离顶部的高度，那就置顶，反之不置顶
				if (this.scrollSize > this.topRange - this.CustomBar) {
					console.log('置顶')
					this.isfixed = true
				} else {
					console.log('不置顶')
					this.isfixed = false
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f4f4f4;
	}

	.icon-empty {
		display: inline-flex;
		width: 20rpx;
		height: 28rpx;
	}

	.nav-fixed {
		position: fixed;
		width: 100%;
		z-index: 1000;
	}

	.isfixed {
		background: #FF2222;
	}

	.complete-state {
		color: #999999;
	}

	.content {
		position: fixed;
		width: 100%;
		padding-bottom: 20rpx;
	}

	.order-null {
		height: 200px;
		line-height: 200px;
		text-align: center;
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
			width: 500rpx;
			font-size: 24rpx;
			color: #888888;

			text {
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
			width: 180rpx;
			text-align: center;
			background: linear-gradient(0deg, #030000 0%, #FF0054 0%, #FFA14D 100%);
			border-radius: 15px;
		}
	}

	.cart-goods-item {
		display: flex;
		padding: 15rpx 0;
		background: #ffffff;
		padding: 30rpx 20rpx;
		margin: 20rpx 20rpx 0 20rpx;
		border-radius: 20rpx;
		position: relative;

		.goods-null {
			background: rgba($color: #fff, $alpha: 0.5);
			position: absolute;
			top: 0;
			left: 0;
			height: 190rpx;
			width: 100%;
			border-radius: 20rpx;
		}

		.goods-del {
			position: absolute;
			z-index: 999;
			right: 0;
			top: 0;

			image {
				width: 60rpx;
				height: 60rpx;
			}
		}

		.goods-checked {
			display: flex;
			align-items: center;

			image {
				width: 34rpx;
				height: 34rpx;
			}
		}

		.goods-cover {
			width: 120rpx;
			height: 120rpx;
			margin-right: 20rpx;
			margin-left: 20rpx;

			.cover {
				display: inline-block;
				width: 100%;
				height: 100%;
			}

			.goods-cover-img {
				padding-top: 34rpx;
				z-index: 999;
				position: absolute;
				top: 0;
				border-radius: 50%;
				text-align: center;
				width: 100%;
				height: 120rpx;
				color: #fff;
				font-size: 12px;
				background: rgba($color: #000000, $alpha: 0.5);
			}
		}

		.goods-info {
			flex: 5;
			text-align: left;

			.title {
				line-height: 45rpx;
				font-size: 34rpx;
				font-weight: 400;
				color: #000000;
				width: 473rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-line-clamp: 2; //在第几行显示...
				display: -webkit-box;
				-webkit-box-orient: vertical;
			}

			.intro-wrap {
				display: flex;
				justify-content: space-between;
				height: 35rpx;
				line-height: 35rpx;
				margin: 5rpx 0;
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
				position: relative;

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

				.goods-sum {
					position: absolute;
					right: 10rpx;
					top: -5rpx;
					flex-direction: row;

					image {
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
			}
		}
	}
</style>
