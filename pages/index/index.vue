<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">茂名电视台直播</text></block>
			</cu-custom>
		</view>
		
		
		<scroll-view class="scrollviewCss" scroll-y="true" :refresher-enabled="refresher" :refresher-triggered="triggered"
		            :refresher-threshold="45" refresher-background="#f8f8f8" @refresherrefresh="onRefresh" @refresherrestore="onRestore"
		            @refresherabort="onAbort" @scrolltolower="scrollBottem" :style="{'top':tabFix,'height': scrollViewHeight+'px'}">
			<view class="content">
				
				
				<view class="swiper-wrap" v-if="bannerList.length">
					<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="2000" :duration="500" :style="{'height': bannerHeight + 'rpx'}">
						<swiper-item v-for="(item,index) in bannerList" :key="index">
							<view class="swiper-item">
								<image :src="item.imgUrl" mode=""></image>
							</view>
						</swiper-item>
					</swiper>
				</view>
				
				
				
				<view class="v-list">
					<view class="v-list-content"  v-for="(item,index) in list" :key="index" @click="toPage(item.roomId,item.liveRoomType,item.seeNum,item.likeNum)">
						<view class="v-list-img">
							<view class="v-list-watch">
								<view class="v-list-icon">
									<image src="../../static/voice.png"></image>
								</view>
								<text>{{item.seeNum}}看过</text>
							</view>
							<view class="v-list-title">
								<!-- <image v-if="item.liveRoomType==1" src="../../static/video1.png"></image>
								<image v-if="item.liveRoomType==2" src="../../static/Video.png"></image>
								<image v-if="item.report.type == 3" src="../../static/Picture.png"></image> -->
								<image class="icon icon-live" v-if="item.liveRoomType == 2 || (item.liveRoomType == 1 && item.report.type == 1)" src="../../static/Video.png"></image>
								<image class="icon icon-video" v-else-if="item.liveRoomType == 1 && item.report.type == 2 " src="../../static/video1.png"></image>
								<image class="icon icon-img" v-else-if="item.liveRoomType == 1 && item.report.type == 3" src="../../static/Picture.png"></image>
								{{item.introduce}}
								</view>
							<view class="v-list-bg">
								<fr-image class="avatar" :src="item.liveImgUrl" mode="aspectFill" style="height: 383rpx;" />
							</view>
						</view>
						<view class="v-list-bottom">
							<view class="v-list-left">
								<fr-image class="avatar" :src="item.anchor.headerImg" mode="aspectFill" />
								<text>{{item.anchor.name}}</text>
							</view>
							<view class="v-list-right">
								<image src="../../static/like.png" mode="widthFix" ></image>
								<text >{{item.likeNum}}喜欢</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 加载....没有更多 -->
			<view style="line-height: 60rpx;margin-bottom: 50rpx;">
				<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
			</view>
		</scroll-view>
		<tabbar :current="0"></tabbar>
	</view>
</template>

<script>
	import tabbar from '@/components/tabbar/tabbar'
	import FrImage from '@/components/fr-image/fr-image.vue'
	import { mapMutations } from 'vuex'
	export default {
		components:{
			tabbar,
			FrImage
		},
		data() {
			return {
				list: [],
				tabFix: this.CustomBar + 'px',
				isTabFix: {
					top: 'auto'
				},
				baseUrl: uni.$url.baseUrl,
				triggered:true,
				refresher:true,
				status: 'loadmore',
				iconType: 'flower',
				topRange:0,
				loadText: {
				    loadmore: '轻轻上拉',
				    loading: '努力加载中',
				    nomore: '拉也没用，没有了'
				},
				scrollViewHeight: 0, //scrollViewHeight高度
				bannerHeight: 160,  //banner高度
				bannerList: [],		//banner列表
			}
		},
		onLoad(options) {
		
			
			let strParam = '';
			if(Object.keys(options).length) {	
				
				// 拼接参数
				let param = ''
				for (let key in options) {
					if(key !== 'route' || key !== 'shareCode') {
						param += '&' + key + '=' + options[key]
					}
				}
				
				//替换第一个&符号为?
				strParam = param.replace('&','?');
			}
			
			//分享码存入vuex
			if(options.shareCode) {
				
				// console.log(options.shareCode);
				
				this.updateShareCode(options.shareCode);
				
			}
			
			if(options.route) {
				
				let route = options.route;
				
				// console.log({route});
				
				if(route && route.indexOf('/pages/index/index') == -1) {
					setTimeout(()=> {
						
						uni.navigateTo({
							url: route + strParam
						})
						
					}, 500);
				}
			}
		},
		onShow() {
			
			//获取banner
			this.getBannerImg();
			
			this.getLiveList();
			uni.hideTabBar({
				animation: false
			})
			this.initScrollViewHeight();
		},
		methods: {
			...mapMutations('m_user', ['updateShareCode']),
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
				this.getLiveList();
				this.getBannerImg();
			},
			/* 下拉被中止，没下拉完就松手就会触发 */
			onAbort() {
				console.log("onAbort");
			},                
			toPage(id,type,seeNum,likeNum){
				if(type==2){
					uni.navigateTo({
					  url: '/pages/live/live?id='+id+'&seeNum='+seeNum+'&likeNum='+likeNum
					})
				}else{
					uni.navigateTo({
					  url: '/pages/streaming/streaming?id='+id+'&seeNum='+seeNum+'&likeNum='+likeNum
					})
				}
				
			},
			async getBannerImg() {
				
				// 发起请求
				const res = await uni.$http.get(uni.$url.getBannerImg, { label: 'index_banner' });
				
				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
				
				let data = res.data.data[0];
				
				this.bannerHeight = data.height;
				
				if(!data.imgDto) data.imgDto = [];
				
				data.imgDto.forEach((item,index) => {
					item.imgUrl = item.imgUrl !== null ? uni.$url.baseUrl + item.imgUrl : '../../static/img-null.jpg';
				});
				
				this.bannerList = data.imgDto;
				
			},
			async getLiveList() {
				// 发起请求
				const res = await uni.$http.get(uni.$url.getLiveRoomList);
			
				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
				
				this.list = res.data.data;
				
				for(let i=0;i<this.list.length;i++){
					this.list[i].likeNum = this.list[i].likeNum;
					this.list[i].seeNum = this.list[i].comeNum;
					this.list[i].liveImgUrl = this.list[i].liveImgUrl !== null ? this.baseUrl + this.list[i].liveImgUrl : '../../static/img-null.jpg';
					this.list[i].anchor.headerImg = this.list[i].anchor.headerImg !== null ? this.baseUrl + this.list[i].anchor.headerImg : '../../static/img-null.jpg';
				}
			},
			//动态获取高度
			initScrollViewHeight() {
				
				const res = uni.getSystemInfoSync();

				uni.createSelectorQuery().in(this).select('.nav-fixed').boundingClientRect(result => {
					
					this.scrollViewHeight = res.windowHeight - result.height;
					
				}).exec();
			},
		},
		onPageScroll(e) {
			if(e.scrollTop==0){
				this.refresher=true;
			}else{
				this.refresher=false;
			}
		}
	}
</script>

<style lang="scss">
	.nav-fixed {
		position: fixed;
		width: 100%;
		z-index: 1000;
	}
	.scrollviewCss{
		// position: relative;
		position: fixed;
	}
	.isfixed {
		background: #FF2222;
	}
	.cuIcon-back {
		display: none;
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
		}
	}
	
	.v-list{
		padding-bottom: 50px;
		padding-top: 10px;
		.v-list-content{
			width: 100%;
			display: flex;
			flex-direction:column;
			-webkit-flex-direction:column;
			margin-bottom: 10px;
			.v-list-img{
				height: 211px;
				position: relative;
				.v-list-watch{
					z-index:2;
					position: absolute;
					top: 15px;
					left: 15px;
					height: 28px;
					line-height: 28px;
					padding: 0 15px 0 30px;
					border-radius: 15px;
					background: rgba($color: #000000, $alpha: 0.6);
					color: #FFFFFF;
					.v-list-icon{
						position: absolute;
						width: 28px;
						height: 28px;
						background: #FF2222;
						border-radius: 50%;
						text-align: center;
						left: 0;
						top: 0px;
						image{
							top: 8px;
							left: 8px;
							width: 10px;
							height: 10px;
							position: absolute;
						}
					}
				}
				.v-list-title{
					z-index:3;
					position: absolute;
					bottom:10px;
					left: 10px;
					color: #FFFFFF;
					padding: 0 15px;
					height: 30px;
					background: rgba($color: #000000, $alpha: 0.6);
					border-radius: 15px;
					text-align: center;
					line-height: 30px;
					font-size: 15px;
					display: flex;
					align-items: center;
					// white-space: nowrap;
					// text-overflow: ellipsis;
					// overflow: hidden;
					// word-break: break-all;
					 text-overflow: -o-ellipsis-lastline;
					  overflow: hidden;
					  text-overflow: ellipsis;
					  display: -webkit-box;
					  -webkit-line-clamp: 1;
					  line-clamp: 1;
					  -webkit-box-orient: vertical;
					.icon {
						display: inline-block;
						flex-shrink: 0;
						margin-right: 8rpx;
						vertical-align: -7rpx;
					}
					.icon-img {
						width: 35rpx;
						height: 35rpx;
					}
					.icon-video {
						width: 40rpx;
						height: 28rpx;
					}
					.icon-live {
						width: 40rpx;
						height: 28rpx;
					}
				}
				.v-list-bg{
					z-index:1;
					height: 211px;
					width: 100%;
					image{
						height: 211px;
						width: 100%;
					}
					position: absolute;
				}
			}
			.v-list-bottom{
				height: 44px;
				line-height: 44px;
				display: flex;
				justify-content:space-between;
				position: 0 20rpx;
				background: #FFFFFF;
				image{
					width: 28rpx;
					height: 24rpx;
					
				}
				.v-list-left{
					display: flex;
					flex-direction:row;
					left: 0;
					padding-left: 10px;
					.avatar {
						width: 48rpx;
					}
					image{
						width: 48rpx;
						height: 48rpx;
						border-radius: 50%;
					}
				}
				.v-list-right{
					
				}
				text{
					margin:0 20rpx 0 10rpx;
				}
			}
		}
		
	}
</style>
