<template>
	<view class="wrapper">
		<!-- 直播播放模块 -->
		<view  @click="handleClicked">
			<video class="video" :id="'myVideo'" :ref="'myVideo'"  title="产品直播" :style="{'height':wHeight+'px'}" 
				src="http://devimages.apple.com/iphone/samples/bipbop/gear1/prog_index.m3u8" 
				:controls="true" :show-center-play-btn="true" :autoplay="true" :loop="true" :show-play-btn="true" objectFit="cover"
				:show-fullscreen-btn="true" @error="videoErrorCallback">
			</video>
			
			 <!-- 中间播放按钮 -->
			<view class="vd-cover"> 
				<image v-if="!isPlay" src="../../static/play.png" mode="aspectFill"  @click="handleClicked"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				wHeight: 0,
			}
		},
		mounted() {
			this.getVideoHeight();
		},
		methods: {
			getVideoHeight() {
				let that = this;
				uni.getSystemInfo({
				    success: function (res) {
						console.log(res)
				       that.wHeight = res.windowHeight - that.CustomBar;
				    }
				});
			},
			// 点击视频事件
			handleClicked() {
				if(timer){
					clearTimeout(timer)
				}
				this.clickNum++
				timer = setTimeout(() => {
					if(this.clickNum >= 2){
						console.log('双击视频')
					}else{
						console.log('单击视频')
						if(this.isPlay){
							this.pause()
						}else{
							this.play()
						}
					}
					this.clickNum = 0
				}, 300)
			},
			// 播放
			play() {
				this.video=uni.createVideoContext('myVideo', this);
				this.video.play()
				this.isPlay = true
			},
			// 暂停
			pause() {
				this.video=uni.createVideoContext('myVideo', this);
				this.video.pause()
				this.isPlay = false
			},
		}
	}
</script>

<style scoped>

</style>