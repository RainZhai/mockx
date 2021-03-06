var mongoose = require('mongoose')
var Category = mongoose.model('Category')
var util = require('../util/util')

// admin new page
exports.new = function(req, res) {
    res.render('category_admin', {
        title: '分类录入页',
        category: {},
        currentTitle: 'newcate'
    })
}

// admin post
exports.save = function(req, res) {
    var _category = req.body.category
    _category.name = util.filter(_category.name);
    var category = new Category(_category)

    category.save(function(err, category) {
        if (err) {
            console.log(err)
        }

        res.redirect('/admin/category/list')
    })
}

// catelist page
exports.list = function(req, res) {
    Category.fetch(function(err, catetories) {
        if (err) {
            console.log(err)
        }

        res.render('categorylist', {
            title: '分类列表页',
            catetories: catetories,
            currentTitle: 'catelist'
        })
    })
}