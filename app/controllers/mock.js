var mongoose = require('mongoose')
var Mock = mongoose.model('Mock')
var Category = mongoose.model('Category')
var util = require('../util/util')
var _ = require('underscore')
var fs = require('fs')
var path = require('path')

// detail page
exports.detail = function (req, res) {
    var id = req.params.id

    Mock.findById(id, function (err, mock) {
        res.render('detail', {
            title: 'mockx 详情页',
            mock: mock
        })
    })
}
// detailJson page
exports.jsonDetail = function (req, res) {
    var categoryName = req.params.categoryName
    var name = req.params.name

    Category.findOne({ "name": categoryName }, function (err, category) {
        Mock.findOne({ "category": category.id, "name": name }, function (err, mock) {
            //mock.json = JSON.parse(mock.json)
            if (mock.json) {
                console.log(mock.json)
                try {
                    res.json(JSON.parse(mock.json))
                } catch (e) {
                    res.render('error', {
                        title: '出错啦',
                        info: {
                            errorjson: "json格式不对哦"
                        }
                    })
                }
            } else {
                res.render('error', {
                    title: '出错啦',
                    info: {
                        errorjson: "json格式不对哦"
                    }
                })
            }
        })
    })
}

// admin new page
exports.new = function (req, res) {
    Category.find({}, function (err, categories) {
        res.render('admin', {
            title: 'mockx 后台录入页',
            categories: categories,
            mock: {}
        })
    })
}

// admin update page
exports.update = function (req, res) {
    var id = req.params.id

    if (id) {
        Mock.findById(id, function (err, mock) {
            mock.json = util.filter(mock.json).replace(/\'/g, '"')
            Category.find({}, function (err, categories) {
                res.render('admin', {
                    title: 'mockx 后台更新页',
                    mock: mock,
                    categories: categories
                })
            })
        })
    }
}

// admin poster
exports.savePoster = function (req, res, next) {
    next()
}

// admin post mock
exports.save = function (req, res) {
    var id = req.body.mock._id
    var mockObj = req.body.mock
    var _mock;
    mockObj.name = util.filter(mockObj.name)
    mockObj.json = util.filter(mockObj.json).replace(/\'/g, '"')

    if (req.poster) {
        mockObj.poster = req.poster
    }

    if (id) {
        Mock.findById(id, function (err, mock) {
            if (err) {
                console.log(err)
            }

            _mock = _.extend(mock, mockObj)
            _mock.save(function (err, mock) {
                if (err) {
                    console.log(err)
                }

                res.redirect('/mock/' + mock._id)
            })
        })
    } else {
        _mock = new Mock(mockObj)

        var categoryId = mockObj.category
        var categoryName = mockObj.categoryName

        _mock.save(function (err, mock) {
            if (err) {
                console.log(err)
            }
            if (categoryId) {
                Category.findById(categoryId, function (err, category) {
                    category.mocks.push(mock._id)

                    category.save(function (err, category) {
                        res.redirect('/mock/' + mock._id)
                    })
                })
            } else if (categoryName) {
                var category = new Category({
                    name: util.filter(categoryName),
                    mocks: [mock._id]
                })

                category.save(function (err, category) {
                    mock.category = category._id
                    mock.save(function (err, mock) {
                        res.redirect('/mock/' + mock._id)
                    })
                })
            }
        })
    }
}
//admin list page
exports.adminlist = function (req, res) {
    var q = req.query.q
    var page = parseInt(req.query.p, 10) || 0
    var count = 10
    var index = page * count
    Mock.find({})
        .populate('category', 'name')
        .exec(function (err, mocks) {
            if (err) {
                console.log(err)
            }

            var results = mocks.slice(index, index + count)
            console.log(results.length)
            res.render('list', {
                admin: true,
                title: 'mockx 列表页',
                currentPage: (page + 1),
                totalPage: Math.ceil(mocks.length / count),
                mocks: results
            })
        })
}
// list page
exports.list = function (req, res) {
    var q = req.query.q
    var page = parseInt(req.query.p, 10) || 0
    var count = 10
    var index = page * count
    Mock.find({})
        .populate('category', 'name')
        .exec(function (err, mocks) {
            if (err) {
                console.log(err)
            }

            var results = mocks.slice(index, index + count)
            console.log(results.length)
            res.render('list', {
                admin: false,
                title: 'mockx 列表页',
                currentPage: (page + 1),
                totalPage: Math.ceil(mocks.length / count),
                mocks: results
            })
        })
}

// list page
exports.del = function (req, res) {
    var id = req.query.id

    if (id) {
        Mock.remove({ _id: id }, function (err, mock) {
            if (err) {
                console.log(err)
                res.json({ success: 0 })
            } else {
                res.json({ success: 1 })
            }
        })
    }
}