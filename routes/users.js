var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var Users = require('../config/userModel.js');
var Profiles = require('../config/profileModel.js');
var fs = require('fs');

router.get('/signup', function(req, res, next) {
	var result;
	if(req.query.name) {
		Users.findOne({name: req.query.name}, function(err, user){
			if(err) return;
			if(!user) {
				result = {status: "success"};
			}
			else {
				result = {status: "fail"};
			}
			res.json(result);
		});
	}
	else{
		result = {status: "fail"};
		res.json(result);
	}
});

router.post('/signup', function(req, res, next) {
	if (req.body.password1 == req.body.password2) {    //两次密码相同
		Users.findOne({
			name: req.body.name
		}, function(err, user) {
			if (!user) {								//数据库中没有提交的账号
				var shasum = crypto.createHash('sha1');							//sha1不可逆加密密码然后再保存
				shasum.update(req.body.password1);
				var password = shasum.digest('hex'),
					dir = './public/uploads/files/'+req.body.name;						//创建用户上传目录
				fs.mkdir(dir);
				var readStream = fs.createReadStream('./public/uploads/avatars/default.jpg'),
					writeStream = fs.createWriteStream('./public/uploads/avatars/' + req.body.name + '.jpg');
				readStream.pipe(writeStream);
				readStream.on('end', function () {
					console.log('copy end');
				});
				readStream.on('error', function () {
					console.log('copy error');
				});
				Profiles.create({							//插入用户profile
					username: req.body.name,
					gender: '',
					school: '',
					major: ''
				});
				Users.create({					//插入数据库
					name: req.body.name,
					password: password
				}, function(err, user) {
					if (err) throw err;
					res.json(user);
				});
			}
			else {									//数据库中有了提交的帐号（帐号被注册了）
				user = {msg : "帐号已被注册, 你以为只有你会想到这个帐号？"};
				user.status = "fail";
				res.json(user);
			}
		});

	} else {        //两次密码不同
		var user = { msg:"两次密码不同啊朋友", status:"fail"} ;
		res.json(user);
	}
});

router.post('/login', function(req, res) {
	Users.findOne({					//检查数据库中帐号存不存在
		name: req.body.name
	}, function(err, user) {
		if (err) throw err;
		if (user) {            //用户存在 检查密码
			var shasum = crypto.createHash('sha1');
			shasum.update(req.body.password);
			var password = shasum.digest('hex');							//同样用sha1加密登陆密码跟数据库中经过sha1加密之后的密码对比
			if (user.password == password) {				//密码正确 添加session
				req.session.cookie.expires = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);        //只有登陆了才设置session name为帐号，否则为null，浏览器关闭自动销毁（见session.js)
				req.session.name = user.name;
				user.status = "succuss";
				res.json(user);
			}
			else{  			//密码不正确
				user = {status : "fail"};
				user.msg = "密码不正确";
				res.json(user);
			}
		}
		else{    			//用户不存在
			user={ status : "fail"};
			user.msg = "用户不存在啊，先注册朋友";
			res.json(user);
		}
	});
});

router.get('/logout', function(req, res) {
	req.session.cookie.expires = new Date(Date.now());        //将session销毁，就销毁了登陆状态
	req.session.destroy();
	var msg = {msg: "注销成功，正在返回主页..."};
	res.json(msg);
});

router.get('/', function(req, res) {
	// console.log(req.sessionID);
	if (req.session.name) {											//如果有session（也就是说有人登陆），那么返回登陆的用户名给angular app
		res.json({username: req.session.name});
	}
	else{
		var msg = {msg: "没登陆"};
		res.json(msg);
	}
});

module.exports = router;
