var express = require('express');
var app = express();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


module.exports = function(app){
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
    db: 'assignments' //数据库的名称。
  })
}));

};