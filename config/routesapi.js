var Index = require('../app/api/index')
var User = require('../app/api/user')
var Mock = require('../app/api/mock')
var Category = require('../app/api/category')

module.exports = function(app) {

    // pre handle user
    app.use(function(req, res, next) {
        var _user = req.session.user
        app.locals.user = _user
        next()
    })

    // Index
    app.get('/', Index.index)

    // User
    app.get('/user/signup', User.signup)
    app.get('/user/signin', User.signin)
    app.get('/signin', User.showSignin)
    app.get('/signup', User.showSignup)
    app.get('/logout', User.logout)
    app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list)

    // mock
    app.get('/mock/:id', Mock.detail)
    app.get('/mock/:categoryName/:name', Mock.jsonDetail)
    app.get('/admin/mock/new', User.signinRequired, User.adminRequired, Mock.new)
    app.get('/admin/mock/update/:id', User.signinRequired, User.adminRequired, Mock.update)
    app.get('/admin/mock', User.signinRequired, User.adminRequired, Mock.savePoster, Mock.save)
    app.get('/admin/mock/list', User.signinRequired, User.adminRequired, Mock.list)
    app.get('/admin/mock/del/:id', User.signinRequired, User.adminRequired, Mock.del)

    // Category
    app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new)
    app.get('/admin/category', User.signinRequired, User.adminRequired, Category.save)
    app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list)

    // results
    app.get('/results', Index.search)
}