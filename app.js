var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/assignments');

var routes = require('./routes/index');
var users = require('./routes/users');
var assignments = require('./routes/assignments.js');
var router = express.Router();

// var monk = require('monk');
// var db = monk('localhost:27017/assignments');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '12345',
  name: 'user', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
  cookie: {
    maxAge: null
  }, //设置maxAge是null，cookie和session同时过期
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ //创建新的mongodb数据库
    host: 'localhost', //数据库的地址，本机的话就是127.0.0.1，也可以是网络主机
    port: 27017, //数据库的端口号
    db: 'test-session' //数据库的名称。
  })
}));

app.use('/', routes);
app.use('/api/users', users);
app.use('/api/assignments', assignments);

// /* GET users listing. */
// router.post('/api/users/signup', function(req, res, next) {
//   var collection = db.get('user');
//   collection.insert({
//     name: req.body.name,
//     password: req.body.password1
//   }, function(err, user) {
//     if (err) throw err;
//     res.json(user);
//   });
// });

// router.post('/api/users/login', function(req, res) {
//   var collection = db.get('user');
//   collection.findOne({
//     name: req.body.name
//   }, function(err, user) {
//     if (err) throw err;
//     if (user) {
//      res.json(user);

//     }
//   });
// });

// app.use('/', router);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;