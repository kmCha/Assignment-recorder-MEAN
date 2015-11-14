var express = require('express');
var router = express.Router();
var Assignments = require('../config/assignmentModel.js');

router.get('/', function(req, res) {					//get作业
    if (req.session.name) {     		//有session name，即用户登陆了之后的情况，然后获取对应的assignments
	    Assignments.find( {user : req.session.name}, function(err, assignments){
	        if (err) throw err;
	        res.json(assignments);
	    });
    }
    else{
    	var msg = [{msg:"先登录才能添加作业哦"}];
    	res.json(msg);
    }
});

router.post('/', function(req, res){					//添加作业
    Assignments.create({
        title: req.body.title,
        code: req.body.code,
        description: req.body.description,
        date: req.body.date.substr(0, 10),
        user: req.session.name
    }, function(err, assignment){
        if (err) throw err;
        res.json(assignment);
    });
});

router.get('/:id', function(req, res) {
    Assignments.findOne({ _id: req.params.id }, function(err, assignment){
        if (err) throw err;

      	res.json(assignment);
    });
});

router.put('/:id', function(req, res){
    Assignments.update({
        _id: req.params.id
    },
    {
        title: req.body.title,
        code: req.body.code,
        description: req.body.description,
        date: req.body.date.substr(0, 10),
        user: req.session.name
    }, function(err, assignment){
        if (err) throw err;

        res.json(assignment);
    });
});


router.delete('/:id', function(req, res){
    Assignments.remove({ _id: req.params.id }, function(err, assignment){
        if (err) throw err;

        res.json(assignment);
    });
});


module.exports = router;