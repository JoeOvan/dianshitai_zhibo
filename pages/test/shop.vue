<template>
  <view class="wrapper">
    <view class="nav-wrap" style="position: relative;" :style="{'height':tabFix}">
      <view class="nav-fixed">
        <cu-custom bgColor="text-white" :isBack="true">
          <block slot="backText"><text class="logo-tips">商城</text></block>
        </cu-custom>
      </view>
      <view class="goods-search" @click="toSearch" :style="{'top': clientTop +'px'}">
        <view>
          <image src="../../static/search.png" mode="aspectFill"></image>
        </view>
        <view style="color:#FF5D48;margin-top: 3rpx;">搜索商品</view>
      </view>
    </view>

	
	<scroll-view class="scrollview-wrap" scroll-y="true" :refresher-enabled="refresher" :refresher-triggered="triggered"
	            :refresher-threshold="45" refresher-background="#f8f8f8" @refresherrefresh="onRefresh" @refresherrestore="onRestore"
	            @refresherabort="onAbort" @scrolltolower="scrollBottem" @scroll="onScrollView" :style="{'height': scrollViewHeight+'px'}">
	
		
		
		<!-- <view class="swiper-wrap" v-if="bannerList.length"> -->
		<view class="swiper-wrap">
			<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="2000" :duration="500" :style="{'height': bannerHeight + 'rpx'}">
				<swiper-item  v-for="(item,index) in bannerList" :key="index">
					<view class="swiper-item">
						<image :src="item.imgUrl" mode=""></image>
					</view>
				</swiper-item>
			</swiper>
		</view>


		<!-- <view class="content" :style="{'top':tabFix}"> -->

			<scroll-view scroll-x="true" scroll-y="false" class="bg-white nav top-menu-view" :class="tabMenuFixed ? 'isfixed' : 'isNoFixed'" scroll-with-animation
					   :scroll-left="scrollLeft" :style="{'top':tabMenuTop+ 'px'}">
				<view class="cu-item" :class="index==TabCur?'text-green cur':''" v-for="(item,index) in tabMenu"
					  :key="index" @click="tabSelect" :data-index="index">
				  {{item.name}}
				</view>
			</scroll-view>

			<!-- 显示区域 -->
			<swiper class="swiper-box-list" duration="300" @change="swiperChange" :current="currentIndex" :style="{'height': swiperContentHeight +'px'}">
				<block v-for="(item,index) in tabContent" :key="index">
				  <swiper-item>
					<!-- <scroll-view class="swiper-topic-list" :scroll-y="false" :style="{'height': swiperContentHeight + 'px'}"> -->
					  <view :class="'tab-content tabContent tabContent_'+index">
						<block v-if="TabCur == index && item.length >= 1">
						  <!-- 展示列表内容 -->
						  <view class="cart-goods-item" v-for="(item1,index1) in item" :key="index1" >
							<view class="goods-cover" @click="toPage(item1.goodsId)">
							  <image class="cover" lazy-load :src="item1.src"></image>
							</view>
							<view class="goods-info">
							  <view class="title" @click="toPage(item1.goodsId)">{{item1.name}}</view>
							  <!-- <view class="intro-wrap"><text class="intro"></text></view> -->
							  <view class="price-wrap">
								<view class="price" v-if="item1.multity==2"><text class="sign">￥</text>{{item1.price}}起</view>
								<view class="price" v-if="item1.multity==1"><text class="sign">￥</text>{{item1.minPrice}}起</view>
								<view class="goods-sum">
								  <view class="goods-money-button" @click="addOrderCart(item1.goodsId,item1.multity)">
									<image class="icon-plus" src="../../static/icon-plus.png"></image>
								  </view>
								</view>
							  </view>
							</view>
						  </view>
						</block>
						<block v-else>
						  <view class="order-null"><image style="width: 262rpx;margin-top:180rpx;" src="../../static/nullshop.png" mode=""></image></view>
						</block>
					  </view>
					<!-- </scroll-view> -->
				  </swiper-item>
				</block>
			</swiper>

		<!-- </view> -->


	</scroll-view>

	
	<view class="cart" @click="toCart">
		<text class="cart-num">{{ cartTotal }}</text>
		<image src="../../static/Shop-cart.png" mode="aspectFill"></image>
	</view>

    <tabbar :current="1"></tabbar>

    <sku :isLive="isLive" :open="openSkuModal" :goodsId="goodsId" @state='closeSkuModal' @skuGoodsNum="getSkuGoodsNum"  style="z-index: 999;height: 0;"></sku>
  </view>
</template>

<script>
import FrImage from '@/components/fr-image/fr-image.vue'
import tabbar from '@/components/tabbar/tabbar'
import sku from '@/components/sku.vue'
export default {
  components:{FrImage,tabbar,sku},
  data() {
    return {
      topRange: 0, //导航栏初始化距顶部的距离
      scrollSize: 0, //滚动距离
      isfixed: false, //是否固定顶部
      isLive: false,

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
      openSkuModal: false,

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
      clientTop:0,
      goodsRecommendList: [],

      //商品规格模块
      goodsId:0,
      price:0.00,

      tabMenu: [],  //tab菜单
      tabContent: [],  //tab内容列表
      baseUrl: uni.$url.baseUrl,

      tabbarHeight: 0, //tabbar高度
      cartTotal: 0,  //购物车合计
      th: 0,
	  
	  bannerHeight: 160,  //banner高度
	  bannerList: [],		//banner列表
	  
	  scrollViewHeight: 0, //scrollViewHeight高度
	  
	  refresher:true,
	  triggered:true,
	  
	  isScrollY: false,
	  
	  tabMenuFixed: false, //tabMenu 吸顶
    }
  },
  onLoad() {
    //获取胶囊高度
    let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
    this.clientTop=menuButtonInfo.top;
	
	//初始化ScrollViewHeight
	this.initScrollViewHeight();

	//getBannerImg 获取banner
	this.getBannerImg();
    // this.getSwiperContentHeight();
    this.goodsCategoryContent();
	
	
  },
  onShow() {
	  

	  
    this.getCartTotal();
    this.openSkuModal=false;
    uni.hideTabBar({
      animation: false
    })
  },
  mounted() {
    // this.getSwiperContentHeight();

  },
  updated() {
    // this.initSwiperHeight('.tabContent_' + this.TabCur);
	this.conputedSwiperHeight(this.TabCur);
  },
  created() {
	  this.conputedSwiperHeight(0);
  },
  watch: {
    // 1. 监听 total 值的变化，通过第一个形参得到变化后的新值
    total(newVal) {
      this.cartTotal = newVal;
    }
  },
  methods: {
	  onScrollView(e) {
		  
		  
		  console.log(e.detail.scrollTop)
		  
			// let tabTop = 0;
			// let scrollviewHeight = e.detail.scrollTop;
		  
			// uni.createSelectorQuery().in(this).select('.top-menu-view').boundingClientRect(result => {

			// 	tabTop = result.top;
				
			// 	console.log(tabTop, scrollviewHeight)
			// 	 if (tabTop < scrollviewHeight) {
			// 	     this.tabMenuFixed = true;
			// 	     this.tabMenuTop = 0;
			// 	 } else {
			// 	     this.tabMenuFixed = false;
			// 	 }

			// }).exec();
		  

		  
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
	  	this.initScrollViewHeight();
	  	
	  	//getBannerImg 获取banner
	  	this.getBannerImg();
	  	this.getSwiperContentHeight();
	  	this.goodsCategoryContent();
	  },
	  /* 下拉被中止，没下拉完就松手就会触发 */
	  onAbort() {
	  	console.log("onAbort");
	  },
	  async getBannerImg() {
	  	
	  	// 发起请求
	  	const res = await uni.$http.get(uni.$url.getBannerImg, { label: 'goods_banner' });
	  	
	  	if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
	  	
	  	let data = res.data.data[0];
	  	
	  	this.bannerHeight = data.height;
		
		if(!data.imgDto) return;
	  	
	  	data.imgDto.forEach((item,index) => {
	  		item.imgUrl = item.imgUrl !== null ? uni.$url.baseUrl + item.imgUrl : '../../static/img-null.jpg';
	  	});
	  	
	  	this.bannerList = data.imgDto;
	  	
	  },
    toSearch(){
      uni.navigateTo({
        url: '/pages/search/search'
      })
    },
    addOrderCart(id,multity){
      if(multity==1){
        this.openSkuModal=true;
        this.goodsId=id;
      }else{
        this.addCart(id);
      }
    },
    getSkuGoodsNum(e){
      this.getCartTotal();
    },
    async addCart(id){
      // 发起请求
      const res = await uni.$http.get(uni.$url.addBySkuUrl+"?goodsId="+id+"&number=1",{goodsId:id});

      if (res.data.code !== 0) return uni.$showMsg(res.data.msg);

      this.getCartTotal();

      uni.showToast({
        title: '成功加入购物车',
        icon: 'success'
      })
    },
    toCart(){
      uni.navigateTo({
        url: '/pages/shop/cart'
      })
    },
    closeSkuModal(e){
      this.openSkuModal=e;
    },
    getSwiperContentHeight() {
      let windowHeight = 0;
      let swiperTopHeight = 0;
	  let tabsHeight = 0;

      uni.getSystemInfo({
        success: function (res) {
          windowHeight = res.windowHeight;
        }
      });
      const query = uni.createSelectorQuery().in(this);
	  
	  query.select('.top-menu-view').boundingClientRect(data => {
		  
	    tabsHeight = data.height;

	  }).exec();
	  
      query.select('.nav-wrap').boundingClientRect(data => {
        swiperTopHeight = data.height;

        this.tabbarHeight = uni.getStorageSync('tabbarHeight');

        this.swiperContentHeight = windowHeight - swiperTopHeight - this.tabbarHeight - tabsHeight;
      }).exec();
	  
	  
	  
    },
    //动态获取高度
    initSwiperHeight(element) {
      uni.createSelectorQuery().in(this).select(element).boundingClientRect(result => {
        if (result) {
          if(result.height>0){
            this.swiperHeight = result.height;
          }
        } else {
          this.initSwiperHeight(element);
        }
      }).exec();
    },
    toPage(id){
      uni.navigateTo({
        url: '../shop/goods?id='+id //实际路径要写全
      })
    },
    //分类内容
    async goodsCategoryContent(index, id) {
      let res = await uni.$http.get(uni.$url.goodsCategoryListUrl);

      if (res.data.code !== 0) return uni.showToast({title: res.data.msg,duration: 1500,icon: 'none'});

      let data = res.data.data;

      let newData = {
        cateName: [],
        cateContent: []
      }

      data.forEach((item,index)=> {
        let cateName = {
          name: item.name,
          cateId: item.categoryId
        }

        //分类内容拼接
        let goodsList = [];
        item.goodsList.forEach((item1,index1) => {
          let goodsListItem = {
            ...item1,
            src: item1.thumbImgUrl ? this.baseUrl + item1.thumbImgUrl : '../../static/img-null.jpg',
          }
          goodsList.push(goodsListItem);
        });

        newData['cateName'].push(cateName);
        newData['cateContent'].push(goodsList);

      });

      this.tabMenu = newData['cateName'];
      this.tabContent = newData['cateContent'];
    },
    tabSelect(e) {
      this.TabCur = e.currentTarget.dataset.index;
      this.scrollLeft = (e.currentTarget.dataset.index - 1) * 60;
      this.currentIndex = e.currentTarget.dataset.index;
	  
    },
    swiperChange(e) {
      let index = e.detail.current;
      this.TabCur = index;
      this.scrollLeft = (index - 1) * 60;
      this.currentIndex = index;
    },
    //获取购物车数量
    async getCartTotal() {
      this.cartTotal=0;

      // 发起请求
      const res = await uni.$http.get(uni.$url.getCartUrl);

      if (res.data.code !== 0) return uni.showToast({title: "购物车"+res.data.msg,duration: 1500,icon: 'none'});

      let data = res.data.data;

      for(let i=0;i<data.length;i++){
        this.cartTotal += data[i].number
      }
    },
	//动态获取高度
	initScrollViewHeight() {
		
		const res = uni.getSystemInfoSync();
		
		this.tabbarHeight = uni.getStorageSync('tabbarHeight');
	
		uni.createSelectorQuery().in(this).select('.nav-wrap').boundingClientRect(result => {
			
			this.scrollViewHeight = res.windowHeight - result.height - this.tabbarHeight;
			
		}).exec();
	},
	//计算swiper高度
	conputedSwiperHeight(index) {

		uni.createSelectorQuery().in(this).select('.tabContent_'+index).boundingClientRect(result => {

			if (result) {
				
				this.swiperContentHeight = result.height;
				
			} else {

				this.conputedSwiperHeight(index);
			}
		}).exec();
	}
  },
  onPageScroll: function(e) {  
	  
	  console.log(e);

  },
}
</script>

<style lang="scss">
page {
  height: 100%;
  background: #f4f4f4;
}

.wrapper {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	// overflow-y: auto;
	overflow: visible;
	height: 100%;
}

.scrollview-wrap {
	// position: fixed;
	position: relative;
	overflow: visible;
}

.fr_img .fr_img_content{
  border-radius: 50%;
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
  background: #FF2222;
}

.cuIcon-back {
  display: none;
}

.complete-state {
  color: #999999;
}

.isfixed {
	position: fixed;
}

.isNoFixed {
	position: relative;
	top:auto;
}

.content {
  // position: fixed;
  position: sticky;
  width: 100%;
  // top: var(--status-bar-height);
  top: 0;
}

.swiper-wrap {
	.swiper {
		.swiper-item {
			height: 100%;
		}
		
		/* 默认指示点的样式 */
		.wx-swiper-dot {
		  width: 30rpx;
		  height: 8rpx;
		  background: white;
		  border-radius: 4rpx;
		}
		 
		/* 选中指示点的样式 */
		.wx-swiper-dot.wx-swiper-dot-active {
			width: 30rpx;
			height: 8rpx;
			background: #7F0A0A;
			border-radius: 4rpx;
		}
		
		.wx-swiper-dots{
			position:absolute;
			left: 50px!important;
		}
		
		.wx-swiper-dots.wx-swiper-dots-horizontal{
			margin-bottom: -5rpx;
		}
	}
}

.order-null{
  height: 650rpx;
  line-height: 650rpx;
  text-align:center;
}
.goods-money {
  .goods-btn {
    margin-right:20rpx;
    .goods-money-cart{
      margin-right:20rpx;
    }
  }
}
.goods-search{
  display: flex;
  z-index: 99999;
  // position: absolute;
  position: fixed;
  right: 210rpx;
  width: 180rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #FF5D48;
  border-radius: 32px;
  padding:10rpx 10rpx 10rpx 16rpx;
  image{
    width: 28rpx;
    height: 28rpx;
    position: relative;
    top: 8rpx;
    right: 4rpx;
  }
}
.cart{
  position: fixed;
  text-align: center;
  padding-top: 35rpx;
  bottom: 130rpx;
  left: 20rpx;
  width: 130rpx;
  height: 130rpx;
  background: linear-gradient(0deg, #030000 0%, #FF0054 0%, #FFA14D 100%);
  box-shadow: 0px 0px 18px 0px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  image{
    z-index: 1;
    width: 64rpx;
    height: 60rpx;
  }
  .cart-num{
    z-index: 2;
    background: #FFFFFF;
    border-radius: 50%;
    font-weight: bold;
    color: #FF2222;
    font-size: 24rpx;
    width: 50rpx;
    height: 50rpx;
    line-height: 50rpx;
    position: absolute;
    right: 14rpx;
    top: 17rpx;
  }
}

.tab-content {
	padding: 15rpx;
}

.cart-goods-item {
  // display: flex;
  // padding: 15rpx 0;
  // background: #ffffff;
  // padding: 30rpx 20rpx;
  // margin-top: 10rpx;
  display: inline-block;
  width: 330rpx;
  height: 525rpx;
  margin: 15rpx;
  border-radius: 20rpx;
  overflow: hidden;
  background: #ffffff;
  
  
  .goods-cover {
	width: 100%;
	height: 362rpx;
    .cover {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }

  .goods-info {
    flex: 5;
    text-align: left;
    .title {
      height: 100rpx;
      line-height: 45rpx;
      font-size: 34rpx;
      font-weight: 400;
      color: #000000;
      padding: 10rpx;
      overflow: hidden;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }

    // .intro-wrap {
    //   display: flex;
    //   justify-content: space-between;
    //   height: 35rpx;
    //   line-height: 35rpx;
    //   color: #666666;

    //   .intro {
    //     font-size: 24rpx;
    //     font-weight: 400;
    //   }

    //   .count {
    //     font-size: 34rpx;
    //     font-weight: 400;
    //     color: #000000;
    //   }
    // }

    .price-wrap {
      display: flex;
      justify-content: space-between;
      position: relative;
	  padding: 0 10rpx;
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
			display: flex;
			font-weight: 400;
			color: #FFFFFF;
			width: 48rpx;
			height: 48rpx;
			line-height: 48rpx;
			background: #FF6853;
			border-radius: 24rpx;
			justify-content: center;
			align-items: center;
		  .icon-plus {
			  display: inline-block;
			  width: 20rpx;
			  height: 20rpx;
		  }
        }
      }
    }
  }
}

.top-menu-view {
  display: flex;
  white-space: nowrap;
  width: 100%;
  background-color: #FFFFFF;
  height: 86upx;
  border-top: 1px solid #d8dbe6;
  position: -webkit-sticky;
  position: sticky;
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
</style>
