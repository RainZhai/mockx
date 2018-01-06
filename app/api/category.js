var mongoose = require('mongoose')
var Category = mongoose.model('Category')
var util = require('../util/util')

// admin new page
exports.new = function(req, res) {
    res.render('category_admin', {
        title: '分类录入页',
        category: {}
    })
}

// admin post
exports.save = function(req, res) {
    var _category = req.query.category
    _category.name = util.filter(_category.name);
    var category = new Category(_category)

    category.save(function(err, category) {
        if (err) {
            console.log(err)
            res.jsonp({ success: false })
        } else {
            res.jsonp({
                success: true,
                msg: "保存成功"
            })
        }
    })
}

// catelist page
exports.list = function(req, res) {
    Category.fetch(function(err, catetories) {
        if (err) {
            console.log(err)
            res.jsonp({ success: false })
        } else {
            res.jsonp({
                success: true,
                data: {
                    catetories: catetories
                }
            })
        }
    })
}