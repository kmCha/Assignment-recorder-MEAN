var express = require('express');
var router = express.Router();
var Profiles = require('../config/profileModel.js');

router.get('/:username', function(req, res) {					//
	if(req.session.name) {
	  Profiles.findOne( {username : req.params.username}).exec(function(err, profile){
	      if (err) throw err;
	      res.json(profile);
	  });
	}
	else{
		var msg = {status : 'fail'};
		res.json(msg);
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