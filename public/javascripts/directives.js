app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.$parent.decodeError = "thinck";
                    scope.fileread = changeEvent.target.files[0];
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                    var reader = new FileReader();
                    reader.onload = (function (theFile) {
                        return function (e) {

                            qrcode.decode(e.target.result);

                        };
                    })(changeEvent.target.files[0]);
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            });
        }
    }
}]);