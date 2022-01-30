<!-- 在这个文件对每个tab对应的列表进行渲染 -->
<template>
	<view class="content">
		<!-- 这里设置了z-paging加载时禁止自动调用reload方法，自行控制何时reload（懒加载）-->
		<!--  :enable-back-to-top="currentIndex===tabIndex" 在微信小程序上可以多加这一句，因为默认是允许点击返回顶部的，但是这个页面有多个scroll-view，会全部返回顶部，所以需要控制是当前index才允许点击返回顶部 -->
		<z-paging class="paging" ref="paging" v-model="dataList" @query="queryList" :fixed="false" :auto="false">
		<!-- <z-paging class="paging" ref="paging" @query="queryList" :fixed="false" :auto="false"> -->
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<block v-if="type == 1">				
				<view class="item-wrap goods-comment" v-for="(item,index) in dataList" :key="index">
					<view class="comment-wrap">
						<view class="comment-content">{{ item.comment }}</view>
						<view class="comment-image">
							<view class="image-layout-wrap">
								
								<view class="image-wrap image-layout-one" v-if="item.commentImgs.length == 1">
									
									<block v-for="(item1,index1) in item.commentImgs"  :key="index1">
										<image class="swiper" :src="baseUrl+item1" mode="aspectFill" style="height: 422rpx;" @click="getImgIndex(index1,item.commentImgs)"></image>
										
									</block>
								</view>
								
								<view class="image-wrap image-layout-four" v-else-if="item.commentImgs.length >= 2">
									
									<block v-for="(item1,index1) in item.commentImgs"  :key="index1">
										<view class="cover-wrap"  @click="getImgIndex(index1,item.commentImgs)">
											<image class="swiper" :src="baseUrl+item1" mode="aspectFill"></image>
										</view>
										
									</block>
								</view>
								
							</view>
						</view>
					</view>
					<view class="goods-wrap">
						<view class="goods-info">
							<view class="cover-wrap">
								<image class="cover" :src="baseUrl + item.goodsImg" mode=""></image>
							</view>
							<view class="info-wrap">
								<view class="title">{{ item.goodsName }}</view>
								<view class="sku">{{ item.goodsSku || '' }}</view>
								<view class="price">
									<text class="sign">￥</text>{{ item.goodsPrice }}
								</view>
							</view>
						</view>
					</view>
					<view class="date">{{ item.createTime }}</view>
				</view>
			</block>
			
			<block v-else-if="type == 2">
				<view class="item-wrap report-comment" v-for="(item,index) in dataList" :key="index">
					<view class="comment-content">
						{{ item.message }}
					</view>
					<view class="report-info" @click="itemClickReport(item.reportId)">
						<view class="report-cover">
							<image :src="item.imgUrl" class="cover"></image>
						</view>
						<view class="report-title">
							{{ item.title }}
						</view>
					</view>
					<view class="date">{{ item.createTime }}</view>
				</view>
			</block>
			
			<block v-else-if="type == 3">
				<view class="item-wrap news-comment" v-for="(item,index) in dataList" :key="index">
					<view class="comment-content">
						{{ item.message }}
					</view>
					<view class="report-info" @click="itemClickNews(item.infoId)">
						<view class="report-cover">
							<image :src="item.imgUrl" class="cover"></image>
						</view>
						<view class="report-title">
							{{ item.title }}
						</view>
					</view>
					<view class="date">{{ item.createTime }}</view>
				</view>
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
				firstLoaded: false,
				baseUrl: uni.$url.baseUrl,
			}
		},
		props:{
			type: {
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
					pageSize: pageSize
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
				
				uni.showLoading({
					title: '加载中...'
				})
				if (pageNum == 0) {
					pageNum = 1;
				}
			
				return this.callQueryResult(data);
			
			},
			async callQueryResult(params) {
				
				
				if(this.type == 1) {
					
					const res = await uni.$http.get(uni.$url.getMyGoodsComment, params);
					
					if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
					
					let data = res.data.data;
					
					data.forEach((item,index) => {
						
						item.imgUrl = item.imgUrl !== null ? uni.$url.baseUrl + item.imgUrl : '../../static/img-null.jpg';
						
					});
					
					return data;
					
				} else if (this.type == 2) {
					
					const res = await uni.$http.post(uni.$url.getReportCommentListByUser, params);
					
					if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
					
					let data = res.data.rows;
					
					data.forEach((item,index) => {
						
						item.imgUrl = item.imgUrl !== null ? uni.$url.baseUrl + item.imgUrl : '../../static/img-null.jpg';
						
					});
					
					return data;
					
				} else if (this.type == 3) {
					
					const res = await uni.$http.post(uni.$url.getInfoCommentListByUser, params);
					
					if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
					
					let data = res.data.rows;
					
					data.forEach((item,index) => {
						
						item.imgUrl = item.imgUrl !== null ? uni.$url.baseUrl + item.imgUrl : '../../static/img-null.jpg';
						
					});
					
					return data;
					
				}
				
			},
			itemClickReport(id) {
				console.log('点击了', id);
				
				uni.navigateTo({
					url: '/pages/streaming/streaming-history?id=' + id
				})
				
			},
			itemClickNews(id) {
				console.log('点击了', id);
				
				uni.navigateTo({
					url: '/pages/show/detail?id=' + id
				})
				
			},
			getImgIndex(index,photos){
				console.log(index,photos);
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
		width: 710rpx;
		margin: 20rpx;
		padding: 35rpx 30rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		flex-direction: row;
		background: #ffffff;
		border: 1rpx solid #f1f1f1;
	}
	
	.goods-comment {
		.comment-wrap {
			padding-bottom: 40rpx;
			margin-bottom: 40rpx;
			border-bottom: 1rpx solid #f1f1f1;
			.comment-content {
				
			}
			.comment-image {
				.image-layout-wrap {
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
							}
						}
					}
				}
			}
		}
		.goods-info {
			display: flex;
			padding-bottom: 30rpx;
			border-bottom: 1rpx solid #F1F1F1;
			margin-bottom: 25rpx;
			.cover-wrap {
				width: 120rpx;
				height: 120rpx;
				margin-right: 20rpx;
				flex-shrink: 0;
				.cover {
					display: inline-block;
					width: 100%;
					height: 100%;
				}
			}
			.info-wrap {
				
				.title {
					font-size: 30rpx;
					color: #000000;
					height: 45rpx;
					line-height: 45rpx;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					word-break: break-all;
				}
				.sku {
					margin: 10rpx 0;
					font-size: 24rpx;
					color: #666666;
				}
				.price {
					font-size: 34rpx;
					color: #000000;
					.sign {
						font-size: 24rpx;
						color: #000000;
					}
				}
			}
		}
	}
	
	
	.report-comment {
		.comment-content {
			padding-bottom: 40rpx;
			margin-bottom: 40rpx;
			border-bottom: 1rpx solid #f1f1f1;
		}
		.report-info {
			display: flex;
			.report-cover {
				display: inline-block;
				width: 120rpx;
				height: 120rpx;
				margin-right: 20rpx;
				flex-shrink: 0;
				.cover {
					display: inline-block;
					width: 100%;
					height: 100%;
				}
			}
			.report-title {
				
			}
		}
		.date {
			margin-top: 40rpx;
			padding-top: 20rpx;
			border-top: 1rpx solid #f1f1f1;
		}
	}
	
	.news-comment {
		.comment-content {
			padding-bottom: 40rpx;
			margin-bottom: 40rpx;
			border-bottom: 1rpx solid #f1f1f1;
		}
		.report-info {
			display: flex;
			.report-cover {
				display: inline-block;
				width: 120rpx;
				height: 120rpx;
				margin-right: 20rpx;
				.cover {
					
				}
			}
			.report-title {
				
			}
		}
		.date {
			margin-top: 40rpx;
			padding-top: 20rpx;
			border-top: 1rpx solid #f1f1f1;
		}
	}
	
</style>
