import store from 'vx/store'
import host from 'lib/hostConfig'
import Promise from 'promise'
import locache from 'lib/locache.js'
let queryString  = require("querystring");
const loading = {
	show() {
		store.dispatch('LOADING', true);
	},
	hide() {
		store.dispatch('LOADING', false);
	}
}
const mask = {
	show() {
		store.dispatch('MASK', true);
	},
	hide() {
		store.dispatch('MASK', false);
	}
}
const toast = {
	show(msg) {
		store.dispatch('TOAST', msg);
	}
}

const http = {
	Vue: null,
	querystring(param) {
		return param ? ('?' + queryString.stringify(param)) : '';
	},
	getData(url, param) {
		loading.show();
		let data = this.querystring(param);

	    return new Promise((resolve, reject) => {
	        this.Vue.http.get(`${host.httpHost}${url}${data}`)
	        .then((res) => {
	            let body = res.body;
	            if((body.code == 1)) {
	            	resolve(body.data)
	            }else {
	            	toast.show(body.msg);
	            	reject();
	            }
	            loading.hide();
	        })
	        .catch(() => {
	            this.error('请求失败');
	        })
	    });
	},
	loadMore(vm, url, param) {
			if(vm.loadMoreEnd) return;
			vm.loadMoreBusy = true;

			let data = this.querystring(param);

		    return new Promise((resolve) => {
		        this.Vue.http.get(`${host.httpHost}${url}${data}`)
		        .then((res) => {
		            let body = res.body;
		            if(body.code == 1) {
		            	if(body.data.length) {
		            		vm.page = Number(body.page);
		            		resolve(body.data);
		            	}else {
		            		vm.loadMoreEnd = true
		            	}
		            }else {
		            	toast.show(body.msg);
		            }
		            vm.loadMoreBusy = false;
		        })
		        .catch(() => {
		        	this.error('请求失败');
		        	vm.loadMoreBusy = false;
		        })
		    });
	},
	getUserInfo() {
		loading.show();
		return new Promise((resolve, reject) => {
			let data = this.querystring({
				userId: locache.get('STuserInfo')
			});

	        this.Vue.http.get(`${host.httpHost}user/getUserInfo${data}`)
	        .then((res) => {
	            let body = res.body;
	            if(body.code == 1) {
	            	store.dispatch('SETUSERINFO', body.data);
	            	resolve(body.data);
	            }else {
	            	lazyroute.router.replace('/login');
	            	loading.hide();
	            }
	        })
	        .catch(() => {
	            this.error('获取用户信息失败');
	        })
	    });
	},
	handle(url, param) {
		loading.show();
		return new Promise((resolve) => {
		    this.Vue.http.post(`${host.httpHost}${url}`, param || {})
		    .then((res) => {
		        let body = res.body;
		        (body.code == 1) ? resolve(body.data) : toast.show(body.msg);
		        loading.hide();
		    })
		    .catch(() => {
		        this.error('请求失败');
		    })
		});
	},
	error(msg) {
		loading.hide();
		toast.show(msg);
	}
}
const lazyroute = {
	router: null,
	go(url) {
		setTimeout(() => {
		    this.router.go(url);
		}, 1000);
	},
	replace(url) {
		setTimeout(() => {
		    this.router.replace(url);
		}, 1000);
	}
}
export default {
	install(Vue, router) {
		lazyroute.router = router;
		http.Vue = Vue;
		Vue.prototype.$toast = toast;
		Vue.prototype.$loading = loading;
		Vue.prototype.$mask = mask;
		Vue.prototype.$xhr = http;
		Vue.prototype.$lazyroute = lazyroute;
		Vue.prototype.$host = host;
	}
}