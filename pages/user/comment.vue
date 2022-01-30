<template>
	<!-- 使用z-paging-swiper为根节点可以免计算高度 -->
	<z-paging-swiper class="wrapper">
		<cu-custom class="nav-wrap" bgColor="text-white bg-red" :isBack="true">
			<block slot="backText"><text>我的评价</text></block>
		</cu-custom>
		
		

		<!-- 此处代码复制了uView中tabsSwiper全屏选项卡的代码 -->
		<!-- 需要固定在顶部不滚动的view放在slot="top"的view中 -->
		<!-- <view slot="top"> -->
			<u-tabs-swiper class="tabs-wrap" ref="uTabs" :list="tabMenu" :current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750" :height="100" :style="{'top':tabFix}" :activeColor="'#000000'" :barStyle="{'background': '#FF5D48'}"></u-tabs-swiper>
		<!-- </view> -->
		<!-- swiper必须设置height:100%，因为swiper有默认的高度，只有设置高度100%才可以铺满页面  -->
		<swiper class="swiper" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" :style="{'height': swiperContentHeight +'px'}">
			<swiper-item class="swiper-item" v-for="(item, index) in tabMenu" :key="index">
				<comment-swiper-item :tabIndex="index" :currentIndex="swiperCurrent" :type="item.id"></comment-swiper-item>
			</swiper-item>
		</swiper>

		
	</z-paging-swiper>
</template>

<script>
	export default {
		data() {
			return {
				tabMenu: [{
					'id': 1,
					'name': '商品评价',
				},{
					'id': 2,
					'name': '报道评论'
				},{
					'id': 3,
					'name': '资讯评论'
				}],
				tabList: [],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				tabFix: this.CustomBar + 'px', //导航栏高度
				contentHeight: 0,  //contentHeight高度
				swiperContentHeight: 0,  //swiperContentHeight 高度
				contentPaddingBottom: 0,  //contentPaddingBottom 高度
				
			}
		},
		onLoad() {
			
			//初始化元素高度
			this.getSwiperContentHeight();
		},
		methods: {
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			getSwiperContentHeight() {
				let windowHeight = 0;
				let swiperTopHeight = 0;
				let tabsHeight = 0;
				let swiperHeight = 0;
			
				uni.getSystemInfo({
					success: function (res) {
					  windowHeight = res.windowHeight;
					}
				});
				const query = uni.createSelectorQuery().in(this);
			
				query.select('.tabs-wrap').boundingClientRect(data => {
					  
					tabsHeight = data.height;
			
				}).exec();
			
				query.select('.nav-wrap').boundingClientRect(data => {
					swiperTopHeight = data.height;
					
					this.contentPaddingBottom = this.tabbarHeight;
			
					this.swiperContentHeight = windowHeight - swiperTopHeight- tabsHeight;
				
				}).exec();
			},
		}
	}
</script>

<style>

</style>
