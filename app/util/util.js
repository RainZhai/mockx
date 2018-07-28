/**
 * @method filter
 * @param {String}
 * @return {String} 返回已过滤特殊字符的字符串
 */
exports.filter = function(s) {
    var pattern = new RegExp("[`~!@#$^&*()=|;\\[\\].<>/?~！@#￥……&*（）&_;—|【】‘；：”“。，、？ % + ]");
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}