var mongoose = require('mongoose')
var Mock = mongoose.model('Mock')
var Category = mongoose.model('Category')

// index page
exports.index = function(req, res) {
    Category
        .find({})
        .populate({
            path: 'mocks',
            select: 'title poster',
            options: { limit: 6 }
        })
        .exec(function(err, categories) {
            if (err) {
                console.log(err)
                res.json({ success: false })
            } else {
                res.json({
                    success: true,
                    data: {
                        categories: categories
                    }
                })
            }
        })
}

// search page
exports.search = function(req, res) {
    var catId = req.query.cat
    var q = req.query.q
    var page = parseInt(req.query.p, 10) || 0
    var count = 2
    var index = page * count

    if (catId) {
        Category
            .find({ _id: catId })
            .populate({
                path: 'mocks',
                select: 'name poster'
            })
            .exec(function(err, categories) {
                if (err) {
                    console.log(err)
                    res.json({ success: false })
                } else {
                    var category = categories[0] || {}
                    var mocks = category.mocks || []
                    var results = mocks.slice(index, index + count)

                    console.log("mocks111--" + mocks)
                    res.json({
                        success: true,
                        data: {
                            title: '结果列表页面',
                            keyword: category.name,
                            currentPage: (page + 1),
                            query: 'cat=' + catId,
                            totalPage: Math.ceil(mocks.length / count),
                            mocks: results
                        }
                    })
                }
            })
    } else {
        Mock
            .find({ name: new RegExp(q + '.*', 'i') })
            .exec(function(err, mocks) {
                if (err) {
                    console.log(err)
                    res.json({ success: false })
                } else {
                    var results = mocks.slice(index, index + count)
                    console.log("mocks222--" + mocks)
                    res.json({
                        success: true,
                        data: {
                            title: '结果列表页面',
                            keyword: q,
                            currentPage: (page + 1),
                            query: 'q=' + q,
                            totalPage: Math.ceil(mocks.length / count),
                            mocks: results
                        }
                    })
                }
            })
    }
}