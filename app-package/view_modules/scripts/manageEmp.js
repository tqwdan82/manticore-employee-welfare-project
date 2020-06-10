var mgmEmpApp = angular.module('mgmEmpApp', []);
mgmEmpApp.controller('mgmEmpCtrl', function($scope) {
    $scope.data = {
        employees:[],
        editEmployee:{}
    };
    $scope.toDelete='';

    $scope.edit = function(id){
        $scope.data.employees.forEach(employee => {
            if(employee.id === id){
                $scope.data.editEmployee.id = id;
                $scope.data.editEmployee.EmpName = employee.EmpName;
                $scope.data.editEmployee.EmpID = employee.EmpID;
                $scope.data.editEmployee.EmpDep = employee.EmpDep;
                $scope.data.editEmployee.EmpStartDate = employee.EmpStartDate;
                $scope.data.editEmployee.EmpEndDate = employee.EmpEndDate;
                $scope.data.editEmployee.EmpContact = employee.EmpContact;
            }
        });
    };

    $scope.update = function(){
        //$scope.$apply(function(){
            console.log($scope.data.editEmployee)
            document.getElementById("overlay").style.display = "block";
            let httpCallback = function(response){
                $scope.init();
            };
            httpPutAsync("../../web/services/resource/Employee", $scope.data.editEmployee, httpCallback);
        //});
    };

    $scope.deleting = function(id){
        $scope.toDelete=id;
    };

    $scope.delete = function(){
        document.getElementById("overlay").style.display = "block";
        let httpCallback = function(response){
            $scope.init();
        };
        httpDeleteAsync("../../web/services/resource/Employee", {'id':$scope.toDelete}, httpCallback);
    };

    $scope.uploadFile  = function(){
        document.getElementById("overlay").style.display = "block";
        var file = $scope.empFile;
        var formData = new FormData();
        formData.append("inputFile", file);
        let httpCallback = function(response){
            $scope.$apply(function(){
                $scope.init();
            });
        };
        httpBinPostAsync("../../web/upload/distriService/uploadEmployees", formData, httpCallback);
    };

    $scope.init = function(){
        document.getElementById("overlay").style.display = "block";
        let httpCallback = function(response){
            let res = JSON.parse(response);
            
            $scope.$apply(function(){
                $scope.data.employees = res;
                document.getElementById("overlay").style.display = "none";
            });
        };
        httpGetAsync("../../web/services/resource/Employee", {}, httpCallback);
    };

    $scope.init();
});

mgmEmpApp.directive('fileModel', ['$parse', function ($parse) {
    return {
       restrict: 'A',
       link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;
          
          element.bind('change', function() {
             scope.$apply(function() {
                modelSetter(scope, element[0].files[0]);
             });
          });
       }
    };
 }]);

mgmEmpApp.directive('datepicker', function() {
    return {
       restrict: 'A',
       require: 'ngModel',
       compile: function() {
          return {
             pre: function(scope, element, attrs, ngModelCtrl) {
                var format, dateObj;
                format = (!attrs.dpFormat) ? 'd/m/yyyy' : attrs.dpFormat;
                if (!attrs.initDate && !attrs.dpFormat) {
                   // If there is no initDate attribute than we will get todays date as the default
                   dateObj = new Date();
                   scope[attrs.ngModel] = dateObj.getDate() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getFullYear();
                } else if (!attrs.initDate) {
                   // Otherwise set as the init date
                   scope[attrs.ngModel] = attrs.initDate;
                } else {

                }
                // Initialize the date-picker
                $(element).datepicker({
                   format: format,
                }).on('changeDate', function(ev) {
                   // To me this looks cleaner than adding $apply(); after everything.
                   scope.$apply(function () {
                      ngModelCtrl.$setViewValue(ev.format(format));
                   });
                });
             }
          }
       }
    }
 });