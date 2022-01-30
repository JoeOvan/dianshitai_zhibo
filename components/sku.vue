<template>
    <model :shareState="open" @state="state" >
    	<block slot="content">
    		<view class="goods">
    			<view class="goods-info">
    				<view class="goods-img">
    					<fr-image class="cover" :src="goods.thumbImgUrl" mode="aspectFill" />
    				</view>
    				<view class="goods-title">
    					<view class="goods-text">{{goods.name}}</view>
    					<view class="goods-price">￥{{goods.minPrice}}</view>
    					<view class="goods-num">数量：{{goods.stock}}</view>
    				</view>
    			</view>
    			<view class="size-content">
    				<block v-for="(item,index) in specList" :key="index">
    			
    					<view class="size-item-wrap">
    						<view class="lebal">{{item.key}}</view>
    						<view class="size-item">
    							<block v-for="(item1,index1) in item.value" :key="index1">
    								<text :class="['item-label', item.checked == index1 ? 'active' : '']" @click="chooseSku(index,index1)">{{item1}}</text>
    							</block>
    						</view>
    					</view>
    				</block>
    			</view>
    			<view class="goods-cart-num">
    				<view class="goods-cart-title">购买数量</view>
    				<view class="goods-cart-sum">
    					<view class="subtract" @click="reduce">
    						<image class="icon-subtract" src="../static/-.png"></image>
    					</view>
    					<view class="num">{{goodsNum}}</view>
    					<view class="add" @click="add">
    						<image class="icon-add" src="../static/+.png"></image>
    					</view>
    				</view>
    			</view>
    			
    			<view class="goods-money">
    				<view class="goods-money-num">￥{{price}}</view>
					<block v-if="stopBuy==false">
						<view class="goods-btn">
							<view class="goods-money-cart" @click="addGoodsCarts" v-if="isLive==false">加入购物车</view>
							<view class="goods-money-button"  @click="toOrderSnb">立即购买</view>
						</view>
					</block>
    				<block v-else>
						<view class="goods-btn">
							<view class="goods-money-cart no-goods" v-if="isLive==false">加入购物车</view>
							<view class="goods-money-button no-goods">立即购买</view>
						</view>
					</block>
    			</view>
    		</view>
    	</block>
    </model>
</template>

<script>
	import FrImage from '@/components/fr-image/fr-image.vue'
	import model from '@/components/model.vue'
    export default {
        props:{
			open: {
				id: Boolean,
				default: false,
			},
			isLive: {
				id: Boolean,
				default: false,
			},
			goodsId: {
				id: String,
				default: 0,
			},
			liveRoomId: {
				type: [String, Number],
				default: 0,
			},
			anchorId: {
				type: [String, Number],
				default: 0,
			},
		},
		components: {FrImage,model},
        data() {
            return {
				openModal:this.open,
				setLive:this.isLive,
				gid:this.goodsId,
				skuId:0,
				baseUrl: uni.$url.baseUrl,
				goodsSpecification:"",
				skuList:[],
				specList:[],
				goodsNum:1,
				numPrice:0,
				price:0,
				setLiveRight:20,
				stopBuy:false,
				goods:{
					name:"",
					minPrice:"",
					stock:0,
					thumbImgUrl:"",
				}
            };
        },
		watch:{
			open(e){
				this.openModal = e;
			},
			goodsId(e){
				this.gid = e;
				this.getGoods();
			}
		},
        methods: {
			//组件控制
			state(e){
				this.openModal=e;
				this.$emit("state", this.openModal);
			},
			async toOrderSnb(){
				let query = {
					goodsId:this.gid,
					skuId:this.skuId,
					number:this.goodsNum,
					orderSourceType: this.isLive == true ? 1 : 2,
					liveRoomId: this.isLive == true ? this.liveRoomId : '',
					anchorId: this.isLive == true ? this.anchorId : ''
				}
				const res = await uni.$http.post(uni.$url.transFormOrder,query);
				
				if(res.data.code == 401) return this.$emit('openLoginModal');
				
				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
				
				if(this.isLive) {					
					uni.navigateTo({
						url: '../order/liveOrder-submit?type=1&goodsId='+this.gid+'&skuId='+this.skuId+'&number='+this.goodsNum+'&liveRoomId='+this.liveRoomId+'&anchorId='+this.anchorId//实际路径要写全
					})
				} else {
					
					uni.navigateTo({
						url: '../order/liveOrder-submit?type=2&goodsId='+this.gid+'&skuId='+this.skuId+'&number='+this.goodsNum+'&liveRoomId='+this.liveRoomId+'&anchorId='+this.anchorId //实际路径要写全
					})
					
				}
				
				
			},
			//添加购物车
			async addGoodsCarts(){
				// 发起请求
				const res = await uni.$http.get(uni.$url.addBySkuUrl+"?goodsId="+this.gid+"&skuId="+this.skuId+"&number="+this.goodsNum,{});
				
				if(res.data.code == 401) return this.$emit('openLoginModal');

				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
				
				this.$emit("skuGoodsNum", this.goodsNum);
				
				uni.showToast({
					title: '成功加入购物车',
					icon: 'success'
				})
			},
			//获取商品规格数据
			async getGoods(){
				if(this.setLive==true){
					this.setLiveRight=0;
				}
				
				// 发起请求
				const res = await uni.$http.get(uni.$url.getGoodsById,{goodsId:this.gid});
							
				if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
				
				this.skuList = res.data.data.skuList;
				this.specList = res.data.data.specList;
				this.goods.name = res.data.data.name;
				this.goods.thumbImgUrl = this.baseUrl + res.data.data.thumbImgUrl;
				this.goods.minPrice = res.data.data.minPrice;
				if(this.specList.length>0){
					for(let i=0;i<this.specList.length;i++){
						this.specList[i].value = this.specList[i].value.split(",");
						this.specList[i]['checked'] = 0;
					}
					this.chooseSku(0,0);
				}
			},
			//规格选择统计价格
			chooseSku(index,index1) {
				this.specList[index]['checked'] = index1;
				this.$forceUpdate();
				
				//第一项规格+第二项规格..如此类推
				let count = this.specList.length;
				
				//双重循环拼接规格
				let arr = [];
				for (let i = 0; i < count; i++) {
					let subCount = this.specList[i]['value'].length;
					for(let j = 0; j < subCount; j++) {
						if(this.specList[i]['checked'] == j) {
							arr.push(this.specList[i]['value'][j])
						}
					}
				}
				
				//将数组拼接为字符串
				this.goodsSpecification = arr.join("_");
				
				//统计选中规格后的商品价格
				for(let i=0; i < this.skuList.length; i++){
					let checkdPrice = 0
					if(this.skuList[i]["name"]==this.goodsSpecification){
						this.numPrice = this.skuList[i]["price"];
						this.goods.stock = this.skuList[i]["stock"];
						this.skuId = this.skuList[i]["skuId"];
						this.goods.minPrice = this.skuList[i]["price"];
						this.goodsNum=1;
						this.sumGoodsPrice()
						 
						//判断是否库存不足
						if(this.goods.stock==0){
							this.stopBuy=true;
						}else{
							this.stopBuy=false;
						}
					}
				}
			},
			//统计价格总和
			sumGoodsPrice(){
				this.price = this.accMul(this.goodsNum,this.numPrice);
			},
			//商品规格数量增加
			add(){
				this.goodsNum++;
				this.sumGoodsPrice();
			},
			//商品规格数量减少
			reduce(){
				if(this.goodsNum==1) return false;
				this.goodsNum--;
				this.sumGoodsPrice();
			},
			//乘法浮点运算
			accMul(arg1,arg2){
				var m = 0;
				var s1 = arg1.toString();
				var s2 = arg2.toString();
				try {
					m += s1.split(".")[1].length;
				} catch (e) {}
				try {
					m += s2.split(".")[1].length;
				} catch (e) {}
			 
				return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
			},
        }
    }
</script>

<style lang="scss">
    //选规格模态框
    .goods{
    	border-radius: 30px 30px 0px 0px;
    	.goods-info{
    		flex-direction: row;
    		display: flex;
			margin-bottom: 50rpx;
    		.goods-img{
    			width: 200rpx;
    			height: 200rpx;
				.cover{
					width: 200rpx;
					height: 200rpx;
					border-radius:0
				}
    			
    		}
    		.goods-title{
    			margin-left: 2%;
    			.goods-text{
    				color: #000;
    				font-size: 17px;
    				overflow:hidden;
    				display: -webkit-box;
    				 -webkit-line-clamp: 1;
    				height: 66px;
    				font-weight: 400;
    			}
    			.goods-price{
    				font-size: 15px;
    				color: #FF2222;
    				font-weight: bold;
    			}
    			.goods-num{
    				color: #666666;
    				font-size: 12px;
    			}
    		}
    	}
    	
    	.size-item-wrap {
    		text-align: left;
    		.lebal {
    			font-size: 28rpx;
    			color: #000;
    			margin-bottom: 20rpx;
    		}
    	
    		.size-item {
				flex-direction:row;
    			.item-label {
    				display: inline-block;
    				width: 160rpx;
    				height: 50rpx;
    				line-height: 50rpx;
    				// padding: 0 50rpx;
    				margin: 0 30rpx 40rpx 0;
    				font-size: 28rpx;
    				border: 1rpx solid #E0E0E0;
    				border-radius: 10rpx;
    				text-align: center;
    	
    				&.active {
    					color: $custom-theme-color;
    					border: 1rpx solid $custom-theme-color;
    				}
    			}
    		}
    	}
    	.goods-cart-num{
    		flex-direction: row;
    		display: flex;
    		border-bottom: #DDDDDD 1px solid;
    		border-top: #DDDDDD 1px solid;
    		height: 45px;
    		line-height: 45px;
    		margin-bottom: 20px;
    		position: relative;
    		.goods-cart-sum{
    			position: absolute;
    			right: 0;
    			flex-direction: row;
    			.subtract {
    				display: inline-block;
    				width: 50rpx;
    				height: 50rpx;
    			
    				.icon-subtract {
    					display: inline-block;
    					width: 50rpx;
    					height: 50rpx;
						position: absolute;
						top: 10px;
    				}
    			}
    			
    			.add {
    				display: inline-block;
    				width: 50rpx;
    				height: 50rpx;
    			
    				.icon-add {
    					display: inline-block;
    					width: 50rpx;
    					height: 50rpx;
						position: absolute;
						top: 10px;
    				}
    			}
    			
    			.num {
    				display: inline-block;
    				margin: 0 28rpx;
    			}
    		}
    	}
    	
    }
    .goods-money{
    	flex-direction: row;
    	display: flex;
    	font-size: 14px;
    	margin-bottom: 10px;
    	bottom: 0px;
    	width: 100%;
    	background: #fff;
    	.goods-money-num{
    		font-weight: bold;
    		color: #FF2222;
    		font-size:20px;
    		width: 280rpx;
    	}
    	.goods-btn{
    		display: flex;
    		flex-direction: row;
    		position: absolute;
    		right: 0;
    		.goods-money-button{
    			font-weight: 400;
    			color: #FFFFFF;
    			height: 30px;
    			line-height: 30px;
    			padding: 0 15px;
    			background: linear-gradient(0deg, #030000 0%, #FF0054 0%, #FFA14D 100%);
    			border-radius: 15px;
    		}
    		.goods-money-cart{
    			font-weight: 400;
    			color: #FF2222;
    			height: 30px;
    			line-height: 30px;
    			padding: 0 10px;
    			border-radius: 15px;
    			border: 1px solid #FF2222;
    			
    		}
			.no-goods{
				border: 1px solid #ebebeb;
				color: #ccc;
				background: #f7f7f7;
			}
    	}
    	
    }
</style>