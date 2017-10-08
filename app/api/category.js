var mongoose = require('mongoose')
var Category = mongoose.model('Category')

// admin new page
exports.new = function(req, res) {
    res.render('category_admin', {
        title: '分类录入页',
        category: {}
    })
}

// admin post
exports.save = function(req, res) {
    var _category = req.body.category
    var category = new Category(_category)

    category.save(function(err, category) {
        if (err) {
            console.log(err)
            res.json({ success: false })
        } else {
            res.json({
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
            res.json({ success: false })
        } else {
            res.json({
                success: true,
                data: {
                    catetories: catetories
                }
            })
        }
    })
}