var mongoose = require('mongoose')
var Mock = mongoose.model('Mock')
var Category = mongoose.model('Category')
var _ = require('underscore')
var fs = require('fs')
var path = require('path')

// detail page
exports.detail = function(req, res) {
    var id = req.params.id

    Mock.findById(id, function(err, movie) {
        Comment
            .find({ movie: id })
            .populate('from', 'name')
            .populate('reply.from reply.to', 'name')
            .exec(function(err, comments) {
                res.render('detail', {
                    title: 'mockx 详情页',
                    movie: movie
                })
            })
    })
}

// admin new page
exports.new = function(req, res) {
    Category.find({}, function(err, categories) {
        res.render('admin', {
            title: 'mockx 后台录入页',
            categories: categories,
            movie: {}
        })
    })
}

// admin update page
exports.update = function(req, res) {
    var id = req.params.id

    if (id) {
        Mock.findById(id, function(err, mock) {
            Category.find({}, function(err, categories) {
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
exports.savePoster = function(req, res, next) {
    var posterData = req.files.uploadPoster
    var filePath = posterData.path
    var originalFilename = posterData.originalFilename

    if (originalFilename) {
        fs.readFile(filePath, function(err, data) {
            var timestamp = Date.now()
            var type = posterData.type.split('/')[1]
            var poster = timestamp + '.' + type
            var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)

            fs.writeFile(newPath, data, function(err) {
                req.poster = poster
                next()
            })
        })
    } else {
        next()
    }
}

// admin post movie
exports.save = function(req, res) {
    var id = req.body.mock._id
    var mockObj = req.body.mock
    var _mock

    if (req.poster) {
        mockObj.poster = req.poster
    }

    if (id) {
        Mock.findById(id, function(err, mock) {
            if (err) {
                console.log(err)
            }

            _mock = _.extend(mock, mockObj)
            _mock.save(function(err, mock) {
                if (err) {
                    console.log(err)
                }

                res.redirect('/mock/' + movie._id)
            })
        })
    } else {
        _mock = new Mock(mockObj)

        var categoryId = mockObj.category
        var categoryName = mockObj.categoryName

        _mock.save(function(err, mock) {
            if (err) {
                console.log(err)
            }
            if (categoryId) {
                Category.findById(categoryId, function(err, category) {
                    category.mocks.push(mock._id)

                    category.save(function(err, category) {
                        res.redirect('/mock/' + mock._id)
                    })
                })
            } else if (categoryName) {
                var category = new Category({
                    name: categoryName,
                    mocks: [mock._id]
                })

                category.save(function(err, category) {
                    mock.category = category._id
                    mock.save(function(err, movie) {
                        res.redirect('/mock/' + mock._id)
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
            }

            res.render('list', {
                title: 'mockx 列表页',
                mocks: mocks
            })
        })
}

// list page
exports.del = function(req, res) {
    var id = req.query.id

    if (id) {
        Mock.remove({ _id: id }, function(err, movie) {
            if (err) {
                console.log(err)
                res.json({ success: 0 })
            } else {
                res.json({ success: 1 })
            }
        })
    }
}