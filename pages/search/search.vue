<template>
	<view class="wrapper" :class="isWrapperFixed? 'fixed':''">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">搜索</text></block>
			</cu-custom>
		</view>
		
		<view class="content" :style="{'top':tabFix}">
			<view class="cu-bar bg-white search fixed" :style="{'top':tabFix}">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input class="search-input" type="text" placeholder="搜索您想要的商品" confirm-type="search" :value="goodsName" @input="searchIcon" @confirm="goodsCategoryContent"></input>
					<text class="cuIcon-roundclosefill" @click="clean"></text>
				</view>
				<view class="btn-search"  @click="goodsCategoryContent" data-sorttype="0">搜索</view>
			</view>
			
			<!--搜索推荐-->
			<view class="search-recommend" :style="{'padding-top': searchPadding}">
				<!-- <view class="search-recommend-item search-hot">
					<view class="title-wrap">
						<view class="title">热门搜索</view>
					</view>
					<view class="search-item-wrap">
						<text class="search-item">奶茶</text>
					</view>
				</view> -->
				<view class="search-recommend-item search-history">
					<view class="title-wrap" v-if="goodsData.data.length == 0">
						<view class="title">历史搜索</view>
						<view class="empty-wrap" @click="cleanHistory">
							<image class="icon-empty" src="../../static/Trash.png"></image>
							<text class="text">清空</text>
						</view>
					</view>
					<view class="search-item-wrap">
						<block v-if="history.length>0">
							<view class="search-item" v-for="(item,index) in history" :key="index" @click="choseHistory" data-sorttype="0" :data-goodsname="item">{{item}}</view>
						</block>
						<block v-else>
							<text style="margin-left: 20rpx;color: #666666;">暂无搜索记录</text>
						</block>
					</view>
				</view>
			</view>
			<!--搜索推荐 end-->
			
			<view class="search-option fixed" v-if="goodsData.data.length > 0"  :style="{'top':selectPadding}">
				<view class="search-option-item" @click="goodsCategoryContent"  data-sorttype="0">综合排序</view>
				<view class="search-option-item" @click="goodsCategoryContent"  data-sorttype="1">销量最高</view>
				<view class="search-option-item" @click="goodsCategoryContent"  data-sorttype="2">价格降序</view>
				<view class="search-option-item" @click="goodsCategoryContent"  data-sorttype="3">价格升序</view>
			</view>
			<!--搜索列表-->
			<view class="search-list-wrap" >
				
				<!-- 显示区域 -->
				<view class="swiper-topic-list">
					<view class="tab-content">
								
						<block v-for="(item,index) in goodsData.data" :key="index" v-if="goodsData.data.length > 0">
							<!-- 展示列表内容 -->
							<view class="cart-goods-item">
								<view class="goods-cover" @click="toPage(item.id)">
									<fr-image class="cover" :src="baseUrl+item.thumbImgUrl" mode="aspectFill" />
								</view>
								<view class="goods-info">
									<view class="title" @click="toPage(item.goodsId)">{{item.name}}</view>
									<view class="intro-wrap"><text class="intro"></text></view>
									<view class="price-wrap">
										<view class="price"><text class="sign">￥</text>{{item.minPrice}}</view>
										<view class="goods-sum">
											<view class="goods-money-button" @click="addOrderCart(item.goodsId,item.multity)">
												加入购物车
											</view>
										</view>
									</view>
								</view>
							</view>
						</block>
						<block v-if="isNull">
							<view class="search-nothing">
								<view class="nothing">抱歉，未能找到您搜索的商品</view>
								<!-- <view class="guess">
									<view class="line"></view>
									<view class="like-wrap">
										<image class="icon-like" src="../../static/icon-like.png"></image>
										<text class="text">猜你喜欢</text>
									</view>
								</view> -->
							</view>
							
							<!-- <view class="search-list" style="margin-top: 53rpx;">
								<view class="cart-goods-item" v-for="(item1,index1) in 3" :key="index1" >
									<view class="goods-cover" @click="toPage(item1.id)">
										<fr-image class="cover" src="../../static/video-img.jpg" mode="aspectFill" />
									</view>
									<view class="goods-info">
										<view class="title" @click="toPage(item1.id)">123123123123123123123123123123123123123123123123123123</view>
										<view class="intro-wrap"><text class="intro">123123</text></view>
										<view class="price-wrap">
											<view class="price"><text class="sign">￥</text>123123231</view>
											<view class="goods-sum">
												<view class="goods-money-button" @click="addOrderCart(1)">
													加入购物车
												</view>
											</view>
										</view>
									</view>
								</view>
								
							</view> -->
						</block>
					</view>
				</view>    
			</view>
		</view>
		<sku :isLive="isLive" :open="openSkuModal" :goodsId="goodsId" @state='closeSkuModal' style="z-index: 999;height: 0;"></sku>
	</view>
</template>

<script>
	import FrImage from '@/components/fr-image/fr-image.vue'
	import sku from '@/components/sku.vue'
	// 按需导入 mapMutations 这个辅助方法
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex'
	export default {
		components:{FrImage,sku},
		computed: {
			// 将 m_user 模块中的 userinfo 映射到当前页面中使用
			...mapState('m_user', ['token']),
			// 把 m_cart 模块中名称为 total 的 getter 映射到当前页面中使用
			...mapGetters('m_cart', ['total']),
		},
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

				//contentHeight
				windowsHeight: 0,
				tabHeight: 0,
				tabbarHeight: 0,
				searchPadding: 0,
				selectPadding: 0,

				swiperHeight: 0, //这里是动态赋值的高度
				firstLoading: true,
				isData: false,
				isLive: false,


				isloading: false, // 是否正在请求数据

				//tab导航栏
				TabCur: 0,
				scrollLeft: 0,

				swiper: {},
				shops: {},
				goodsCart: {},
				goodsCategory: {},
				goodsData: {
					data:[],
					pageNum:1,
					pageSize:9,
					total:0,
				},
				currentIndex: 0,
				goodsRecommendList: [],
				history:[],
				baseUrl: uni.$url.baseUrl+"/",
				
				//商品模块
				goodsName:"",
				price:0.00,
				sortType:0,
				goodsId:0,
				isNull:false,
				openSkuModal:false
			}
		},
		onShow() {
			this.getHistory();
			this.openSkuModal=false;
		},
		watch: {
			// 1. 监听 total 值的变化，通过第一个形参得到变化后的新值
			total(newVal) {
				this.cartTotal = newVal;
			},
		},
		mounted() {
			let that = this;
			let h = 0;
			const query = uni.createSelectorQuery().in(this);
			query.select('.cu-bar').boundingClientRect();
			query.select('.nav-fixed').boundingClientRect();
			query.exec(res => {
				let searchSum = res[0].height+res[1].height;
				let selectSum = res[0].height+res[1].height;
				that.searchPadding = searchSum + 'px';
				that.selectPadding = selectSum + 'px';
			});
		},
		methods: {
			// 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
			...mapMutations('m_cart', ['addToCart']),
			moveHandle: function() {
				return false
			},
			searchIcon(e){
				this.goodsName = e.detail.value
			},
			toPage(id,shopId){
				uni.navigateTo({
				  url: '../shop/goods?id='+id+"&shopId="+shopId//实际路径要写全
				})
			},
			but(){
				uni.pageScrollTo({
					duration: 400,//过渡时间
					scrollTop:0,//到达距离顶部的top值
				})
			},
			closeSkuModal(e){
				this.openSkuModal=e;
			},
			addOrderCart(id,multity){
				if(multity==1){
					this.openSkuModal=true;
					this.goodsId=id;
				}else{
					this.addCart(id);
				}
			},
			async addCart(id){
				// 发起请求
				const res = await uni.$http.get(uni.$url.addBySkuUrl+"?goodsId="+id+"&number=1",{goodsId:id});
			
				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
			
				uni.showToast({
					title: '成功加入购物车',
					icon: 'success'
				})
			},
			clean(){
				this.goodsName="";
			},
			//选择历史搜索
			choseHistory(e){
				this.goodsName = e.currentTarget.dataset.goodsname;
				this.goodsCategoryContent(e);
			},
			//清理搜索记录
			cleanHistory(){
				uni.setStorageSync('history', []);
				this.getHistory();
			},
			//获取历史记录缓存
			getHistory(){
				this.history = uni.getStorageSync('history');
			},
			//首次搜索显示的商品列表
			async goodsCategoryContent(e) {
				let isSave = 0;
				this.goodsData.pageNum = 1;
				//保存搜索记录
				if(this.goodsName!=""){
					for(let i=0;i<this.history.length;i++){
						if(this.goodsName==this.history[i]){
							isSave=1;
							break;
						}
					}
					if(isSave==0){
						this.history.push(this.goodsName);
						uni.setStorageSync('history', this.history);
						this.getHistory();
					}
				}
				
				if(e.currentTarget.dataset.goodsname!=undefined){
					this.goodsName=e.currentTarget.dataset.goodsname;
				}
				
				if(e.currentTarget.dataset.sorttype!=undefined){
					this.but();
					this.sortType=e.currentTarget.dataset.sorttype;
				}
				
				let query = {
					goodsName: this.goodsName,
					isComprehensive: false,
					isSales: false,
					priceDesc: false,
					priceAsc: false,
					pageNum: 1,
					pageSize: 9
				}
				switch(this.sortType){
					case "0":
						query.isComprehensive=true;
						query.isSales=false;
						query.priceDesc=false;
						query.priceAsc=false;
						break;
					case "1":
						query.isComprehensive=false;
						query.isSales=true;
						query.priceDesc=false;
						query.priceAsc=false;
						break;
					case "2":
						query.isComprehensive=false;
						query.isSales=false;
						query.priceDesc=true;
						query.priceAsc=false;
						break;
					case "3":
						query.isComprehensive=false;
						query.isSales=false;
						query.priceDesc=false;
						query.priceAsc=true;
						break;
				}
				
				let res = await uni.$http.post(uni.$url.getSearch, query);
				
				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
						
				this.goodsData.data=res.data.rows;
				this.goodsData.total=res.data.total;
				if(this.goodsData.total==0){
					this.isNull=true;
				}else{
					this.isNull=false;
				}
							
				this.$forceUpdate();
			},
			// 获取商品列表数据的方法
			async getGoodsData() {
				let pageNum = this.goodsData.pageNum;
				let pageSize = this.goodsData.pageSize;
				let total = this.goodsData.total;

				// 判断是否还有下一页数据
				if (pageNum * pageSize >= total) return uni.$showMsg('到底了，没有了！');
				// ** 打开节流阀
				this.isloading = true
				
				let query = {
					goodsName: this.goodsName,
					isComprehensive: false,
					isSales: false,
					priceDesc: false,
					priceAsc: false,
					pageNum: ++this.goodsData.pageNum,
					pageSize: 9
				}
				
				switch(this.sortType){
					case "0":
						query.isComprehensive=true;
						query.isSales=false;
						query.priceDesc=false;
						query.priceAsc=false;
						break;
					case "1":
						query.isComprehensive=false;
						query.isSales=true;
						query.priceDesc=false;
						query.priceAsc=false;
						break;
					case "2":
						query.isComprehensive=false;
						query.isSales=false;
						query.priceDesc=true;
						query.priceAsc=false;
						break;
					case "3":
						query.isComprehensive=false;
						query.isSales=false;
						query.priceDesc=false;
						query.priceAsc=true;
						break;
				}
				// 发起请求
				let res = await uni.$http.post(uni.$url.getSearch, query);

				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);

				// ** 关闭节流阀
				this.isloading = false

				// 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
				this.goodsData.data = [...this.goodsData.data, ...res.data.rows]

				this.$forceUpdate();
			},
			// 触底的事件
			onReachBottom() {
				// 判断是否正在请求其它数据，如果是，则不发起额外的请求
				if (this.isloading) return
				// 让页码值自增 +1
				// this.queryObj.pagenum += 1
				// 重新获取列表数据

				this.getGoodsData();
			},
			//根据索引（this.TabCur）获取catId
			getCatId() {
				let catId = '';

				for (var i = 0; i < this.goodsCategory.length; i++) {
					if (this.goodsCategory[i].value == this.TabCur) {
						catId = this.goodsCategory[i].value;
					}
				}

				return catId;
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
				this.currentIndex = e.currentTarget.dataset.id;
			},
			swiperChange(e) {
				let index = 1;
				this.TabCur = index;
				this.scrollLeft = (index - 1) * 60;
				this.currentIndex = index;
				//请相应的数据

				let catId = this.getCatId();

				this.goodsCategoryContent(this.goodsName);
			},
			moveHandle() {
				return false;
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
		//当上述isFixed为true的时候需要置顶的view会增加一个样式，使用 position = fixed 脱离文档流
		//设置top = 0 即可完成置顶
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		min-height: 100%;
		background: #f4f4f4;
	}

	.wrapper {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;

		&.fixed {
			position: fixed;
			width: 100%;
			z-index: 100;
		}
	}

	.nav-fixed {
		position: fixed;
		width: 100%;
		z-index: 1000;
	}

	.isfixed {
		background: #FF2222;
	}
	
	.logo-tips {
		display: inline-block;
		padding: 3rpx;
		color: #ffffff;
		background: #FF2222;
	}
	.goods-money{
		.goods-btn{
			margin-right: 20rpx;
			.goods-money-cart{
				margin-right: 20rpx;
			}
		}
	} 
	.search-wrap {
		position: absolute;
		top: 70rpx;
		left: 217rpx;
		z-index: 11;
		display: inline-block;
		height: 58rpx;
		line-height: 58rpx;
		margin-left: 50rpx;
		padding: 0 25rpx;
		background: #fff;
		border: 1rpx solid #FF2222;
		border-radius: 30rpx;
		box-sizing: border-box;
	}

	.cuIcon-search {
		display: inline-block;
		margin-right: 10rpx;
		color: #FF5D48;
		font-size: 35rpx;
	}

	.btn-search {
		color: #FF5D48;
	}

	.screen-swiper {
		width: 750rpx;
		height: 550rpx;
	}
	
	.cart-goods-item {
		display: flex;
		padding: 15rpx 0;
		background: #ffffff;
		padding: 30rpx 20rpx;
		margin-top: 10rpx;
		.goods-cover {
			width: 160rpx;
			height: 160rpx;
			margin-right: 40rpx;
			.cover {
				display: inline-block;
				width: 100%;
				height: 100%;
				border-radius:50%;
			}
		}
		.fr_img {
			.fr_img_content{
				border-radius: 50%;
			}
		}
		.goods-info {
			flex: 5;
			text-align: left;
	
			.title {
				height: 93rpx;
				line-height: 45rpx;
				font-size: 34rpx;
				font-weight: 400;
				color: #000000;
				width: 488rpx;
				overflow: hidden;
				-webkit-line-clamp: 2;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
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
				.goods-sum{
					position: absolute;
					right: 10rpx;
					top:-10rpx;
					flex-direction: row;
					.goods-money-button{
						font-weight: 400;
						color: #FFFFFF;
						height: 60rpx;
						line-height: 60rpx;
						padding: 0 20rpx;
						background: linear-gradient(0deg, #030000 0%, #FF0054 0%, #FFA14D 100%);
						border-radius: 15px;
					}
				}
			}
		}
	}
	
	//搜索
	.content{
		.cu-bar {
			box-shadow:none;
			.search-form {
				margin-right: 0;
				background: rgba(232, 232, 232, 0.9);
				border-radius: 10rpx;
				.cuIcon-roundclosefill {
					font-size: 36rpx;
				}
			}
			.search-input {
			}
		}
		.btn-search {
			display: inline-block;
			width: 100rpx;
			color: $custom-theme-color;
			text-align: center;
		}
		.search-option {
			display: flex;
			position: fixed;
			width: 100%;
			z-index: 999;
			background: #ffffff;
			border-top: 1rpx solid #E5E5E5;
			.search-option-item {
				flex: 1;
				text-align: center;
				height: 100rpx;
				line-height: 100rpx;
			}
		}
		.search-list-wrap {
			
			.search-nothing {
				text-align: center;
				.nothing {
					font-size: 24rpx;
					font-weight: 400;
					color: #000000;
					margin:100rpx 0;
				}
				.guess {
					position: relative;
					margin-top: 30rpx;
					margin-bottom: 20rpx;
					.line {
						width: 430rpx;
						height: 1rpx;
						margin: 0 auto;
						background: rgba($color: #000000, $alpha: 0.1);
					}
					.like-wrap {
						display: inline-block;
						width: 190rpx;
						background: #f1f1f1;
						position: absolute;
						top: -15rpx;
						left: 50%;
						margin-left: -80rpx;
						.icon-like {
							display: inline-block;
							width: 28rpx;
							height: 28rpx;
							margin-right: 14rpx;
							vertical-align: middle;
						}
						.text {
							font-size: 24rpx;
							font-weight: 400;
							color: #666666;
						}
					}
				}
			}
		}
	}
	//搜索推荐
	.search-recommend {
		background: #ffffff;
		padding-bottom: 20rpx;
		.search-recommend-item {
			margin: 0 30rpx 0 30rpx;
			.title-wrap {				
				margin-bottom: 20rpx;
				border-bottom: 1rpx solid #f1f1f1;
				.title {
					padding: 20rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #666666;
				}
			}
			.search-item-wrap {
				.search-item {
					display: inline-block;
					height: 50rpx;
					line-height: 50rpx;
					padding: 0 15rpx;
					margin: 10rpx 15rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #000000;
					background: #FFFFFF;
					border: 1rpx solid #E0E0E0;
					border-radius: 10rpx;
				}
			}
		}
		.search-history {
			.title-wrap {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.empty-wrap {
					display: inline-block;
					vertical-align: middle;
					.icon-empty {
						width: 18rpx;
						height: 25rpx;
						margin-right: 10rpx;
						position: relative;
						top:2rpx
					}
					.text {
						
					}
				}
			}
		}
		
	}

	.shops-scroll-content {
		white-space: nowrap; // 滚动必须加的属性
		width: 100%;
		height: 110rpx;
		padding: 15rpx 30rpx 30rpx 30rpx;
		box-sizing: border-box;

		.item {
			line-height: 50rpx;
			margin-right: 20rpx;
			display: inline-block;
			vertical-align: middle;

			.img {
				display: inline-block;
				margin-right: 11rpx;
				height: 50rpx;
				vertical-align: middle;

				image {
					display: inline-block;
					width: 50rpx;
					height: 50rpx;
					border: 1rpx solid #FF5D48;
					border-radius: 50%;
				}
			}

			.item-title {
				display: inline-block; // 让字体换行
				font-size: 28rpx;
				line-height: 50rpx;
				height: 50rpx;
			}
		}
	}

	.recommend-wrap {
		position: sticky;
		top: 80px;
		z-index: 99;

		.fixed {
			position: fixed;
			top: 0;
		}
	}

	.scroll-view {
		padding-top: 29px;
	}


	.swiper-box-list {
		flex: 1;
		width: 100%;
		height: 100%;
		overflow-y: scroll;
	}

	.swiper-topic-list {
		width: 100%;

		.tab-content {
			padding: 20rpx 0;
		}

		.goods-item {
			display: inline-block;
			width: 45%;
			height: 420rpx;
			padding: 3%;
			margin: 2%;
			background: #FFFFFF;
			border-radius: 20rpx;
			box-sizing: border-box;

			.cover-wrap {
				width: 280rpx;
				height: 280rpx;

				.cover {
					display: inline-block;
					width: 100%;
					height: 100%;
				}
			}

			.title-wrap {
				margin: 10rpx 0 15rpx 0;
				color: #000000;
				font-size: 30rpx;

				.title {
					display: inline-block;
					width: 100%;
					height: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}

			.tool-wrap {
				display: flex;
				justify-content: space-between;

				.price-wrap {
					height: 50rpx;
					font-size: 34rpx;
					color: #FF5D48;
					font-weight: bold;

					.price {
						margin-right: 24rpx;
					}

					.sign {
						font-size: 30rpx;
					}

					.discount {
						font-size: 24rpx;
						font-weight: 400;
						text-decoration: line-through;
						color: #888888;
					}
				}

				.btn-add-cart {
					position: relative;
					display: inline-block;
					right: 0;
					bottom: 18rpx;

					.icon-add {
						display: inline-block;
						width: 50rpx;
						height: 50rpx;
					}

					.icon-size {
						display: inline-block;
						width: 100rpx;
						height: 50rpx;
					}
				}
			}
		}

		.shop-item {
			display: flex;
			align-items: center;
			background: #FFFFFF;
			margin-bottom: 20rpx;
			padding: 20rpx;
			border-radius: 20rpx;

			.cover-wrap {
				display: inline-block;
				width: 100rpx;
				height: 100rpx;
				margin-right: 20rpx;

				.cover {
					display: inline-block;
					width: 100%;
					height: 100%;
				}
			}

			.shop-info {
				display: flex;
				width: 390rpx;
				height: 100rpx;
				flex-direction: column;
				justify-content: space-between;
				flex-shrink: 0;

				.shop-name {
					// align-items: flex-start;
				}

				.shop-label {
					.item-label {
						display: inline-block;
						font-size: 24rpx;
						color: #888888;
						margin: 10rpx;
					}
				}
			}

			.shop-discount {
				.discount {
					display: inline-block;
					width: 145rpx;
					height: 40rpx;
					color: #FF5D48;
					font-size: 24rpx;
					border: 1rpx solid #FF5D48;
					border-radius: 10rpx;
				}
			}
		}
	}
	
</style>
