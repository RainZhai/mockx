var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var session = require('express-session');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var multipart = require('connect-multiparty')
var logger = require('morgan')
var mongoStore = require('connect-mongo')(session)

var port = process.env.PORT || 8899
var app = express()
var fs = require('fs')
var dbUrl = 'mongodb://127.0.0.1:27017/mockx'
//var dbUrl = 'mongodb://zhaiyu963:963852741zy@ds129166.mlab.com:29166/mockx'
var arguments = process.argv.splice(2);
console.log('所传递的参数是：', arguments);

mongoose.connect(dbUrl,{ useNewUrlParser:true })

// models loading
var models_path = __dirname + '/app/models'
var walk = function (path) {
    fs
        .readdirSync(path)
        .forEach(function (file) {
            var newPath = path + '/' + file
            var stat = fs.statSync(newPath)

            if (stat.isFile()) {
                if (/(.*)\.(js|coffee)/.test(file)) {
                    require(newPath)
                }
            } else if (stat.isDirectory()) {
                walk(newPath)
            }
        })
}
walk(models_path)
app.set('views', './app/views/pages')
app.set('view engine', 'jade')
app.use(bodyParser())
app.use(cookieParser())
app.use(multipart())
app.use(session({
    secret: 'mockx',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}))

if ('development' === app.get('env')) {
    app.set('showStackError', true)
    app.use(logger(':method :url :status'))
    app.locals.pretty = true
    //mongoose.set('debug', true)
}
if (arguments.length > 0 && arguments[0] == "api") {
    require('./config/routesapi')(app)
} else {
    require('./config/routes')(app)
}

app.listen(port)
app.locals.moment = require('moment')
app.use(express.static(path.join(__dirname, 'public')))

console.log('mockx started on port ' + port)