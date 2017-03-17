var app = angular.module("findApp", ['ngRoute', 'qrScanner', 'pascalprecht.translate']);


app.service("sessionOn", function ($http) {
    funcs = [];

    this.session = {};
    var session = this.session;

    this.check = function (func) {
        if (session.isSession != undefined) {
            func(session);
        } else {
            funcs.push(func);
        }
    };
    this.logOff = function () {
        return $http.delete('/login').success(function () {
            session = {
                isSession: false
            };
        });
    }
    this.login = function (data) {
        return $http.post("/login", data).success(function (resData) {
            session.isSession = true;
            session.profileKey = resData.profileId;
        });
    }
    this.signup = function (data) {
        return $http.post("/signup", data).success(function (resData) {
            session.isSession = true;
            session.profileKey = resData;
        });
    }
    $http.get("/login").success(function (data) {
        session.isSession = data.isSession;
        session.profileKey = data.profileKey;

        for (i = 0; i < funcs.length; i++) {
            funcs[i](session);
        }
    });
});