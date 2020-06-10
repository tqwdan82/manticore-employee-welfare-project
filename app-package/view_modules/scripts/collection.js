var collectionApp = angular.module('collectionApp', []);
collectionApp.controller('collectionCtrl', function($scope) {
    $scope.inputEmpNo = "";
    $scope.continue = function(){

        if(typeof $scope.inputEmpNo === 'undefined' || $scope.inputEmpNo === '' || $scope.inputEmpNo === 'undefined'){
            $('#invalidEmpNoModal').modal('show');
            return;
        }

        let httpCallback = function(empsResponse){
            let empsRes = JSON.parse(empsResponse);
            if(empsRes.length > 0){
                localStorage.setItem("sessionEmp", $scope.inputEmpNo );
                window.location.href = '/web?action=collectionOpt';
            }else {
                $('#invalidEmpNoModal').modal('show');
                return;
            }
        }
        httpGetAsync("../../web/services/resource/Employee?EmpID="+$scope.inputEmpNo, {}, httpCallback);
    };

    $scope.init = function(){
        let sessionEmpNo = localStorage.getItem("sessionEmp");
        if(typeof sessionEmpNo === 'undefined' || $scope.inputEmpNo === '' || $scope.inputEmpNo === 'undefined'){
            $scope.inputEmpNo = "";
        }else{
            $scope.inputEmpNo = sessionEmpNo;
        }
    };

    $scope.init();
});