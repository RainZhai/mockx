var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')
    //var Comment = require('../app/controllers/comment')
var Category = require('../app/controllers/category')

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
    app.post('/user/signup', User.signup)
    app.post('/user/signin', User.signin)
    app.get('/signin', User.showSignin)
    app.get('/signup', User.showSignup)
    app.get('/logout', User.logout)
    app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list)

    // mock
    app.get('/mock/:id', Mock.detail)
    app.get('/admin/mock/new', User.signinRequired, User.adminRequired, Mock.new)
    app.get('/admin/mock/update/:id', User.signinRequired, User.adminRequired, Mock.update)
    app.post('/admin/mock', User.signinRequired, User.adminRequired, Mock.savePoster, Mock.save)
    app.get('/admin/mock/list', User.signinRequired, User.adminRequired, Mock.list)
    app.delete('/admin/mock/list', User.signinRequired, User.adminRequired, Mock.del)

    // Comment
    //app.post('/user/comment', User.signinRequired, Comment.save)

    // Category
    app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new)
    app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save)
    app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list)

    // results
    app.get('/results', Index.search)
}