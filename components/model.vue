<template>
    <view class="share">
        <view :class="{'share-box': shareState}" @click="handleHiddenShare"></view>
        <view class="share-item" :class="{'share-show': shareState}">
			<slot name="content"></slot>
        </view>
    </view>
</template>

<script>
    export default {
        props:{
			shareState: {
				type: Boolean,
				default: false,
			},
		},
        data() {
            return {
                modelState: this.shareState,
            };
        },
		watch:{
			shareState(e){
				this.modelState = e;
			}
		},
        methods: {
            // 隐藏分享
            handleHiddenShare () {
                this.modelState = false;
				this.$emit("state", this.modelState);
            }
        }
    }
</script>

<style lang="scss">
    .share {
        width: 100%;
        height: 100%;
		margin-top: 30px;
		border-radius: 30px 30px 0px 0px;
    }
    .share-box {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0rpx; left: 0rpx; bottom: 0rpx; right: 0rpx;
        background-color: rgba(0, 0, 0, 0.4);
        transition: .3s;
        z-index: 222;
    }
    // 进入分享动画
    .share-show {
        transition: all 0.3s ease;
        transform: translateY(0%) !important;
    }
    // 离开分享动画
    .share-item {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: auto;
        background-color: #FFFFFF;
        transition: all 0.3s ease;
        transform: translateY(100%);
        z-index: 333;
		border-radius: 15px 15px 0px 0px;
		padding: 5%;
        .share-to {
            width: 100%;
            height: 3rem;
            display: flex;
            justify-content: center;
            align-items: center;
            &::after {
                content: '';
                width: 240rpx;
                height: 0rpx;
                border-top: 1px solid #E4E7ED;
                -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
                margin-left: 30rpx;
            }
            &::before {
                content: '';
                width: 240rpx;
                height: 0rpx;
                border-top: 1px solid #E4E7ED;
                -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
                margin-right: 30rpx;
            }
        }
        .content {
            width: 100%;
            height: auto;
            display: flex;
            flex-wrap: wrap;
            .block{
                width: 33%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 180rpx;
                // image {
                //     width: 80rpx;
                //     height: 80rpx;
                // }
                // text {
                //     margin-top: 16rpx;
                //     font-size: 28rpx;
                //     color: #606266;
                // }
            }
        }
        .cancel {
            width: 100%;
            height: 3rem;
            display: flex;
            justify-content: center;
            align-items: center;
            border-top: 1rpx solid #E4E7ED;
        }
    }
</style>