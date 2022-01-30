let listCount = 24;
const loadingTime = 500;
const showLog = false;
/* 这个js仅用于在demo中模拟网络请求，请勿导入或修改此文件 */
async function queryList(data, callback) {
	if (!data.pageNo || !data.pageSize) {
		return callQueryResult([]);
	}
	let pageNo = parseInt(data.pageNo);
	let pageSize = parseInt(data.pageSize);
	let type = data.type || 0;
	if (pageNo < 0 || pageSize <= 0) {
		return callQueryResult([]);
	}
	if (showLog) {
		console.log('%c\n----------请求开始--------', 'color:green;');
		console.info(`请求参数：【pageNo:${pageNo},pageSize:${pageSize}】`)
		console.log('%c----------请求结束--------\n', 'color:green;');
	}
	uni.showLoading({
		title: '加载中...'
	})
	if (pageNo == 0) {
		pageNo = 1;
	}
	// var totalPagingList = [];
	// for (let i = 0; i < listCount; i++) {
	// 	var item = {
	// 		'title': (i + 1).toString(),
	// 		'detail': '测试信息' + type
	// 	};
	// 	totalPagingList.push(item);
	// }
	
	const res = await uni.$http.post(uni.$url.getInfoList,{infoCategoryId: 1});
	
	if (res.data.code !== 0) return uni.$showMsg(res.data.msg);
	
	let totalPagingList = res.data.data.tatal;
	
	
	let pageNoIndex = (pageNo - 1) * pageSize;
	if (pageNoIndex + pageSize <= totalPagingList) {
		// return callQueryResult(totalPagingList.splice(pageNoIndex, pageSize));
		return callQueryResult(type);
	} else if (pageNoIndex < totalPagingList) {
		// return callQueryResult(totalPagingList.splice(pageNoIndex, totalPagingList.length - pageNoIndex));
		return callQueryResult(type);
	} else {
		return callQueryResult([]);
	}
}

async function callQueryResult(type) {
	
	return new Promise((resolve, reject) => {
		
		uni.request({
			url: uni.$url.getInfoList,
			method: 'POST',
			data: {infoCategoryId: type},
			success: (res)=>{
				if(res== 0) {
					return uni.showToast({
						title: '获取数据失败'
					})
				}
				resolve({
					data: {
						list: res.data.rows
					}
				})
			},
			fail: (err)=>{
				uni.showToast({
					title: '请求接口失败'
				})
				reject(err)
			}
		})
	
	})
	
	
	// return new Promise((resolve, reject) => {
	// 	setTimeout(() => {
	// 		uni.hideLoading();
	// 		if (showLog) {
	// 			console.log('%c\n----------响应开始--------', 'color:#0113fa;');
	// 			// #ifdef H5
	// 			console.table(arg);
	// 			// #endif

	// 			// #ifndef H5
	// 			console.log(arg);
	// 			// #endif
	// 			console.log('%c----------响应结束--------\n', 'color:#0113fa;');
	// 		}
	// 		resolve({
	// 			data: {
	// 				list: arg
	// 			}
	// 		});
	// 	}, loadingTime)
	// })

}

function queryListLong(data, callback) {
	listCount = 224;
	return this.queryList(data, callback);
}

module.exports = {
	queryList,
	queryListLong
}
