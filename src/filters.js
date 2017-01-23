import hostConfig from 'lib/hostConfig'
import defaultImg from 'assets/wode_touxiang.png';

exports.img = function(url) {
	if(typeof url === 'string') {
		if(url.indexOf('wx') > 0) return url;
		return `${hostConfig.imgHost}${url}`;
	}
}

exports.textOverflow = function(text, len) {
	var length = text.length;
	if(length <= len) {
		return text;
	}else {
		return text.substr(0, len) + '...';
	}
}
exports.defaultHeadImg = function(headImg) {
	if(headImg && headImg != 'undefined') {
		return `${hostConfig.imgHost}${headImg}`;
	}else {
		return defaultImg;
	}
}