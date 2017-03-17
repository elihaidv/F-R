var translateProvider = null;
app.config(['$translateProvider', function ($translateProvider) {
    translateProvider = $translateProvider;
    translateProvider.preferredLanguage('he');
}]);
app.run(["$http", "$rootScope", function ($http, $rootScope) {
    $rootScope.lang = true;
    // access $http and routeSegmentProvider here
    $http.get("/translates/he.json").success(function (trans) {
        translateProvider.translations('he', trans);
    });
    $http.get("/translates/en.json").success(function (trans) {
        translateProvider.translations('en', trans);
    });
}]);