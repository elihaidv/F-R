app.controller("signupCtrl", function ($scope, $http, $location, $rootScope, $filter, sessionOn) {
    $http.get("/fields/" + $rootScope.lang).success(function (fields) {
        $scope.email = fields.email;
        $scope.fullName = fields.details.fullName;
        $scope.password = fields.password;
        $scope.return = fields.password;

        delete fields.details.email;
        delete fields.details.fullName;
        delete fields.details["שם מלא"];
        $scope.fields = fields.details;
    });

    $scope.addfield = function () {
        swal.withFormAsync({
            title: $filter('translate')('SWAL_ADD_TITLE'),
            text: $filter('translate')('SWAL_ADD'),
            showCancelButton: true,
            confirmButtonText: $filter('translate')('ADD'),
            closeOnConfirm: true,
            formFields: [
                {
                    id: 'ident',
                    placeholder: $filter('translate')('IDENT')
                }
            ]
        }).then(
            function (isConfirm) {
                if (isConfirm.swalForm.ident != "" &&
                    isConfirm._isConfirm) {
                    $scope.fields[isConfirm.swalForm.ident] = "";
                    $scope.$digest()
                }
            });
    };

    $scope.deleteField = function (field) {
        delete $scope.fields[field];
    }


    $scope.submit = function () {
        $scope.message = [];
        if (!/\S+@\S+\.\S+/.test($scope.email)) {
            $scope.message.push($filter('translate')('MSG_EMAIL'));
        }
        if ($scope.password != $scope.return) {
            $scope.message.push($filter('translate')('MSG_PASS'));
        }
        if (!$scope.email || !$scope.password || !$scope.fullName) {
            $scope.message.push($filter('translate')('MSG_RED'));
        }

        if ($scope.message.length == 0) {
            $scope.fields.fullName = $scope.fullName;
            sessionOn.signup({
                password: $scope.password,
                email: $scope.email,
                details: $scope.fields
            }).success(function (data) {
                swal($filter('translate')('SUCCESS'), $filter('translate')('SWAL_CREATE'), "success");
                $location.path("/");
            }).error(function (err, code) {
                if (code == 400) {
                    swal($filter('translate')('ERROR'), $filter('translate')('SWAL_EMAIL'), "error");
                } else {
                    swal($filter('translate')('ERROR'), $filter('translate')('SWAL_ERROR'), "error");
                }
            });
        }
    };
});
document.addEventListener("deviceready", onDeviceReady, true);

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
}

function onBackKeyDown(event) {
    // Handle the back button
    event.preventDefault();
    alert('I am a demo purpose alert thingy');
};