var mongoose = require('mongoose')
var User = mongoose.model('User')

// signup
exports.showSignup = function(req, res) {
    res.render('signup', {
        title: '注册页面'
    })
}

exports.showSignin = function(req, res) {
    res.render('signin', {
        title: '登录页面'
    })
}

exports.signup = function(req, res) {
    var _user = req.body.user

    User.findOne({ name: _user.name }, function(err, user) {
        if (err) {
            console.log(err)
            res.json({ success: false })
        } else {
            if (user) {
                res.json({
                    success: true,
                    msg: "已经注册"
                })
            } else {
                user = new User(_user)
                user.save(function(err, user) {
                    if (err) {
                        console.log(err)
                        res.json({ success: false })
                    } else {
                        res.json({
                            success: true,
                            msg: "注册成功"
                        })
                    }
                })
            }
        }
    })
}

// signin
exports.signin = function(req, res) {
    var _user = req.body.user
    var name = _user.name
    var password = _user.password

    User.findOne({ name: name }, function(err, user) {
        if (err) {
            console.log(err)
            res.json({ success: false })
        } else {
            if (!user) {
                res.json({
                    success: false,
                    msg: "帐号不存在，请先注册"
                })
            }
            user.comparePassword(password, function(err, isMatch) {
                if (err) {
                    console.log(err)
                    res.json({ success: false })
                } else {
                    if (isMatch) {
                        req.session.user = user

                        res.json({
                            success: true,
                            msg: "登录成功"
                        })
                    } else {
                        res.json({
                            success: false,
                            msg: "密码不正确，请重新登陆"
                        })
                    }
                }
            })
        }
    })
}

// logout
exports.logout = function(req, res) {
    delete req.session.user
        //delete app.locals.user
    res.json({
        success: true,
        msg: "已经登出"
    })
}

// userlist page
exports.list = function(req, res) {
    User.fetch(function(err, users) {
        if (err) {
            console.log(err)
            res.json({ success: false })
        } else {
            res.json({
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
exports.signinRequired = function(req, res, next) {
    var user = req.session.user

    if (!user) {
        res.json({
            success: false,
            msg: "请重新登陆"
        })
    } else {
        next()
    }
}

exports.adminRequired = function(req, res, next) {
    var user = req.session.user

    if (user.role <= 10) {
        res.json({
            success: false,
            msg: "无权限请重新登陆"
        })
    } else {
        next()
    }
}