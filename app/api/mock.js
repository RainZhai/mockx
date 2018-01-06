var mongoose = require('mongoose')
var Mock = mongoose.model('Mock')
var Category = mongoose.model('Category')
var _ = require('underscore')
var util = require('../util/util')
var fs = require('fs')
var path = require('path')

// detail page
exports.detail = function(req, res) {
    var id = req.params.id

    Mock.findById(id, function(err, mock) {
        res.jsonp({
            success: true,
            data: {
                title: 'mockx 详情',
                mock: mock
            }
        })
    })
}

// detailJson page
exports.jsonDetail = function(req, res) {
    var categoryName = req.params.categoryName
    var name = req.params.name

    Category.findOne({ "name": categoryName }, function(err, category) {
        Mock.findOne({ "category": category.id, "name": name }, function(err, mock) {
            res.jsonp(JSON.parse(mock.json))
        })
    })
}

// admin new page
exports.new = function(req, res) {
    Category.find({}, function(err, categories) {
        res.jsonp({
            success: true,
            data: {
                title: 'mockx 后台录入页',
                categories: categories,
                mock: {}
            }
        })
    })
}

// admin update page
exports.update = function(req, res) {
    var id = req.params.id

    if (id) {
        Mock.findById(id, function(err, mock) {
            mock.json = util.filter(mock.json).replace(/\'/g,'"')
            Category.find({}, function(err, categories) {
                res.jsonp({
                    success: true,
                    data: {
                        title: 'mockx 后台更新页',
                        mock: mock,
                        categories: categories
                    }
                })
            })
        })
    }
}

// admin poster
exports.savePoster = function(req, res, next) {
    next()
}

// admin post mock
exports.save = function(req, res) {
    var id = req.query.mock._id
    var mockObj = req.query.mock
    var _mock
    mockObj.name = util.filter(mockObj.name)
    mockObj.json = util.filter(mockObj.json).replace(/\'/g,'"')
    if (req.poster) {
        mockObj.poster = req.poster
    }

    if (id) {
        Mock.findById(id, function(err, mock) {
            if (err) {
                console.log(err)
                res.jsonp({ success: false })
            } else {
                _mock = _.extend(mock, mockObj)
                _mock.save(function(err, mock) {
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
        })
    } else {
        _mock = new Mock(mockObj)

        var categoryId = mockObj.category
        var categoryName = util.filter(mockObj.categoryName)

        _mock.save(function(err, mock) {
            if (err) {
                console.log(err)
            }
            if (categoryId) {
                Category.findById(categoryId, function(err, category) {
                    category.mocks.push(mock._id)

                    category.save(function(err, category) {
                        res.jsonp({
                            success: true,
                            msg: "保存成功"
                        })
                    })
                })
            } else if (categoryName) {
                var category = new Category({
                    name: categoryName,
                    mocks: [mock._id]
                })

                category.save(function(err, category) {
                    mock.category = category._id
                    mock.save(function(err, mock) {
                        res.jsonp({
                            success: true,
                            msg: "保存成功"
                        })
                    })
                })
            }
        })
    }
}

// list page
exports.list = function(req, res) {
    Mock.find({})
        .populate('category', 'name')
        .exec(function(err, mocks) {
            if (err) {
                console.log(err)
                res.jsonp({ success: false })
            } else {
                res.jsonp({
                    success: true,
                    data: {
                        title: 'mockx 列表页',
                        mocks: mocks
                    }
                })
            }
        })
}

// list page
exports.del = function(req, res) {
    var id = req.query.id

    if (id) {
        Mock.remove({ _id: id }, function(err, mock) {
            if (err) {
                console.log(err)
                res.jsonp({ success: 0 })
            } else {
                res.jsonp({ success: 1 })
            }
        })
    }
}