var app = angular.module('Arecorder', ['ngResource', 'ngRoute', 'ui.bootstrap', 'ngAnimate', 'infinite-scroll', 'ngFileUpload']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/index.html',
            controller: 'IndexCtrl'
        })
        .when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/profile/:username', {
            templateUrl: 'partials/profile.html',
            controller: 'ProfileCtrl'
        })
        // .when('/add-assignment', {
        //     templateUrl: 'partials/form.html',
        //     controller: 'AddAssignmentCtrl'
        // })
        // .when('/assignments/:id', {
        //     templateUrl: 'partials/form.html',
        //     controller: 'EditAssignmentCtrl'
        // })
        // .when('/assignments/delete/:id', {
        //     templateUrl: 'partials/delete.html',
        //     controller: 'DeleteAssignmentCtrl'
        // })
        // .when('/login', {
        //     templateUrl: 'partials/login.html',
        //     controller: 'LoginCtrl'
        // })
        // .when('/signup', {
        //     templateUrl: 'partials/signup.html',
        //     controller: 'SignupCtrl'
        // })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller('IndexCtrl', ['$scope', '$resource', '$location', '$window', '$rootScope', '$uibModal', '$timeout',
    function($scope, $resource, $location, $window, $rootScope, $uibModal, $timeout) {
        $scope.height = $window.innerHeight;            //读取浏览器窗口高度
        $scope.width = $window.innerWidth;               //宽度
        $timeout(function(){                                    //用户没登陆的话显示4s加载页面
            $location.path('/home');
        }, 4000);
    }]);

app.controller('HomeCtrl', ['$scope', '$resource', '$location', '$window', '$rootScope', '$uibModal', '$timeout',
    function($scope, $resource, $location, $window, $rootScope, $uibModal, $timeout) {
        // alert('aa');
        var num = 4;                               //第一次加载的作业数量
        var step = 2;                               //点击加载的数量
        $scope.height = $window.innerHeight;            //读取浏览器窗口高度
        $scope.width = $window.innerWidth;               //宽度
        $scope.status = true;                            //登陆状态  false为登陆了，true为没登陆，默认没登陆
        $scope.firstStatus = false;                     //是否添加过作业
        $scope.assignments = [];
        var User = $resource('/api/users');                             //检查目前有没有用户登陆
        User.get(function(user) {                                   //登陆了
            if(!user.msg) {                                 //有的话就把根作用域的username设为传回来的username（见users.js）
                // angular.element('.assignmentContainer').attr({
                //     'infinite-scroll': 'nextPage()',
                //     'infinite-scroll-disabled': 'busy'
                // });
                // $scope.busy = false;
                $rootScope.username = user.username;
                $scope.refresh();                                  //获取作业
                $scope.status = false;
            }
            else{                                                               //没登陆
                // $scope.processStatus = true;                        //加载页面状态
                // $scope.busy = true;                 //禁用加载按钮
            }
        });
        $scope.logout = function(){
            var Logout = $resource('/api/users/logout');
            Logout.get(function(res){
                alert(res.msg);
                $location.path('/');              //注销完刷新页面
            });
        };
        $scope.openLogin = function () {
            var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'partials/login.html',
              controller: 'LoginCtrl'
            });
        };
        $scope.openSignup = function () {
            var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'partials/signup.html',
              controller: 'SignupCtrl'
            });
            modalInstance.result.then(function () {
                $scope.openLogin();
            }, function () {
            });
        };
        $scope.openEdit = function (id) {
            $rootScope.id = id;
            var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'partials/form.html',
              controller: 'EditAssignmentCtrl'
            });
            modalInstance.result.then(function () {
                $scope.refresh();
            }, function () {
            });
        };
        $scope.openDelete = function (id) {
            $rootScope.id = id;
            var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'partials/delete.html',
              controller: 'DeleteAssignmentCtrl'
            });
            modalInstance.result.then(function () {
                num = num - 1;
                $scope.refresh();
            }, function () {
            });
        };
        $scope.openAdd = function () {
            var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'partials/form.html',
              controller: 'AddAssignmentCtrl'
            });
            modalInstance.result.then(function (msg) {
                if(msg == 'redirect'){
                    alert('你都还没登陆添加啥作业！');
                    $scope.openLogin();
                }
                else {
                    $scope.refresh();
                }
            }, function () {
            });
        };
        $scope.nextPage = function() {
            if (this.busy) return;
            $scope.busy = true;
            var Assignments = $resource('/api/assignments/:num');
            num = num + step;
            Assignments.query({ num : num},function(assignments) {       //从数据库获取作业
                if($scope.assignments.length === assignments.length) {           //返回的assignments跟目前的一样，也就是没有更多了
                    $scope.noMore = true;
                    $timeout(function(){
                        $scope.noMore = false;
                }, 2000);
                }
                else{                       //返回作业
                    for (i=0; i<assignments.length; i++)
                    {
                        var date = assignments[i].date.split('-');
                        var year = date[0];
                        var month = date[1];
                        var day = date[2];
                        var today = new Date();
                        if (year < today.getFullYear())         //作业的duedate的年早于今天所在的年份
                        {
                            assignments[i].submit = true;
                        }
                        else if (year == today.getFullYear())       //duedate和今天同年
                        {
                            if (month < today.getMonth()+1)             //duedate的月份小于今天所在的月份
                            {
                                assignments[i].submit = true;
                            }
                            else if (month == today.getMonth()+1)           //duedate和今天同月
                            {
                                if (day < today.getDate())                  //duedate所在的日期比今天早
                                {
                                    assignments[i].submit = true;
                                }
                            }
                        }
                    }
                    $scope.assignments = assignments;
                }
                $scope.busy = false;
            });
        };
        $scope.refresh = function(){
            var Assignments = $resource('/api/assignments/:num');
            Assignments.query({ num : num},function(assignments) {       //从数据库获取作业
                if(assignments.length === 0){                  //用户第一次登陆，数据库中没有用户的作业记录
                    $scope.firstStatus = true;
                    $('.assignmentContainer').addClass('center');
                }
                else{
                    for (i=0; i<assignments.length; i++)
                    {
                        var date = assignments[i].date.split('-');
                        var year = date[0];
                        var month = date[1];
                        var day = date[2];
                        var today = new Date();
                        if (year < today.getFullYear())         //作业的duedate的年早于今天所在的年份
                        {
                            assignments[i].submit = true;
                        }
                        else if (year == today.getFullYear())       //duedate和今天同年
                        {
                            if (month < today.getMonth()+1)             //duedate的月份小于今天所在的月份
                            {
                                assignments[i].submit = true;
                            }
                            else if (month == today.getMonth()+1)           //duedate和今天同月
                            {
                                if (day < today.getDate())                  //duedate所在的日期比今天早
                                {
                                    assignments[i].submit = true;
                                }
                            }
                        }
                    }
                    $scope.assignments = assignments;
                    $('.assignmentContainer.center').removeClass('center');
                    // console.log(assignments);
                }
            });
        };
    }
]);

app.controller('ProfileCtrl', ['$scope', '$resource', '$routeParams', '$location', '$timeout', 'Upload',
    function($scope, $resource, $routeParams, $location, $timeout, Upload){
        $scope.status = true;
        var Profile = $resource('/api/profiles/:username', {
            username: '@username'
        }, {
            update: {
                method: 'PUT'
            }
        });
        $scope.refresh = function(){
            Profile.get({
                username : $routeParams.username
            }, function(profile){
                if(!profile.msg){
                    $scope.profile = profile;
                }
                else {
                    alert(profile.msg);
                    $location.path('/#/home');
                }
            });
        };
        $scope.refresh();
        $scope.update = function(file) {
            Profile.update($scope.profile, function(msg) {      //接着更新资料
                if (msg.status === "success") {
                    //资料更新成功,然后上传头像
                    if(file) {      //如果用户载入了头像的话
                        file.upload = Upload.upload({  //ng-file-upload模块
                          url: '/upload/avatar',
                          data: {avatar: file}
                        })
                        .then(function (resp) {
                            if(resp.data.status === "success"){             //更新成功
                                $scope.msg = "更新成功";
                                $scope.status = true;
                                $timeout(function(){
                                        $scope.status = false;
                                }, 2000);
                            }
                            else {
                                $scope.msg = "资料更新成功，头像上传失败";
                                $scope.status = true;
                                $timeout(function(){
                                        $scope.status = false;
                                }, 2000);
                            }
                        });
                    }
                    else {           //用户没载入头像，不发送post请求
                        $scope.msg = "更新成功";
                        $scope.status = true;
                        $timeout(function(){
                                $scope.status = false;
                        }, 2000);
                    }

                }
                else {
                    //资料更新失败
                    $scope.msg = "更新失败";
                    $scope.status = true;
                    $timeout(function(){
                            $scope.status = false;
                    }, 2000);
                }
                $scope.refresh();
            });
        };
        // $scope.update = function(){
        //     Profile.update($scope.profile, function(msg) {
        //         if (msg.status === "success") {
        //             //更新成功
        //             $scope.status = false;
        //             $scope.msg = "资料更新成功";
        //             $timeout(function(){
        //                 $scope.status = true;
        //         }, 2000);
        //         }
        //         else {
        //             //更新失败
        //         }
        //         $scope.refresh();
        //     });
        // };
    }
]);

app.controller('AddAssignmentCtrl', ['$scope', '$resource', '$location', '$uibModalInstance', 'Upload',
    function($scope, $resource, $location, $uibModalInstance, Upload) {
        $scope.save = function(file) {
            var Assignments = $resource('/api/assignments');
            Assignments.save($scope.assignment, function(assignment) {
                if(!assignment.msg){            //用户登录了
                    if(file){                   //登录了且添加了文件
                        file.upload = Upload.upload({  //ng-file-upload模块
                          url: '/upload/file',
                          data: {fileId: assignment._id, file: file}
                        })
                        .then(function (resp) {
                            //上传文件成功
                            if (resp.data.status === "success") {
                                //文件更新成功
                                $uibModalInstance.close('success');
                            }
                            else {
                                alert('文件上传不成功，请重试');
                            }
                        });
                    }
                    else {                         //登录了没添加文件
                        $uibModalInstance.close('success');
                    }
                }
                else{                           //用户没登陆
                    $uibModalInstance.close('redirect');
                }
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);


app.controller('EditAssignmentCtrl', ['$scope', '$resource', '$location', '$rootScope', '$uibModalInstance', 'Upload',
    function($scope, $resource, $location, $rootScope, $uibModalInstance, Upload) {
        var Assignments = $resource('/api/assignments/edit/:id', {
            id: '@_id'                          //这的id后面加@_id代表用PUT方法时url中的:id参数等于下面$scope.assignment中的_id属性
        }, {
            update: {
                method: 'PUT'
            }
        });

        Assignments.get({
            id: $rootScope.id
        }, function(assignment) {
            var date = assignment.date.split('-');
            var year = date[0];
            var month = date[1];
            var day = date[2];
            var today = new Date();
            if (year < today.getFullYear())         //作业的duedate的年早于今天所在的年份
            {
                assignment.submit = true;
            }
            else if (year == today.getFullYear())       //duedate和今天同年
            {
                if (month < today.getMonth()+1)             //duedate的月份小于今天所在的月份
                {
                    assignment.submit = true;
                }
                else if (month == today.getMonth()+1)           //duedate和今天同月
                {
                    if (day < today.getDate())                  //duedate所在的日期比今天早
                    {
                        assignment.submit = true;
                    }
                }
            }
            date = new Date(year, month-1, day);               //将存在mongodb中的字符串形式的date转换成Date对象传递给model
            assignment.date = date;
            $scope.assignment = assignment;
        });

        $scope.save = function(file) {
            Assignments.update($scope.assignment, function() {                              //就是这的
                if(file){
                    file.upload = Upload.upload({  //ng-file-upload模块
                      url: '/upload/file',
                      data: {fileId: $scope.assignment._id, file: file}
                    })
                    .then(function (resp) {
                        //上传文件成功
                        if (resp.data.status === "success") {
                            //文件更新成功
                            $uibModalInstance.close('success');
                        }
                    });
                }
                $uibModalInstance.close('success');
                // $location.path('/11');
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);


app.controller('DeleteAssignmentCtrl', ['$scope', '$resource', '$location', '$rootScope', '$uibModalInstance', '$window',
    function($scope, $resource, $location, $rootScope, $uibModalInstance, $window) {
        var Assignments = $resource('/api/assignments/delete/:id');
        $scope.delete = function() {
            Assignments.delete({
                id: $rootScope.id
            }, function(assignment) {
                $uibModalInstance.close('success');
                // angular.element
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

app.controller('SignupCtrl', ['$scope', '$resource', '$location', '$uibModalInstance',
    function($scope, $resource, $location, $uibModalInstance) {
        $scope.signup = function() {
            var Users = $resource('/api/users/signup');
            Users.save($scope.user, function(user) {
                if(user.status == "fail"){     //帐号已存在或者两次密码不一致
                    alert(user.msg);
                }
                else {
                    alert("注册成功，请登录");
                    $uibModalInstance.close('success');
                }
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);


app.controller('LoginCtrl', ['$scope', '$resource', '$location', '$rootScope', '$uibModalInstance', '$window',
    function($scope, $resource, $location, $rootScope, $uibModalInstance, $window) {
        $scope.login = function() {
            var Users = $resource('/api/users/login');
            Users.save($scope.user, function(users) {
                if(users.status == "fail"){              //帐号不存在或者密码错误
                    alert(users.msg);
                }
                else{
                    alert("欢迎回来：" + users.name);
                    // $location.path('/123');
                    $window.location.reload();
                }
                // alert(users.status);
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);




