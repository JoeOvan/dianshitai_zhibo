<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true" toUrl="/pages/order/order">
				<block slot="backText"><text class="logo-tips">我的订单</text></block>
			</cu-custom>
		</view>
		
		
		<scroll-view class="scrollview-wrap" :scroll-y="true" :refresher-enabled="refresher" :refresher-triggered="triggered"
		            :refresher-threshold="45" refresher-background="#f8f8f8" @refresherrefresh="onRefresh" @refresherrestore="onRestore"
		            @refresherabort="onAbort" @scrolltolower="scrollBottem" @scroll="onScrollView" :style="{'top':tabFix,'height': swiperContentHeight + 100 +'px'}">
					
			<!-- <view class="content"> -->
				<view class="top-menu-view" :class="isFixedTop?'fixed':''" id="navbar" :style="{'top': tabTop + 'px'}">
					<block v-for="(item,index) in menuTabs" :key="index">
						<view class="menu-topic-view" v-bind:id="'tabNum'+index"  @click="tabSelect" :data-cid="item.value" :data-id="index">
							<view :class="[index==TabCur ? 'menu-topic-act' : 'menu-topic']">
								<view class="menu-topic-txt">{{item.name}}</view>
								<view class="menu-topic-bottom"><view class="menu-topic-bottom-color"></view></view>
							</view>
						</view>
					</block>
				</view>

				<!-- 显示区域 -->
				<swiper class="swiper-box-list" duration="300" @change="swiperChange" :current="currentIndex" :style="{'height': swiperHeight +'px'}">
					<block v-for="(item,index) in goodsData" :key="index">
						<swiper-item>
							<!-- <scroll-view class="swiper-topic-list" scroll-y="true" :style="{'height': swiperContentHeight + 'px'}" @scrolltolower="loadMore()" lower-threshold="100"> -->
	<!--							<view class="tabContent">-->
								<block v-if="item.data.length>0">
									<view :class="'tab-content tabContent tabContent_'+index">
										<!-- 展示列表内容 -->
										<view class="order-item" v-for="(item1,index1) in item.data" :key="index1">
											<view class="order-header-item" @click="toPage(item1.orderId)">
												<view class="order-number">订单号：{{item1.orderId}}</view>
												<view v-if="item1.orderStatus==0" :class="[item1.orderStatus==0 ? 'complete-state' : 'order-status']">
													待付款
												</view>
												<view v-if="item1.orderStatus==101" :class="[item1.orderStatus==101 ? 'complete-state' : 'order-status']">
													关闭订单
												</view>
												<view v-if="item1.orderStatus==102" :class="[item1.orderStatus==102 ? 'complete-state' : 'order-status']">
													已删除
												</view>
												<view v-if="item1.orderStatus==103" :class="[item1.orderStatus==103 ? 'complete-state' : 'order-status']">
													超时未支付
												</view>
												
												<view v-if="item1.orderStatus==201 && item1.payStatus!==3" :class="[item1.orderStatus==201 && item1.payStatus!==3 ? 'complete-state' : 'order-status']">
													待发货
												</view>
												
												<view v-if="item1.orderStatus==300" :class="[item1.orderStatus==300 ? 'complete-state' : 'order-status']">
													待收货
												</view>
												<view v-if="item1.orderStatus==301" :class="[item1.orderStatus==301 ? 'complete-state' : 'order-status']">
													配送中
												</view>
												<view v-if="item1.orderStatus==302" :class="[item1.orderStatus==302 ? 'complete-state' : 'order-status']">
													已收货
												</view>
												<view v-if="item1.orderStatus==303" :class="[item1.orderStatus==303 ? 'complete-state' : 'order-status']">
													自动收货
												</view>
												
												<view v-if="item1.orderStatus==400" :class="[item1.orderStatus==400 ? 'complete-state' : 'order-status']">
													退款中
												</view>
												<view v-if="item1.orderStatus==403" :class="[item1.orderStatus==403 ? 'complete-state' : 'order-status']">
													已退款
												</view>
												<view v-if="item1.orderStatus==404" :class="[item1.orderStatus==404 ? 'complete-state' : 'order-status']">
													拒绝退款
												</view>
											</view>
											<view class="order-content-item">
												<view class="order-content-one">
													<view class="cart-goods-item" v-for="(item2,index2) in item1.orderDetailList" :key="index2">
														<view class="goods-cover" @click="toPage(item1.orderId,item1.orderStatus)">
															<fr-image class="cover" :src="baseUrl+item2.goods.thumbImgUrl" mode="aspectFill" />
														</view>
														<view class="goods-info">
															<view class="title-wrap">
																<view class="title"  @click="toPage(item1.orderId,item1.orderStatus)">{{item2.goods.name}}</view>
																<view class="comment" v-if="!item2.isComment && item1.orderStatus==302 " @click="toComment(item2.orderDetailId)">评价</view>
																<view class="commented" v-else-if="item1.orderStatus==302">已评价</view>
															</view>
															<view class="intro-wrap"><text class="intro" v-if="item2.skuName!=null">{{item2.skuName}}</text></view>
															<view class="price-wrap">
																<view class="price"><text class="sign">￥</text>{{item2.price}}</view>
																<view class="goods-sum">
																	<view class="num">X{{item2.num}}</view>
																</view>
															</view>
														</view>
													</view>
												</view>
											</view>
											<view class="order-footer-item">
												<view class="order-count">实付款￥{{item1.totalMoney}}</view>
											</view>
											<view class="order-handle">
												<!-- <view class="refund" v-if='item1.orderStatus==400'>退款中</view> -->
												<view class="order-sign-for btn-order-again" v-if='item1.orderStatus==400' @click="cancelRefund(item1.orderId)">撤销退款</view>
												<view class="order-sign-for order-sign" v-if='item1.orderStatus==0 || item1.orderStatus==103' @click="toPay(item1.orderSn)">立即付款</view>
												<view class="order-sign-for btn-order-again" v-if='item1.orderStatus==103 || item1.orderStatus==0'
													@click="cancelOrder(item1.orderId)">取消
												</view>
												<block v-if="item1.payStatus<3 && item1.payStatus!=0">
													<view class="btn-order-again order-refund"
														v-if='item1.orderStatus<302 && item1.orderStatus>200' @click="toRefund(item1.orderId)">退款
													</view>
												</block>
												
												<view class="order-sign-for order-sign" v-if='item1.orderStatus<302 && item1.orderStatus>=300' @click="confirmReceipt(item1.orderId)">确认收货</view>
												
												<view class="order-sign-for btn-order-again" v-if='item1.orderStatus==101 || item1.orderStatus==404 || item1.orderStatus==102 || item1.orderStatus==103 || item1.orderStatus==302 || item1.orderStatus==403' 
													@click="delOrder(item1.orderId)">删除</view>
											</view>
										</view>	
									</view>
								 </block>
								 <block v-else>
									 <view class="order-null">暂时没有订单...</view>
								 </block>
							<!-- </scroll-view> -->
						</swiper-item>
					</block>
				</swiper>
			<!-- </view> -->
		
		</scroll-view>
		
		<login-modal :isShow='isLoginModalShow' @openModal="isLoginModalShow = true" @closeModal="isLoginModalShow = false"></login-modal>
	</view>
</template>

<script>
	import FrImage from '@/components/fr-image/fr-image.vue'
	export default {
		components:{FrImage},
		data() {
			return {
				topRange: 0, //导航栏初始化距顶部的距离
				scrollSize: 0, //滚动距离
				isfixed: false, //是否固定顶部
				
				//防止与弹出层同步滚动
				isWrapperFixed: false,
				tabFix: this.CustomBar + 'px',
				isTabFix: {
					top: 'auto'
				},
				
				swiperContentHeight: 0, //切换内容固定高度
				swiperHeight: 500, //这里是动态赋值的高度
				firstLoading: true,
				
				isloading: false, // 是否正在请求数据
				
				//模态框
				modalName: null,
				custormModalName: false,
				
				//tab导航栏
				TabCur: 0,
				scrollLeft: 0,
				catId: 0,
				
				swiper: {},
				shops: {},
				goodsCart: {},
				goodsCategory: {},
				goodsData: {},
				orderData: {},
				currentIndex: 0,
				goodsRecommendList: [],
				
				//Sku
				skuData: null,
				checkedSku: null,
				
				//商品规格模块
				goodsNum:1,
				goodsId:0,
				goodsImg:"",
				goodsName:"",
				goodsSpecification:"",
				tabNum:0,
				price:0.00,
				orderStatus:"",
				baseUrl: uni.$url.baseUrl+"/",
				menuTabs: [{
					name: '全部',
					value : "",
				},{
					name: '待付款',
					value : 0,
				}, {
					name: '待发货',
					value : 201,
				}, {
					name: '待收货',
					value : 300,
				}, {
					name: '待评价',
					value : 302,
				}],
				isLoginModalShow: false,  //登录模态框
				
				//下拉刷新
				refresher:true,
				triggered:true,
				
				
				tabInitTop: 0, //导航栏初始化距顶部的距离
				isFixedTop: false, //是否固定顶部
				tabTop: 0,  //tabTop吸顶高度
			}
		},
		onLoad() {
			
			
			//获取节点距离顶部的距离
			uni.createSelectorQuery().select('#navbar').boundingClientRect((res) => {
				console.log(res);
				if (res && res.top > 0) {
					var tabInitTop= res.top;
					this.tabInitTop= tabInitTop
				}
			}).exec();
			// if (this.tabInitTop== 0) {
			// }
			
			
			this.getSwiperContentHeight();
		},
		onShow() {
			let status = uni.getStorageSync('orderStatus');
			let index = uni.getStorageSync('currentIndex');
			console.log(status);
			if(status==""){
				status="";
				index=0;
				this.TabCur=0;
				this.currentIndex=0;
			}else{
				this.TabCur=index;
				this.currentIndex=index;
			}
			this.firstLoading = true;
			this.goodsCategoryContent(index,status)
		},
		//下拉刷新
		onPullDownRefresh() {
			// this.goodsCategoryContent(0,0)
					
			// this.getSwiperContentHeight();
			// uni.stopPullDownRefresh();
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		updated() {
			this.initSwiperHeight('.tabContent_' + this.TabCur);
		},
		watch: {
			// 1. 监听 total 值的变化，通过第一个形参得到变化后的新值
			total(newVal) {
				this.cartTotal = newVal;
			},
		},
		methods: {
			onScrollView(e) {
				var scrollTop = e.detail.scrollTop
				console.log(e.detail.scrollTop, scrollTop);
				// console.log(scrollTop);
				// console.log(this.tabInitTop);
				var isSatisfy = scrollTop >= this.tabInitTop? true : false;
				
				if(isSatisfy) {
					this.tabTop = e.detail.scrollTop;
				} else {
					this.tabTop = 0
				}
				
				//只有处于吸顶的临界值才会不相等
				if (this.isFixedTop === isSatisfy) return false;
				
				
				console.log('---------',this.isFixedTop);
				this.isFixedTop = isSatisfy
				
			},
			scrollBottem() {
				this.status = "nomore"
			},
			onRefresh() {
				setTimeout(() => {
					this.triggered = false;
				}, 1500)
			},
			/* 下拉被复位 */
			onRestore() {
				this.triggered = true;
				//初始化ScrollViewHeight
				// this.initScrollViewHeight();
				
				// //getBannerImg 获取banner
				// this.getBannerImg();
				// this.getSwiperContentHeight();
				// this.goodsCategoryContent();
			},
			/* 下拉被中止，没下拉完就松手就会触发 */
			onAbort() {
				console.log("onAbort");
			},
			toRefund(orderId){
				uni.navigateTo({
				  url: '../order/refund?orderId='+orderId
				})
			},
			getSwiperContentHeight() {
				
				let windowHeight = 0;
				let swiperTopHeight = 0;
				
				uni.getSystemInfo({
				    success: function (res) {
						
						windowHeight = res.windowHeight;
						
				    }
				});
				
				const query = uni.createSelectorQuery().in(this);
				query.select('.swiper-box-list').boundingClientRect(data => {
					
					swiperTopHeight = data.top;
					
					this.swiperContentHeight = windowHeight - swiperTopHeight;
					
				}).exec();
	
			},
			//动态获取高度
			initSwiperHeight(element) {
				uni.createSelectorQuery().in(this).select(element).boundingClientRect(result => {
		
					if (result) {
						if(result.height>0){
							this.swiperHeight = result.height+100;
						}
						
					} else {
						this.initSwiperHeight(element);
					}
				}).exec();
		
			},
			toPage(id,orderStatus){
				if(orderStatus>=400 && orderStatus<405){
					uni.navigateTo({
					  url: '../order/refund-detail?orderId='+id//实际路径要写全
					})
				}else{
					uni.navigateTo({
					  url: '../order/detail?orderId='+id//实际路径要写全
					})
				}
				
			},
			toComment(id) {
				uni.navigateTo({
				  url: '/pages/order/comment?id='+id//实际路径要写全
				})
			},
			toShop(id){
				uni.navigateTo({
				  url: '../shop/goods?id='+id//实际路径要写全
				})
			},
			//删除订单
			delOrder(id,index){
				let that=this;
				uni.showModal({
				    title: '提示',
				    content: '确定删除订单吗？',
				    success: function (res) {
				        if (res.confirm) {
				            that.delOrderData(id);
							
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			async delOrderData(id){
				let res = await uni.$http.post(uni.$url.deleteOrder, {orderId:id});
				
				if (res.data.code !== 0) return uni.$showMsg(res.data.msg,3500);
				
				uni.showToast({
					title: "删除成功",
					duration: 1500,
					icon: 'success'
				})
				
				setTimeout(() => {
					this.firstLoading = true;
					this.goodsCategoryContent(this.TabCur,this.orderStatus)
				}, 1500)
			},
			//取消订单
			async cancelOrders(id) {
				let query = {
					orderId:id
				};
				let res = await uni.$http.post(uni.$url.cancelOrder,query);
				
				if (res.data.code !== 0) return uni.$showMsg(msg,3500);
				
				if (res.data.code == 0) {
					
					uni.showToast({
					  title: "取消成功",
					  duration: 1500,
					  icon: 'success'
					})
					
					setTimeout(() => {
						this.firstLoading = true;
						this.goodsCategoryContent(this.TabCur,this.orderStatus)
					}, 1500)
				}
			},
			//取消订单弹框
			cancelOrder(id) {
				let that=this;
				uni.showModal({
				    title: '提示',
				    content: '确定取消订单吗？',
				    success: function (res) {
				        if (res.confirm) {
				            that.cancelOrders(id);
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			//确认收货
			async confirmReceipts(id) {
				let query = {
					orderId:id
				};
				let res = await uni.$http.post(uni.$url.confirmReceipt,query);
				
				if (res.data.code !== 0) return uni.$showMsg(msg,3500);
				
				if (res.data.code == 0) {
					
					uni.showToast({
					  title: "确认收货成功",
					  duration: 1500,
					  icon: 'success'
					})
					
					setTimeout(() => {
						this.firstLoading = true;
						this.goodsCategoryContent(this.TabCur,this.orderStatus)
					}, 1500)
				}
			},
			//确认收货弹框
			confirmReceipt(id) {
				let that=this;
				uni.showModal({
				    title: '提示',
				    content: '确认收货？',
				    success: function (res) {
				        if (res.confirm) {
				            that.confirmReceipts(id); 
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			//撤销退款
			async cancelRefund(id){
				
				
				// 询问用户是否撤销退款
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '确认撤销退款吗？'
				}).catch(err => err);
				
				
				if (succ && succ.confirm) {
					//发起请求订单详情
					const res = await uni.$http.post(uni.$url.cancelRefundApply, {orderSn:id});
					
					if (res.data.code !== 0) return uni.$showMsg(res.data.msg,3500);

					uni.showToast({
						title: '撤销成功',
						duration: 1500,
						icon: 'success'
					})
					
					setTimeout(() => {
						this.firstLoading = true;
						this.goodsCategoryContent(this.TabCur,this.orderStatus)
					}, 1500)
					
				}
			},
			
			//立即付款
			async toPay(orderSn) {
				const res = await uni.$http.get(uni.$url.orderPay, { orderSn: orderSn });
		
				let errmsg = res.data.errmsg;
				
				// 预付订单生成失败
				if (res.data.code !== 0) return uni.$showMsg(errmsg,3500);
				
				// 得到订单支付相关的必要参数
				const payInfo = res.data.data
								
				// 真实支付
				// 发起微信支付
				// 调用 uni.requestPayment() 发起微信支付
				const [err, succ] = await uni.requestPayment(payInfo)
				
				// 未完成支付
				if (err) {
					 uni.$showMsg('订单未支付！');
					 uni.redirectTo({
					 	url: "./detail?orderId=" + orderId
					 })
					 
					 return 
				}
				
				if (succ.errMsg == "requestPayment:ok") {
					this.firstLoading = true;
					this.goodsCategoryContent(this.TabCur,this.orderStatus)
				}
				
				uni.showToast({
					title: "订单支付成功！",
					duration: 3500,
					icon: 'success'
				})
				
			},
			//分类内容
			async goodsCategoryContent(index, id) {
				uni.setStorageSync('orderStatus', id);
				uni.setStorageSync('currentIndex', index);
				
				this.tabNum=id;
				
				let query = {
					orderStatus: id,
					pageNum: 1,
					pageSize: 10 
				};
				
				//首次进入
				if (this.firstLoading) {
					this.firstLoading = false;
					let res = await uni.$http.post(uni.$url.orderList, query);

					if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
					
					this.orderData = res.data;
		
					let contentCount = this.menuTabs.length;
		
					//请求数据并赋值给this.goodsData 没有数据的设置为空
					let arrData = {};
					for (let i = 0; i < contentCount; i++) {
						arrData[i] = {};
						if (i == index) {
							arrData[i]['data'] = this.orderData.rows;
							arrData[i]['pageNum'] = 1;
							arrData[i]['pageSize'] = 10;
							arrData[i]['total'] = this.orderData.total;
						} else {
							arrData[i]['data'] = [];
							arrData[i]['pageNum'] = null;
							arrData[i]['pageSize'] = null;
							arrData[i]['total'] = null;
						}
					}
		
					this.goodsData = arrData;
					
				} else {
					if (!this.goodsData[index]['data'] || this.goodsData[index]['data'].length<1) {

						let res = await uni.$http.post(uni.$url.orderList, query);

						if (res.data.code !== 0) return uni.$showMsg(res.data.msg);

						let resData = res.data;

						//加载更多数据赋值给goodsData
						this.goodsData[index]['data'] = resData.rows;
						this.goodsData[index]['pageNum'] = 1;
						this.goodsData[index]['pageSize'] = 10;
						this.goodsData[index]['total'] = resData.total;
					
					}
				}
				this.$forceUpdate();
				this.initSwiperHeight('.tabContent_' + this.TabCur);
			},
			// 获取商品列表数据的方法
			async getGoodsData(index, id) {
				let pageNum = this.goodsData[index]['pageNum'];
				let pageSize = this.goodsData[index]['pageSize'];
				let total = this.goodsData[index]['total'];
				
				// 判断是否还有下一页数据
				if (pageNum * pageSize >= total) return uni.$showMsg('到底了，没有了！');
				// ** 打开节流阀
				this.isloading = true
				
				this.tabNum=id;
				let query = {
					orderStatus: id,
					pageNum: ++this.goodsData[index]['pageNum'],
					pageSize: 10
				};
				
				// 发起请求
				const res = await uni.$http.post(uni.$url.orderList, query);
				
				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
		
				// ** 关闭节流阀
				this.isloading = false
		
				// 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
				this.goodsData[index]['data'] = [...this.goodsData[index]['data'], ...res.data.data.data]
				
				this.$forceUpdate();
		
				this.initSwiperHeight('.tabContent_' + this.TabCur);
		
			},
			//scroll-view 触底的事件
			loadMore() {
				// 判断是否正在请求其它数据，如果是，则不发起额外的请求
				if (this.isloading) return
				// 让页码值自增 +1
				// this.queryObj.pagenum += 1
				// 重新获取列表数据
				let catId = this.getCatId();
						
				this.getGoodsData(this.TabCur, catId);
				
			},
		// 	// 触底的事件
		// 	onReachBottom() {
		// 		// 判断是否正在请求其它数据，如果是，则不发起额外的请求
		// 		if (this.isloading) return
		// 		// 让页码值自增 +1
		// 		// this.queryObj.pagenum += 1
		// 		// 重新获取列表数据
		// 		let catId = this.getCatId();
		
		// 		this.getGoodsData(this.TabCur, catId);
		// 	},
			//根据索引（this.TabCur）获取catId
			getCatId() {
				let catId = '';
				for (var i = 0; i < this.menuTabs.length; i++) {
					if (i == this.TabCur) {
						catId = this.menuTabs[i].value;
					}
				}
				return catId;
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
				this.currentIndex = e.currentTarget.dataset.id;
				this.orderStatus = e.currentTarget.dataset.cid;
				if(this.currentIndex == 0)this.firstLoading = true;
			},
			swiperChange(e) {
				let index = e.detail.current;
				this.TabCur = index;
				this.scrollLeft = (index - 1) * 60;
				this.currentIndex = index;
				//请相应的数据
				if(index==0)this.firstLoading = true;
				let catId = this.getCatId();
				this.orderStatus = catId;
				this.goodsCategoryContent(index, catId);
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
		// position: sticky;
		background: #f4f4f4;
	}
	.icon-empty {
		display: inline-flex;
		width: 20rpx;
		height: 28rpx;
	}
	.nav-fixed {
		position: fixed;
		/* position: relative; */
		width: 100%;
		z-index: 1000;
	}
	
	.fixed {
		position: fixed !important;
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
	}
	.order-null{
		height: 200px;
		line-height: 200px;
		text-align:center;
	}
	/* Tab切换 */
	// .top-menu-view {
	// 	// display: flex;
	// 	white-space: nowrap;
	// 	width: 100%;
	// 	background-color: #FFFFFF;
	// 	height: 100rpx;
	// 	position: -webkit-sticky;
	// 	position: sticky;
	// 	z-index: 111;
	
	// 	.cu-item {
	// 		position: relative;
	// 		padding: 0;
	// 		margin: 0 20rpx;
	
	// 		&.cur {
	// 			height: 96rpx;
	// 			font-size: 28rpx;
	// 			color: #000000;
	// 			border-bottom: none;
	
	// 			&::before {
	// 				content: '';
	// 				position: absolute;
	// 				bottom: 10rpx;
	// 				left: 50%;
	// 				margin-left: -20rpx;
	// 				width: 40rpx;
	// 				height: 4rpx;
	// 				background: #FF5D48;
	// 			}
	// 		}
	// 	}
	// }
	
	/* Tab切换 */
	.body-view {
		height: 100%;
		width: 100%;
		display: flex;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		align-items: flex-start;
		justify-content: center;
	}
	
	.body-view .right-arrow {
		position: absolute;
		top: 22upx;
		right: 0upx;
		padding-left: 60upx;
		padding-right: 20upx;
		line-height: 42upx;
		background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 60%);
	}
	
	.body-view .right-arrow .iconfont {
		font-size: 24upx;
		font-family: iconfont;
		color: #909399;
	}
	
	.top-menu-view {
		display: flex;
		white-space: nowrap;
		width: 100%;
		background-color: #FFFFFF;
		height: 86upx;
		border-top: 1px solid #d8dbe6;
		// border-bottom: 1px solid #d8dbe6;
		position: -webkit-sticky;
		position: sticky;
		// position: fixed;
		top: 0;
	}
	
	.top-menu-view .menu-topic-view {
		display: inline-block;
		white-space: nowrap;
		height: 99upx;
		position: relative;
		flex: 1;
	}
	
	.top-menu-view .menu-topic-view .menu-topic {
		margin-left: 30upx;
		margin-right: 10upx;
		position: relative;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.top-menu-view .menu-topic-view .menu-topic:first-child {
		margin-left: 30upx;
	}
	
	.top-menu-view .menu-topic-view:last-child .menu-topic {
		margin-right: 80upx;
	}
	
	.top-menu-view .menu-topic-view .menu-topic .menu-topic-txt {
		font-size: 30upx;
		color: #000000;
	}
	
	.top-menu-view .menu-topic-view .menu-topic .menu-topic-bottom {
		position: absolute;
		bottom: 0;
		width: 100%;
	}
	
	.top-menu-view .menu-topic-view .menu-topic .menu-topic-bottom .menu-topic-bottom-color {
		width: 40upx;
		height: 4upx;
	}
	
	.top-menu-view .menu-topic-view .menu-topic-act {
		margin-left: 30upx;
		margin-right: 10upx;
		position: relative;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.top-menu-view .menu-topic-view:last-child .menu-topic-act {
		margin-right: 80upx;
	}
	
	.top-menu-view .menu-topic-view .menu-topic-act .menu-topic-txt {
		font-size: 30upx;
		color: #FF5D48;
		font-weight: 600;
	}
	
	.top-menu-view .menu-topic-view .menu-topic-act .menu-topic-bottom {
		position: absolute;
		bottom: 0;
		width: 100%;
		display: flex;
		justify-content: center;
	}
	
	.top-menu-view .menu-topic-view .menu-topic-act .menu-topic-bottom .menu-topic-bottom-color {
		width: 86%;
		height: 6upx;
		background: #FF5D48;
	}
	
	.swiper-box-list {
		flex: 1;
		width: 100%;
		height: auto;
		// background-color: #FFFFFF;
		padding-top: 100rpx;
	}


  /* Tab切换 */

  .top-menu-view {
    display: flex;
    white-space: nowrap;
    width: 100%;
    background-color: #FFFFFF;
    height: 100rpx;
    // position: -webkit-sticky;
    // position: sticky;
	position: fixed;
    z-index: 111;
    justify-content: space-between;
    .cu-item {
      flex: 1;
      position: relative;
      padding: 0;
      margin: 0 20rpx;

      &.cur {
        height: 96rpx;
        font-size: 28rpx;
        color: #000000;
        border-bottom: none;

        &::before {
          content: '';
          position: absolute;
          bottom: 10rpx;
          left: 50%;
          margin-left: -20rpx;
          width: 40rpx;
          height: 4rpx;
          background: #FF5D48;
        }
      }
    }
  }


	
	/* 订单列表 */
	.order-item {
		width: 710rpx;
		margin: 20rpx;
		background: #ffffff;
		border-radius: 20px;
		.order-header-item {
			display: flex;
			justify-content: space-between;
			padding: 40rpx 30rpx 30rpx 30rpx;
			.order-number {
				font-size: 24rpx;
				font-weight: 400;
				color: #000000;
			}
			.order-status {
				font-size: 28rpx;
				font-weight: 400;
				color: #FF5D48;
			}
		}
		.order-content-item {
			.order-content-one {
				.cart-goods-item {
					white-space: nowrap;
					display: flex;
					padding: 40rpx 5%;
					// margin: 0 30rpx;
					background: #ffffff;
					border-top: 1px solid #f1f1f1;
					border-bottom: 1px solid #f1f1f1;
					.goods-cover {
						// flex: 1;
						width: 120rpx;
						height: 120rpx;
						margin-right: 20rpx;
						display: inline-block;
						flex-shrink: 0;
						.cover {
							display: inline-block;
							width: 100%;
							height: 100%;
							border-radius: 10rpx;
						}
					}
					.goods-info {
						 width: 490rpx;
						 .title-wrap {
							 display: flex;
							 justify-content: space-between;
							.title {
								height: 45rpx;
								line-height: 45rpx;
								font-size: 34rpx;
								font-weight: 400;
								color: #000000;
								white-space: nowrap;
								text-overflow: ellipsis;
								overflow: hidden;
								word-break: break-all;
							}
							.comment {
								text-decoration: underline;
							}
							.commented {
								color:#999999;
							}
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
								color: #000000;
								font-weight: 400;
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
			.order-content-two {
				.order-goods-item {
					display: flex;
					padding: 40rpx 0;
					margin: 0 30rpx;
					border-top: 1px solid #f1f1f1;
					border-bottom: 1px solid #f1f1f1;
					.goods-cover {
						// flex: 1;
						width: 120rpx;
						height: 120rpx;
						margin-right: 30rpx;
						.cover {
							display: inline-block;
							width: 100%;
							height: 100%;
							border-radius: 10rpx;
						}
					}
				}
			}
		}
		.order-footer-item {
			display: flex;
			flex-direction:row-reverse;
			padding: 30rpx 30rpx 40rpx 30rpx;
			.btn-order-handle {
				height: 60rpx;
				line-height: 60rpx;
				padding: 0 35rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #FFFFFF;
				background: $custom-theme-color;
				border-radius: 30rpx;
			}
			
		}
		.order-handle{
			text-align: right;
			padding:0 30rpx 30rpx 30rpx;
			.refund{
				display: inline-block;
				color: #FFC000;
			}
			.order-sign {
				display: inline-block;
				color: #FF2222;
				height: 60rpx;
				line-height: 60rpx;
				padding: 0 35rpx;
				font-size: 28rpx;
				font-weight: 400;
				border: 1px solid #FF2222;
				border-radius: 30rpx;
				margin-left: 20rpx;
			}
			.btn-order-again {
				margin-left: 20rpx;
				display: inline-block;
				height: 60rpx;
				line-height: 60rpx;
				padding: 0 35rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #AAAAAA;
				background: #ffffff;
				border: 1px solid #AAAAAA;
				border-radius: 30rpx;
			}
			.order-refund {
				color: #333333;
				border: 1rpx solid #333333;
			}
		}
		
	}
	
	.scrollview-wrap {
		position: relative;
	}
</style>
