var express = require('express');
var router = express.Router();
var Assignments = require('../config/assignmentModel.js');
var fs = require('fs');

router.get('/:num', function(req, res) { //get作业
    Assignments.find({
            user: req.session.name
        })
        .sort({
            date: -1
        }) //按日期倒序查询（最近的在最前面）
        .limit(Number(req.params.num)) //限制返回个数
        .exec(function(err, assignments) {
            if (err) throw err;
            res.json(assignments);
        });
});

router.post('/', function(req, res) { //添加作业
    if (req.session.name) {
        Assignments.create({
            title: req.body.title,
            code: req.body.code,
            description: req.body.description,
            date: req.body.date.substr(0, 10),
            user: req.session.name
        }, function(err, assignment) {
            if (err) throw err;
            res.json(assignment);
        });
    } else {
        //先登录
        msg = {
            msg: '先登录'
        };
        res.json(msg);
    }
});

router.get('/edit/:id', function(req, res) {
    Assignments.findOne({
        _id: req.params.id
    }, function(err, assignment) {
        if (err) throw err;

        res.json(assignment);
    });
});

router.put('/edit/:id', function(req, res) {
    Assignments.update({
        _id: req.params.id
    }, {
        title: req.body.title,
        code: req.body.code,
        description: req.body.description,
        date: req.body.date.substr(0, 10),
        user: req.session.name,
        submit: req.body.submit
    }, function(err, assignment) {
        if (err) throw err;

        res.json(assignment);
    });
});


router.delete('/delete/:id', function(req, res) {
    Assignments.remove({
        _id: req.params.id
    }, function(err, assignment) {
        if (err) throw err;
        if (fs.existsSync('./public/uploads/files/' + req.session.name + '/' + req.params.id + '.pdf')) {
            fs.unlink('./public/uploads/files/' + req.session.name + '/' + req.params.id + '.pdf');
        }

        res.json(assignment);
    });
});

module.exports = router;