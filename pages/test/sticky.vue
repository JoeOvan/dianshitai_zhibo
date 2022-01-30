<template>
<view class="weimob-block">
  <view class="weimob-title">嵌套在 scroll-view 内使用</view>
  <!-- 这里需要固定高度，scroll-view里的元素高度需要大于其高度 -->
  <scroll-view
		:scroll="onScroll"
		scroll-y
		id="scroller"
		style="height: 400rpx; background-color: #fff;margin-top: 40rpx;"
	>
		<view style="height: 800rpx">
			<weimob-sticky
				:scroll-top="scrollTop"
				:offset-top="offsetTop"
			>
				<button size="mini" class="margin-left-scoll">
					嵌套在 scroll-view 内 
				</button>
			</weimob-sticky>
		</view>
	</scroll-view>
</view>
</template>

<script>
	export default {
		data() {
			return {
				container: null, //一个函数，返回容器对应的 NodesRef 节点
				scrollTop: 180, // 当前滚动区域的滚动位置，非null时会禁用页面滚动事件的监听
				offsetTop: 0  // 吸顶时与顶部的距离，单位px
			}
		},
		methods: {
			onScroll(event) {
			 // 容器滚动时获取节点信息
			  wx.createSelectorQuery()
			    .select('#scroller')
			    .boundingClientRect((res) => {
			
			        this.scrollTop = event.detail.scrollTop;
			        this.offsetTop = res.top;
			
			    }).exec();
			}
		},
		  
		  onReady() {
		  // 页面渲染完，获取节点信息
		      this.container = () => wx.createSelectorQuery().select('#container');
		  }
	}
</script>

<style>

</style>
