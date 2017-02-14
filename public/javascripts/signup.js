app.controller("signupCtrl", function ($scope, $http, $location) {
    $http.get("/fields").success(function (fields) {
        $scope.email = fields.email;
        $scope.fullName = fields.details.fullName;
        $scope.password = fields.password;
        $scope.return = fields.password;

        delete fields.details.email;
        delete fields.details.fullName;
        $scope.fields = fields.details;
    });

    $scope.addfield = function () {
        swal.withFormAsync({
            title: 'Add new identifier',
            text: 'Please Add any identifier that you want will appear in your profile',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Add',
            closeOnConfirm: true,
            formFields: [
                {
                    id: 'ident',
                    placeholder: 'Identifier'
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
            $scope.message.push("Please enter valid mail");
        }
        if ($scope.password != $scope.return) {
            $scope.message.push("Passwords are not match");
        }
        if (!$scope.email || !$scope.password || !$scope.fullName) {
            $scope.message.push("Red fields are required");
        }

        if ($scope.message.length == 0) {
            $scope.fields.fullName = $scope.fullName;
            $http.post("/signup", {
                password: $scope.password,
                email: $scope.email,
                details: $scope.fields
            }).success(function (data) {
                swal("Success!", "Profile Created Successfully!", "success");
                $location.path("/viewProfile/" + data);
            }).error(function (err, code) {
                if (code == 400) {
                    swal("Error!", "Email already exits in the system!", "error");
                } else {
                    swal("Error!", "Something Get Worng, Try again later", "error");
                }
            });
        }
    };
});