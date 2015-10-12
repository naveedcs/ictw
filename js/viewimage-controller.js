//This dile is no more in use

var mainapp = angular.module('ic2w', []);

mainapp.controller("ViewImageController", ['$scope', '$http', function ($scope, $http) {
    var _paramImageID = getParameterByName("imageid");

    console.log(_paramImageID);
    $scope.imageData = "";
    var reqs = {            
        method: 'POST',
        url: '/getImageData',
        headers: {                
            'Content-Type': 'application/json'            
        },
        data: {
            ImageId: _paramImageID
        }
    };
    $http(reqs)
        .success(function (res) {
            //console.log(res);
            //$scope.imageData = res.imageData;
            var base64_string = res.imageData;
            var img = document.createElement("img");
            img.width = "400";
            img.height = "400";
            img.src = base64_string;
            var preview = document.getElementById("img_preview");
            preview.appendChild(img);

        }).error(function (err, status) {
            alert("message:" + " " + err.message + "----" + err.hint);
        });

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }


}])
