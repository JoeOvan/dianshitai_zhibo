let BASE_URL = 'http://adv.winzkj.com';

let API_URL = {
	baseUrl: BASE_URL,
	//直播列表
	getLiveRoomList: BASE_URL + "/api/live/getLiveRoomList",
	//直播详情
	getLiveRoomById: BASE_URL + "/api/live/getLiveRoomById",
	//保存报道评论
	saveComment: BASE_URL + "/api/live/saveComment",
	//商品分类
	goodsCategoryUrl: BASE_URL + "/api/index/channel",
	//商品列表
	goodsCategoryListUrl: BASE_URL + "/api/goods/getCategoryList",
	//获取购物车
	getCartUrl: BASE_URL + "/api/cart/queryCartList",
	//添加商品到购物车
	addBySkuUrl: BASE_URL + "/api/cart/addGoodsToCart",
	//删除购物车商品
	delAllCart: BASE_URL + "/api/cart/deleteCart?ids=",
	//减少购物车数量
	delCart: BASE_URL + "/api/cart/subCartNumber?cartId=",
	//增加购物车数量
	addCart: BASE_URL + "/api/cart/addCartNumber?cartId=",
	//取消选中购物车
	cancelChecked: BASE_URL + "/api/cart/cancelChecked?cartId=",
	//选中购物车
	confirmChecked: BASE_URL + "/api/cart/confirmChecked?cartId=",
	//购物车结算
	settlement: BASE_URL + "/api/order/settlement",
	//根据ID获取商家
	getBrandDetail: BASE_URL + "/api/brand/detail/",
	//根据ID获取商家分类商品
	getCategoryGoods: BASE_URL + "/api/goods/categoryGoods?brandId=",
	//根据ID获取商品规格
	getSkuUrl: BASE_URL + "/api/goods/getSku",
	//根据ID获取商品详情
	getGoodsById: BASE_URL + "/api/goods/getGoodsById?goodsId=",
	//获取用户地址列表
	getAddressList: BASE_URL + "/api/address/queryAddressList",
	//获取用户地址详情（修改地址）
	getAddressDetail: BASE_URL + "/api/address/detail",
	//获取搜索列表
	getSearch: BASE_URL + "/api/solr/solrList",
	//获取提交订单详情
	getCheckoutDetail: BASE_URL + "/api/cart/checkout",
	//保存地址
	saveAddress: BASE_URL + "/api/address/saveAddress",
	//删除地址
	deleteAddress: BASE_URL + "/api/address/deleteAddress",
	//获取地址（编辑地址）
	editAddress: BASE_URL + "/api/address/getAddressById?addressId=",
	//修改地址（编辑地址）
	setAddress: BASE_URL + "/api/address/updateAddress",
	//设置默认地址
	setDefault: BASE_URL + "/api/address/setDefaultAddress",
	//个人中心-订单列表
	orderList: BASE_URL + "/api/order/getOrderList",
	//提交订单（直播间）
	transFormOrder: BASE_URL + "/api/order/transFormOrder",
	//提交订单
	orderSubmit: BASE_URL + "/api/order/submitOrder",
	//订单支付
	orderPay: BASE_URL + "/api/pay/preOrder",
	//订单详情
	orderDetail: BASE_URL + "/api/order/getOrder",
	//订单模拟支付
	orderPayNotify: BASE_URL + "/api/pay/notify",
	//订单取消
	setDefaultAddress: BASE_URL + "/api/address/setDefault",
	//重新支付
	orderRePay: BASE_URL + "/api/pay/rePay",
	//文章详情
	articleDetails: BASE_URL + "/api/index/getAppReadDetails",
	//获取直播间直播任务
	getRecommendGoodsById: BASE_URL + "/api/live/getRecommendGoodsById",
	//直播间点赞
	thumbTrue: BASE_URL + "/api/live/thumbTrue",
	//取消直播间点赞
	thumbFalse: BASE_URL + "/api/live/thumbFalse",
	//关于我们
	aboutUs: BASE_URL + "/api/index/aboutUs",
	//申请退款
	refundApply: BASE_URL + "/api/refund/refundApply",
	//商城直接购买
	simpleSubmitOrder: BASE_URL + "/api/order/simpleSubmitOrder",
	//图片上传
	upload: BASE_URL + "/api/file/upload",
	//确认收货
	confirmReceipt: BASE_URL + "/api/order/confirmReceipt",
	//取消订单
	cancelOrder: BASE_URL + "/api/order/cancelOrder",
	//删除订单
	deleteOrder: BASE_URL + "/api/order/deleteOrder",
	//撤销订单退款申请
	cancelRefundApply: BASE_URL + "/api/refund/cancelRefundApply",
	//撤销订单退款申请
	refundInfo: BASE_URL + "/api/refund/refundInfo",
	//获取资讯分类列表
	getInfoCategoryList: BASE_URL + "/api/info/getInfoCategoryList",
	//根据资讯分类的id获取资讯列表
	getInfoList: BASE_URL + "/api/info/getInfoList",
	//获取banner图片
	getBannerImg: BASE_URL + "/api/banner/getBannerImg",
	//根据资讯id获取资讯详情
	getInfoById: BASE_URL + "/api/info/getInfoById",
	//创建订单详情评论对象
	creatOrderCommentInfo: BASE_URL + "/api/goodsComment/creatOrderCommentInfo",
	//提交评论
	addOrderComment: BASE_URL + "/api/goodsComment/addOrderComment",
	//保存资讯评论
	saveNewsComment: BASE_URL + "/api/info/saveComment",
	//分页查询商品评论
	getMyGoodsComment: BASE_URL + "/api/goodsComment/getMyGoodsComment",
	//分页查询我的资讯评论
	getInfoCommentListByUser: BASE_URL + "/api/info/getInfoCommentListByUser",
	//分页查询我的报道评论
	getReportCommentListByUser: BASE_URL + "/api/live/getReportCommentListByUser",
	//报道历史
	getReportById: BASE_URL + "/api/live/getReportById",
	//报道历史
	authToken: BASE_URL + "/api/index/authToken",
	//根据订单id查询发票
	getInvoice: BASE_URL + "/api/invoice/getInvoice",
	//申请发票
	saveInvoice: BASE_URL + "/api/invoice/save",
	//查询合并支付订单
	getOrderListByPaySn: BASE_URL + "/api/order/getOrderListByPaySn",
	//单一支付下单
	preOrderSingle: BASE_URL + "/api/pay/preOrderSingle",
	
		
	//登录
	wxLoginUrl: BASE_URL + "/api/wxLogin/",
	
};

export {
	API_URL
};
