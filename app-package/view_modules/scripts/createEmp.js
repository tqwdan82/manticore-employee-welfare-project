var crtEmpApp = angular.module('crtEmpApp', []);
crtEmpApp.controller('crtEmpCtrl', function($scope) {
    $scope.data = {
        EmpID:'',
        EmpName:'',
        EmpDep:'',
        EmpStartDate:'',
        EmpEndDate:'',
        EmpContact:''
    }

    $scope.create = function(){
        document.getElementById("overlay").style.display = "block";
        let httpCallback = function(response){
            $scope.data = {
                EmpID:'',
                EmpName:'',
                EmpDep:'',
                EmpStartDate:'',
                EmpEndDate:'',
                EmpContact:''
            }
            document.getElementById("overlay").style.display = "none";
            window.location.href = '/web?action=manageEmp';
        };
        if($scope.data.EmpStartDate === '') delete $scope.data.EmpStartDate;
        if($scope.data.EmpEndDate === '') delete $scope.data.EmpEndDate;
        httpPostAsync("../../web/services/resource/Employee", $scope.data, httpCallback);
    };

    $scope.init = function(){
        $scope.data = {
            EmpID:'',
            EmpName:'',
            EmpDep:'',
            EmpStartDate:'',
            EmpEndDate:'',
            EmpContact:''
        }
    };

    $scope.init();
});

crtEmpApp.directive('datepicker', function() {
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