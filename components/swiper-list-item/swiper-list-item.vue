<!-- 在这个文件对每个tab对应的列表进行渲染 -->
<template>
	<view class="content">
		<!-- 这里设置了z-paging加载时禁止自动调用reload方法，自行控制何时reload（懒加载）-->
		<!--  :enable-back-to-top="currentIndex===tabIndex" 在微信小程序上可以多加这一句，因为默认是允许点击返回顶部的，但是这个页面有多个scroll-view，会全部返回顶部，所以需要控制是当前index才允许点击返回顶部 -->
		<z-paging class="paging" ref="paging" v-model="dataList" @query="queryList" :fixed="false" :auto="false">
		<!-- <z-paging class="paging" ref="paging" @query="queryList" :fixed="false" :auto="false"> -->
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<block v-for="(item,index) in dataList" :key="index">
				<block v-if="item.imgList.length == 1">					
					<view class="item-wrap item-image-one" @click="itemClick(item)">
						<view class="info-wrap">
							<h2 class="title">{{item.title}}</h2>
							<text class="date">{{item.createTime}}</text>
						</view>
						<view class="cover-wrap" v-for="(item1,index1) in item.imgList">
							<image class="cover" :src="item1" mode="aspectFill"></image>
						</view>
					</view>
				</block>
				
				<block v-if="item.imgList.length == 2">					
					<view class="item-wrap item-image-two" @click="itemClick(item)">
						<view class="info-wrap">
							<h2 class="title">{{item.title}}</h2>
						</view>
						<view class="image-list">
							<view class="cover-wrap" v-for="(item1,index1) in item.imgList">
								<image class="cover" :src="item1" mode="aspectFill"></image>
							</view>
						</view>
					</view>
				</block>
				
				<block v-if="item.imgList.length == 3">					
					<view class="item-wrap item-image-three" @click="itemClick(item)">
						<view class="info-wrap">
							<h2 class="title">{{item.title}}</h2>
						</view>
						<view class="image-list">							
							<view class="cover-wrap" v-for="(item1,index1) in item.imgList">
								<image class="cover" :src="item1" mode="aspectFill"></image>
							</view>
						</view>
					</view>
				</block>
			</block>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
				dataList: [],
				firstLoaded: false
			}
		},
		props:{
			catId: {
				type: [String, Number],
				required: true
			},
			//当前组件的index，也就是当前组件是swiper中的第几个
			tabIndex: {
				type: Number,
				default: function(){
					return 0
				}
			},
			//当前swiper切换到第几个index
			currentIndex: {
				type: Number,
				default: function(){
					return 0
				}
			}
		},
		watch: {
			currentIndex: {
				handler(newVal) {
					if(newVal === this.tabIndex){
						//懒加载，当滑动到当前的item时，才去加载
						if(!this.firstLoaded){
							setTimeout(() => {
								this.$refs.paging.reload();
							}, 5);
						}
					}
				},
				immediate: true
			},
		},
		methods: {
			async queryList(pageNo, pageSize) {
				//组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				//模拟请求服务器获取分页数据，请替换成自己的网络请求
				const params = {
					pageNum: pageNo,
					pageSize: pageSize,
					infoCategoryId: this.catId
				}
				
				let res = await this.queryListData(params);
				
				this.$refs.paging.complete(res);
				this.firstLoaded = true;
				
			},
			async queryListData(data, callback) {
				if (!data.pageNum || !data.pageSize) {
					return uni.$showMsg('页码不存在');
				}
				let pageNum = parseInt(data.pageNum);
				let pageSize = parseInt(data.pageSize);
				let type = data.type || 0;
				if (pageNum < 0 || pageSize <= 0) {
					return uni.$showMsg('页码不符合规范');
				}
				// if (showLog) {
				// 	console.log('%c\n----------请求开始--------', 'color:green;');
				// 	console.info(`请求参数：【pageNum:${pageNum},pageSize:${pageSize}】`)
				// 	console.log('%c----------请求结束--------\n', 'color:green;');
				// }
				uni.showLoading({
					title: '加载中...'
				})
				if (pageNum == 0) {
					pageNum = 1;
				}

				return this.callQueryResult(data);

			},
			async callQueryResult(params) {
				
				const res = await uni.$http.post(uni.$url.getInfoList, params);
				
				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
				
				let data = res.data.rows;
				
				data.forEach((item,index) => {
					
					item.imgList.forEach((item1,index1) => {						
						item.imgList[index1] = item1 !== null ? uni.$url.baseUrl + item1 : '../../static/img-null.jpg';
					});
					
				});
				
				return data;
				
			},
			itemClick(item) {
				console.log('点击了', item.title);
				
				if(item.url !== null && item.url !== '') {
					
					uni.navigateTo({
						url: '/pages/show/webview?url=' + item.url
					})
										
				} else {
					
					uni.navigateTo({
						url: '/pages/show/detail?id=' + item.id
					})
					
				}
				
				
			}
		}
	}
</script>

<style lang="scss">
	/* 注意:父节点需要固定高度，z-paging的height:100%才会生效 */
	.content {
		height: 100%;
	}
	
	.paging {
		height: 100%;
	}
	
	.item-wrap {
		display: flex;
		padding: 30rpx 20rpx;
		background: #ffffff;
		border: 1rpx solid #f1f1f1;
		&.item-image-one {
			flex-direction: row;
			.cover-wrap {
				width: 320rpx;
				height: 180rpx;
				margin-right: 20rpx;
				flex-shrink: 0;
				.cover {
					display: inline-block;
					width: 100%;
					height: 100%;
				}
			}
			.info-wrap {
				flex: auto;
				margin-right: 10rpx;
				.title {
					font-size: 30rpx;
					color: #000000;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.date {
					margin-top: 20rpx;
					font-size: 24rpx;
					color: #888888;
				}
			}
		}
		&.item-image-two {
			flex-direction: column;
			.info-wrap {
				width: 100%;
				.title {
					-webkit-box-orient: vertical;
					display: -webkit-box;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-line-clamp: 2;
				}
			}
			.image-list {
				display: flex;
				width: calc(100% + 10rpx);
				flex-direction: row;
				.cover-wrap {
					display: inline-block;
					width: 345rpx;
					height: 200rpx;
					border-radius: 5rpx;
					margin: 10rpx 5rpx 0 5rpx;
					overflow: hidden;
					.cover {
						display: inline-block;
						width: 100%;
						height: 100%;
					}
				}
			}
		}
		&.item-image-three {
			.info-wrap {
				width: 100%;
				.title {
					-webkit-box-orient: vertical;
					display: -webkit-box;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-line-clamp: 2;
				}
			}
			.image-list {
				display: flex;
				width: calc(100% + 30rpx);
				flex-direction: row;
				.cover-wrap {
					display: inline-block;
					width: 227rpx;
					height: 200rpx;
					border-radius: 5rpx;
					margin: 10rpx 5rpx 0 5rpx;
					overflow: hidden;
					.cover {
						display: inline-block;
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
	
	
</style>
