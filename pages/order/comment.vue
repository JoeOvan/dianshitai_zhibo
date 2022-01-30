<template>
	<view class="wrapper">
		
		<cu-custom class="nav-wrap" bgColor="text-white bg-red" :isBack="true">
			<text class="title" slot="backText">订单评价</text>
		</cu-custom>
		
		<view class="goods-comment" v-if="goods">
			<view class="goods-info">
				<view class="cover-wrap">
					<image class="cover" :src="goods.goodsImg" mode=""></image>
				</view>
				<view class="info-wrap">
					<view class="title">{{ goods.goodsName }}</view>
					<view class="sku">{{ goods.goodsSku }}</view>
					<view class="price">
						<text class="sign">￥</text>{{ goods.goodsPrice }}
					</view>
				</view>
			</view>
			<view class="comment">
				<textarea v-model.trim="comment" class="comment-textarea" maxlength="200" placeholder="✍说说你对该商品的评价" />
			</view>
		</view>
		
		<view class="image-upload">
			<view class="image-uploadList">
				<view v-for="(item,index) in imgArr" :key="index" style="position: relative;">
					<image src="../../static/delImg.png" class="image-del"  @click="delImg(index)"></image>
					<image :src="baseUrl+item">
				</view>
			</view>
			<view class="image-upload-placeholder">
				<image src="../../static/upload.png" @click="uploadImg" mode=""></image>
			</view>
		</view>
		
		
		<view class="submit-wrap">
			<button class="btn-submit" :disabled="!isSubmit" @click="submitComment">提交评论</button>
		</view>
		
	</view>
</template>

<script>
	// 按需导入 mapMutations 辅助函数
	import { mapState, mapMutations } from 'vuex'
	export default {
		computed: {
			// 将 m_user 模块中的 userinfo 映射到当前页面中使用
			...mapState('m_user', ['userinfo','token']),
		},
		data() {
			return {
				orderDetailId: null,
				goods: {
					goodsImg: '../../static/img-null.jpg',
					goodsName: '',
					goodsNum: 0,
					goodsPrice: 0,
				},
				comment: '', //评论内容
				imgArr: [],  //评论图片
				baseUrl: uni.$url.baseUrl,  //图片路径
				isSubmit: true, //防止多次提交
			}
		},
		onLoad(options) {
			
			this.orderDetailId = options.id;
			this.creatOrderCommentInfo(this.orderDetailId);
		},
		methods: {
			async creatOrderCommentInfo(id) {
				//发起评论商品信息请求
				const res = await uni.$http.get(uni.$url.creatOrderCommentInfo, {orderDetailId:id});
				
				if (res.data.code !== 0) return uni.$showMsg(res.data.msg,2000);
				
				let data = res.data.data;
				
				data.goodsImg = data.goodsImg !== null ? uni.$url.baseUrl + data.goodsImg : '../../static/img-null.jpg';
				data.goodsSku = data.goodsSku || '';
				
				this.goods = data;
				
			},
			uploadImg(){
				let that = this
				uni.chooseImage({
					success: (res) => {
						
						if(res.tempFiles.length > 4 || res.tempFiles.length + that.imgArr.length > 4) return uni.$showMsg("已超出4张图片",2000);
						
						const tempFilePaths = res.tempFilePaths;
						for(let i = 0;i < tempFilePaths.length; i++) {
							uni.uploadFile({
								url: uni.$url.upload, //仅为示例，非真实的接口地址
								filePath: tempFilePaths[i],
								name: 'file_data',
								header: {
									'X-Winzkj-Token': this.$store.state.m_user.token,
								},
								success: (uploadFileRes) => {
									let arr = JSON.parse(uploadFileRes.data)
									that.imgArr.push(arr.fileName);
								}
							});
						}
					}
				})
				
			},
			delImg(e){
				 this.imgArr.splice(e,1);
			},
			async submitComment() {
				if(!this.comment || !this.comment.length) return uni.$showMsg("评论不能为空",2000);
				
				console.log(this.imgArr);
				
				let query = {
					orderDetailId: this.orderDetailId,
					comment: this.comment,
					commentImgList: this.imgArr,
				};
				
				// 询问用户是否提交评论
				const [err, succ] = await uni.showModal({
					title: '是否确认提交评论',
					content: '是否确认提交评论？'
				}).catch(err => err)
				
				//确认则提交
				if (succ && !succ.confirm) return;
				
				//防止短时间内重复提交
				if(!this.isSubmit) return;
				
				this.isSubmit = false;
				
				const res = await uni.$http.post(uni.$url.addOrderComment, query);
	
				//防止短时间内重复提交
				//1.5秒后取消button禁用
				setTimeout(() => {
					this.isSubmit = true;
				},3500);
			
				
				if (res.data.code !== 0) return uni.$showMsg(res.data.msg,3500);
				uni.$showMsg(res.data.msg,3500);
				
				setTimeout(() => {					
					uni.navigateTo({
						url: '/pages/order/order'
					})
				}, 3500);
			}
		}
	}
</script>

<style lang="scss">
	
page {
	background: #f7f4f8;
}

.goods-comment {
	margin: 20rpx;
	padding: 40rpx 30rpx;
	background: #ffffff;
	border-radius: 20rpx;
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
	.comment {
		.comment-textarea {
			width: 100%;
			height: 150rpx;
		}
	}
}


.image-upload{
	display: flex;
	flex-direction:row;
	margin: 20rpx;
	padding: 40rpx 30rpx;
	background: #ffffff;
	border-radius: 20rpx;
	image{
		margin-right: 20rpx;
		width: 100rpx;
		height: 100rpx;
	}
	.image-upload-placeholder{
		width: 100rpx;
		height: 100rpx;
	}
	.image-uploadList{
		display: flex;
		flex-direction:row;
		.image-del{
			position: absolute;
			top:-10rpx;
			right: -10rpx;
			width: 28rpx;
			height: 28rpx;
			z-index: 999;
		}
	}
	
}
	
	
.submit-wrap {
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 100rpx;
	background: #ffffff;
	display: flex;
	justify-content: center;
	align-items: center;
	.btn-submit {
		display: inline-block;
		height: 60rpx;
		line-height: 60rpx;
		background: #FFFFFF;
		border: 1rpx solid #AAAAAA;
		border-radius: 30rpx;
		font-size: 28rpx;
		color: #666666;
	}
}
	
	
</style>
