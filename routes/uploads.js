var multer  = require('multer');
var fs = require('fs');


var storageAvatar = multer.diskStorage({						//头像
  destination: function (req, file, cb) {
    cb(null, './public/uploads/avatars');
  },
  filename: function (req, file, cb) {
    cb(null, req.session.name + '.jpg');
  }
});


var storageFile = multer.diskStorage({							//文件
  destination: function (req, file, cb) {
  	var dir = './public/uploads/files/'+req.session.name;				//该目录在注册时创建，详见users.js
    cb(null, dir);
  },
  filename: function (req, file, cb) {
  	var ext = file.originalname.split('.')[1];
    cb(null, req.body.fileId + '.' + ext);
  }
});
var uploadAva = multer({ storage: storageAvatar, limits: {fileSize: 1 * 1024 * 1024}}).single('avatar');
var uploadFile = multer({ storage: storageFile, limits: {fileSize: 2 * 1024 * 1024}}).single('file');


module.exports = function (app){
	app.post('/upload/avatar', function (req, res, next) {
		uploadAva(req, res, function (err) {
      if (err) {
        // An error occurred when uploading
        res.send(err);
        return;
      }
      // console.log(req.file.mimetype);
      // console.log(req.file.path);
      var msg = { status: "success"};
      res.json(msg);
      // Everything went fine
	  });
	  // req.file is the `avatar` file
	  // req.body will hold the text fields, if there were any
	});
	app.post('/upload/file', function (req, res, next) {
		uploadFile(req, res, function (err) {
      if (err) {
        // An error occurred when uploading
        res.send(err);
        return;
      }
      // console.log(req.file.mimetype);
      //console.log(req.body.fileId);
      var msg = { status: "success"};
      res.json(msg);
      // Everything went fine
	  });
	  // req.file is the `avatar` file
	  // req.body will hold the text fields, if there were any
	});
};

