app.config(['$routeProvider',
    function ($routeProvider) {

        $routeProvider.
        when('/', {
            template: '',
            controller: 'openCtrl',
            reload: true
        }).
        when('/main', {
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
        when('/about', {
            templateUrl: '/views/about.html'
        }).
        otherwise('/');
    }
  ]);
app.controller("openCtrl", function ($http, $scope, $location, $rootScope, sessionOn, $translate) {
    sessionOn.check(function (data) {
        $rootScope.isSession = data.isSession;
        if (data.isSession) {
            $location.path("/viewProfile/" + data.profileKey);
        } else {
            $location.path("/main");
        }
    });
    $scope.logOff = function () {
        sessionOn.logOff().success(function () {
            $location.path("/");
        });

    }
    $scope.changeLang = function () {
        $rootScope.lang = !$rootScope.lang;
        $translate.use($rootScope.lang ? "he" : "en");
    }
});
app.controller("mainController", function ($http, $scope, $location, $filter, sessionOn) {
    $scope.logIn = function () {
        sessionOn.login($scope.login).success(function (response) {
            $location.path("/");
        }).error(function () {
            swal($filter('translate')('FORBIDDEN'), $filter('translate')('SWAL_NO_EMAIL'), "error");
        });
    }
});
app.controller("viewController", function ($scope, $routeParams, $http, $location, $window, $filter) {
    $http.get("/profile/" + $routeParams.userID).
    success(function (data) {
        $scope.isOwner = data.isOwner;
        $scope.profileData = data.details;
    }).error(function () {
        swal($filter('translate')('ERROR'), $filter('translate')('SWAL_NOT_FOUND'), "error");
    });
    $scope.edit = function () {
        $location.path("/signup");
    };
    $scope.QRUrl = "https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=" + $window.location.href;
    $scope.QRUrl = $scope.QRUrl.replace("#", "%23");
});
app.controller('qrCrtl', function ($scope, $rootScope, $location) {

    $scope.onSuccess = function (data) {
        console.log(data);
        data = data.split("#")[1];
        $location.path(data);
        $rootScope.$digest();
    };
    $scope.onError = function (error) {
        $scope.decodeError = "faild";
        console.log(error);
    };
    $scope.onVideoError = function (error) {
        alert(error);
    };
});