var collectionOptApp = angular.module('collectionOptApp', []);
collectionOptApp.controller('collectionOptCtrl', function($scope) {
    $scope.empName = '';
    $scope.leave = function(){
        localStorage.removeItem("sessionEmp");
        window.location.href = '/web?action=collection';
    };

    $scope.init = function(){
        let sessionEmpNo = localStorage.getItem("sessionEmp");

        if(typeof sessionEmpNo !== 'undefined'){
            let httpCallback = function(empsResponse){
                console.log(empsResponse)
                let empsRes = JSON.parse(empsResponse);
                if(empsRes.length > 0){
                    $scope.$apply(function(){
                        let empRes = empsRes[0];
                        $scope.empName = empRes.EmpName;
                    });
                }else{
                    localStorage.removeItem("sessionEmp");
                    window.location.href = '/web?action=collection';
                }
            }
            httpGetAsync("../../web/services/resource/Employee?EmpID="+sessionEmpNo, {}, httpCallback);
        }else{
            localStorage.removeItem("sessionEmp");
            window.location.href = '/web?action=collection';
        }
    };

    $scope.init();
});