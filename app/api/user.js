var mongoose = require('mongoose')
var User = mongoose.model('User')

// signup
exports.showSignup = function (req, res) {
    res.render('signup', {title: '注册页面'})
}

exports.showSignin = function (req, res) {
    res.render('signin', {title: '登录页面'})
}

exports.signup = function (req, res) {
    var _user = req.query.user
    console.log(req);
    User.findOne({
        name: _user.name
    }, function (err, user) {
        if (err) {
            console.log(err)
            res.jsonp({success: false})
        } else {
            if (user) {
                res.jsonp({success: true, msg: "已经注册"})
            } else {
                user = new User(_user)
                user.save(function (err, user) {
                    if (err) {
                        console.log(err)
                        res.jsonp({success: false})
                    } else {
                        res.jsonp({success: true, msg: "注册成功"})
                    }
                })
            }
        }
    })
}

// signin
exports.signin = function (req, res) {
    console.log(req.query);
    var _user = req.query.user
    var name = _user.name
    var password = _user.password

    User.findOne({
        name: name
    }, function (err, user) {
        if (err) {
            console.log(err)
            res.jsonp({success: false})
        } else {
            if (!user) {
                res.jsonp({success: false, msg: "帐号不存在，请先注册"})
            } else {
                user
                    .comparePassword(password, function (err, isMatch) {
                        if (err) {
                            console.log(err)
                            res.jsonp({success: false, msg: "密码错误"})
                        } else {
                            if (isMatch) {
                                req.session.user = user

                                res.jsonp({success: true, msg: "登录成功"})
                            } else {
                                res.jsonp({success: false, msg: "密码不正确，请重新登陆"})
                            }
                        }
                    })
            }
        }
    })
}

// logout
exports.logout = function (req, res) {
    delete req.session.user
    //delete app.locals.user
    res.jsonp({success: true, msg: "已经登出"})
}

// userlist page
exports.list = function (req, res) {
    User
        .fetch(function (err, users) {
            if (err) {
                console.log(err)
                res.jsonp({success: false})
            } else {
                res.jsonp({
                    success: true,
                    data: {
                        title: '用户列表页',
                        users: users
                    }
                })
            }
        })
}

// midware for user
exports.signinRequired = function (req, res, next) {
    var user = req.session.user

    if (!user) {
        res.jsonp({success: false, msg: "请重新登陆"})
    } else {
        next()
    }
}

exports.adminRequired = function (req, res, next) {
    var user = req.session.user

    if (user.role <= 10) {
        res.jsonp({success: false, msg: "无权限请重新登陆"})
    } else {
        next()
    }
}