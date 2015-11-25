var express = require('express');
var router = express.Router();
var Profiles = require('../config/profileModel.js');

router.get('/:username', function(req, res) {					//
	if(req.session.name == req.params.username) {
	  Profiles.findOne( {username : req.params.username}).exec(function(err, profile){
	      if (err) throw err;
	      res.json(profile);
	  });
	}
	else if (req.session.name) {
		var msg = { msg : '你看别人的资料干啥'};
		res.json(msg);
	}
	else{
		var msg1 = {msg : '先登录朋友'};
		res.json(msg1);
	}
});

router.put('/:username', function(req, res){
    Profiles.update({
        username: req.params.username
    },
    {
        gender: req.body.gender,
        school: req.body.school,
        major: req.body.major
    }, function(err, profile){
        if (err) throw err;
        var msg = {status : "success"};
        res.json(msg);
    });
});

module.exports = router;