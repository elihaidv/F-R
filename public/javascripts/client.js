var app = angular.module("findApp", ['ngRoute']);
app.config(['$routeProvider',
    function config($routeProvider) {

        $routeProvider.
        when('/', {
            templateUrl: '/assets/views/main.html'
        }).
        when('/signup', {
            templateUrl: '/assets/views/signup.html'
        }).
        when('/viewProfile/:userID', {
            templateUrl: '/assets/views/viewProfile.html',
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