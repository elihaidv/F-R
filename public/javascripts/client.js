var app = angular.module("findApp", ['ngRoute', 'qrScanner']);
app.config(['$routeProvider',
    function ($routeProvider) {

        $routeProvider.
        when('/', {
            templateUrl: '/views/main.html'
        }).
        when('/signup', {
            templateUrl: '/views/signup.html'
        }).
        when('/qrscan', {
            templateUrl: '/views/qrscan.html'
        }).
        when('/viewProfile/:userID', {
            templateUrl: '/views/viewProfile.html',
            controller: 'viewController'
        }).
        otherwise('/');
    }
  ]);
app.controller("mainController", function ($http, $scope, $location) {
    $scope.logIn = function () {
        $http.post("/login", $scope.login).success(function (response) {
            $location.path("/viewProfile/" + response.profileId);
        }).error(function () {
            swal("Forbidden!", "Name and password doesn't exits", "error");
        });
    }
});
app.controller("viewController", function ($scope, $routeParams, $http, $location) {
    $http.get("/profile/" + $routeParams.userID).
    success(function (data) {
        $scope.isOwner = data.isOwner;
        $scope.profileData = data.details;
    }).error(function () {
        swal("Error!", "Profile dont found!", "error");
    })
    $scope.edit = function () {
        $location.path("/signup");
    };
})
app.controller('qrCrtl', function ($scope, $location) {
    qrcode.callback = function (data) {
        $location.path(data);
    }
    $scope.onSuccess = function (data) {
        console.log(data);
        data = data.split("#")[1];
        $location.path(data);
    };
    $scope.onError = function (error) {
        console.log(error);
    };
    $scope.onVideoError = function (error) {
        alert(error);
    };
});