import request from "superagent";

function requestApi(url, options, callback){
	request
		.get("/api/device/1")
		.end((err, res)=>{
			callback(res.body)
		})
}

let api = {
	getDevice: (options, callback) => {
		request
			.get("/api/device/1")
			.end((err, res)=>{
				callback(res.body)
			})
	},
	getGoodsBasic: (options, callback) => {
		request
			.get("/api/cinema/1/goods?filter=basic")
			.end((err, res)=>{
				callback(res.body)
			})
	},
	getGoodsFavor: (options, callback) => {
		let id = options.id;
		request
			.get('api/goods/'+ id +'/favor')
			.end((err, res)=>{
				callback(res.body)
			})
	}
}


export default api;