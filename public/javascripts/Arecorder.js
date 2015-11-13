var app = angular.module('Arecorder', ['ngResource', 'ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/add-assignment', {
            templateUrl: 'partials/form.html',
            controller: 'AddAssignmentCtrl'
        })
        .when('/assignments/:id', {
            templateUrl: 'partials/form.html',
            controller: 'EditAssignmentCtrl'
        })
        .when('/assignments/delete/:id', {
            templateUrl: 'partials/delete.html',
            controller: 'DeleteAssignmentCtrl'
        })
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
        })
        .when('/signup', {
            templateUrl: 'partials/signup.html',
            controller: 'SignupCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller('HomeCtrl', ['$scope', '$resource', '$location', '$window',
    function($scope, $resource, $location, $window) {
        $scope.status = false;
        $scope.firstStatus = false;
        var Assignments = $resource('/api/assignments');
        Assignments.query(function(assignments) {
            // alert(assignments);
                if(assignments.length === 0){                  //用户第一次登陆，数据库中没有用户的作业记录
                    // alert("欢迎来到Assignment Recorder，点击添加作业新增无穷无尽的作业吧");
                    $scope.firstStatus = true;
                }
                else if(assignments[0].msg){            //用户没登陆，返回的msg，见assignments.js
                    $scope.msg = assignments[0].msg;
                    $scope.status = true;
                }
                else{                       //非第一次登陆，返回作业
                    $scope.assignments = assignments;
                    $scope.order = 'date';
                    $scope.status = false;
            }
        });
        $scope.logout = function(){
            var Logout = $resource('/api/users/logout');
            Logout.get(function(res){
                alert(res.msg);
                // $location.path('/');
                $window.location.reload();              //注销完刷新页面
            });
        };
    }
]);


app.controller('AddAssignmentCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location) {
        $scope.save = function() {
            var Assignments = $resource('/api/assignments');
            Assignments.save($scope.assignment, function() {
                $location.path('/');
            });
        };
    }
]);


app.controller('EditAssignmentCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams) {
        var Assignments = $resource('/api/assignments/:id', {
            id: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });

        Assignments.get({
            id: $routeParams.id
        }, function(assignment) {
            $scope.assignment = assignment;
        });

        $scope.save = function() {
            Assignments.update($scope.assignment, function() {
                $location.path('/');
            });
        };
    }
]);


app.controller('DeleteAssignmentCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams) {
        var Assignments = $resource('/api/assignments/:id');

        Assignments.get({
            id: $routeParams.id
        }, function(assignment) {
            $scope.assignment = assignment;
        });

        $scope.delete = function() {
            Assignments.delete({
                id: $routeParams.id
            }, function(assignment) {
                $location.path('/');
            });
        };
    }
]);

app.controller('SignupCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location) {
        $scope.signup = function() {
            var Users = $resource('/api/users/signup');
            Users.save($scope.user, function(user) {
                if(user.status == "fail"){     //帐号已存在或者两次密码不一致
                    alert(user.msg);
                }
                else {
                    alert("注册成功，请登录");
                    $location.path('/');
                }
            });
        };
    }
]);


app.controller('LoginCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location) {
        $scope.login = function() {
            var Users = $resource('/api/users/login');
            Users.save($scope.user, function(users) {
                if(users.status == "fail"){              //帐号不存在或者密码错误
                    alert(users.msg);
                }
                else{
                    alert("欢迎回来：" + users.name);
                    $location.path('/');
                }
                // alert(users.status);
            });
        };
    }
]);