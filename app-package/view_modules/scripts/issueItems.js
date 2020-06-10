// let find = function(id, list, listkey){
//     for(let idx = 0; idx < list.length; idx++){
//         let i = list[idx];
//         if(i[listkey] === id){
//             return i;
//         }
//     }
//     return null;
// };

// let findAll = function(id, list, listkey){
//     let returnList = [];
//     for(let idx = 0; idx < list.length; idx++){
//         let i = list[idx];
//         if(i[listkey] === id){
//             returnList.push(i);
//         }
//     }
//     return returnList;
// };

var issueItemApp = angular.module('issueItemApp', []);
issueItemApp.controller('issueItemCtrl', function($scope) {
    $scope.data = {
        allEmployees:[],
        allItems:[],
        allIssues:[]
    };
    $scope.new = {
        ItemID:'',
        EmpID:'',
        Count:'',
        Remarks:''
    };
    let dateObj = new Date();
    $scope.editing = {
        'id':'',
        'itemName':'',
        'empName':'',
        'count':'',
        'issueDate':dateObj.getFullYear() +'-'+(dateObj.getMonth() + 1)+'-'+dateObj.getDate() ,
        'assistEmpID':'',
        'issueNow':false,
        'collectType':'Self',
        'assistCollection':false,
        'remarks':""
    };
    $scope.filteredList = [];
    $scope.filterType = '';
    $scope.filterValue = '';
    $scope.toDelete='';

    $scope.reflectCollectionTypeChange = function(){
        if($scope.editing.collectType === 'Assist'){
            $scope.editing.assistCollection = true;
        }else{
            $scope.editing.assistCollection = false;
        }
    };

    $scope.reflectChange = function(){
        // console.log($scope.filterType)
        // console.log($scope.filterValue)
        $scope.filteredList = [];
        if($scope.filterType === 'Employee Number'
            && $scope.filterValue !== ''){ // filter by emp id
            
            $scope.data.allIssues.forEach(issue => {
                if(issue.empID.includes($scope.filterValue)){
                    $scope.filteredList.push(issue);
                }
            });

        }else if($scope.filterType === 'Item'
            && $scope.filterValue !== ''){ // filter by item name

            $scope.data.allIssues.forEach(issue => {
                if(issue.itemName.includes($scope.filterValue)){
                    $scope.filteredList.push(issue);
                }
            });

        }else{
            $scope.filteredList = $scope.data.allIssues;
        }
    }

    $scope.create = function(){
        document.getElementById("overlay").style.display = "block";
        let httpCallback = function(itemResponse){
            $scope.init();
        };
        httpPostAsync("../../web/services/resource/ItemIssue", $scope.new, httpCallback);
    };

    $scope.deleting = function(id){
        $scope.toDelete=id;
    };

    $scope.delete = function(){
        document.getElementById("overlay").style.display = "block";
        let httpCallback = function(response){
            $scope.init();
        };
        httpDeleteAsync("../../web/services/resource/ItemIssue", {'id':$scope.toDelete}, httpCallback);
    };

    $scope.edit = function(id){
        document.getElementById("overlay").style.display = "block";
        let httpCallback = function(itemIssueResponse){
            let issItemResList  = JSON.parse(itemIssueResponse);
            let issItemRes = {};
            if(issItemResList.length > 0){
                issItemRes = issItemResList[0];
            }
            let emp = find(issItemRes.EmpID, $scope.data.allEmployees, 'id');
            let item = find(issItemRes.ItemID, $scope.data.allItems, 'id');
            $scope.$apply(function(){
                $scope.editing.id = issItemRes.id;
                $scope.editing.itemName = item.ItemName,
                $scope.editing.empName = emp.EmpName + '('+emp.EmpID+')';
                $scope.editing.count = issItemRes.Count;      
                $scope.editing.remarks = issItemRes.Remarks;

                $scope.editing.empAcked = false;
                if(issItemRes.AckDate !== null){
                    $scope.editing.empAcked = true;
                }
            });

            document.getElementById("overlay").style.display = "none";
        };
        httpGetAsync("../../web/services/resource/ItemIssue?id="+id, {}, httpCallback);
    };

    $scope.acknowledge = function(id){
        document.getElementById("overlay").style.display = "block";
        let httpCallback = function(itemIssueResponse){
            let currDate = new Date();
            let issItemResList  = JSON.parse(itemIssueResponse);
            let issItemRes = {};
            if(issItemResList.length > 0){
                issItemRes = issItemResList[0];
            }
            issItemRes.OfficerAck = "<logged in admin>";
            issItemRes.OfficerAckDate = currDate;
            let updateCallback = function(updateResponse){
                $scope.init();
            }
            httpPutAsync("../../web/services/resource/ItemIssue", issItemRes, updateCallback);
        };
        httpGetAsync("../../web/services/resource/ItemIssue?id="+id, {}, httpCallback);
    };

    $scope.update = function(){
        // console.log($scope.editing);
        let currDate = new Date();
        document.getElementById("overlay").style.display = "block";
        let httpCallback = function(itemIssueResponse){
            let issItemResList  = JSON.parse(itemIssueResponse);
            let issItemRes = {};
            if(issItemResList.length > 0){
                issItemRes = issItemResList[0];
            }

            issItemRes.Count = parseFloat($scope.editing.count);
            if($scope.editing.issueNow){
                
                if($scope.editing.collectType === 'Assist'){
                    issItemRes.OnBehalfEmpID = $scope.editing.assistEmpID;
                    issItemRes.Acknowledgement = $scope.editing.assistEmpID;
                    issItemRes.AckDate = currDate;
                }else if($scope.editing.collectType === 'Self'){

                    issItemRes.Acknowledgement =issItemRes.EmpID;
                    issItemRes.AckDate = currDate;
                }

                issItemRes.OfficerAck = "<logged in admin>";
                issItemRes.OfficerAckDate = currDate;
            }
            issItemRes.Remarks = $scope.editing.remarks;
            
            let updateCallback = function(updateResponse){
                $scope.init();
            }
            httpPutAsync("../../web/services/resource/ItemIssue", issItemRes, updateCallback);
        }
        httpGetAsync("../../web/services/resource/ItemIssue?id="+$scope.editing.id, {}, httpCallback);
    };

    $scope.uploadFile  = function(){
        document.getElementById("overlay").style.display = "block";
        var file = $scope.issFile;
        var formData = new FormData();
        formData.append("inputFile", file);
        let httpCallback = function(response){
            $scope.$apply(function(){
                $scope.init();
            });
        };
        httpBinPostAsync("../../web/upload/distriService/uploadIssueItem", formData, httpCallback);
    };

    $scope.init = function(){
        document.getElementById("overlay").style.display = "block";
        let empCallback = function(empResponse){
            let empRes = JSON.parse(empResponse);

            let itemCallback = function(itemResponse){
                let itemRes = JSON.parse(itemResponse);

                let itemIssueCallback = function(itemIssueResponse){
                    
                    let itemIssueRes = JSON.parse(itemIssueResponse);

                    $scope.data.allIssues = [];
                    itemIssueRes.forEach(function(itemIss){
                        let emp = find(itemIss.EmpID, empRes, 'id');
                        let item = find(itemIss.ItemID, itemRes, 'id');
                        let obEmp = find(itemIss.OnBehalfEmpID, empRes, 'id');
                        let offEmp = find(itemIss.OfficerAck, empRes, 'id');

                        //check if employee acked
                        let empAcked = false;
                        if(itemIss.AckDate !== null){
                            empAcked = true;
                        }

                        //get the collection type based on the on behalf data
                        let collType = '';
                        if(obEmp === null ){
                            collType = 'Self';
                        }else if(obEmp !== null ){
                            collType = 'Assist ('+obEmp.EmpName+')';
                        }
                        
                        // create a collected status for easy display
                        // let collected = false;
                        // console.log(itemIss.AckDate)
                        // if(itemIss.AckDate !== null && typeof itemIss.AckDate !== 'undefined' && itemIss.AckDate !== '') {
                        //     collected = true;
                        // }
                        // console.log(collected)
                        
                        //check if officer acked
                        let offAcked = false;
                        if(offEmp !== null ){
                            offAcked = true;
                        }else if(offEmp === null && (itemIss.OfficerAck !== null && typeof itemIss.OfficerAck !== 'undefined' && itemIss.OfficerAck.trim().length > 0)){
                            offAcked = true;
                        }
                        
                        $scope.data.allIssues.push({
                            'id': itemIss.id,
                            'empID': emp.EmpID,
                            'itemName':item.ItemName,
                            'empName': emp.EmpName + '('+emp.EmpID+')',
                            'itemName': item.ItemName,
                            'count':itemIss.Count,
                            'collectType': collType,
                            'collectDate': offAcked ? itemIss.OfficerAckDate : '',
                            'isCollected': offAcked,
                            'remarks':itemIss.Remarks,
                            'empAcked': empAcked
                        })

                        $scope.filteredList = $scope.data.allIssues;
                    });

                    $scope.$apply(function(){
                        $scope.data.allEmployees = empRes;
                        $scope.data.allItems = itemRes;
                        $scope.editing = {
                            'id':'',
                            'itemName':'',
                            'empName':'',
                            'count':'',
                            'issueDate':dateObj.getFullYear() +'-'+(dateObj.getMonth() + 1)+'-'+dateObj.getDate() ,
                            'assistEmpID':'',
                            'issueNow':false,
                            'collectType':'Self',
                            'assistCollection':false,
                            'remarks':""
                        };
                    });
                    document.getElementById("overlay").style.display = "none";
                };
                httpGetAsync("../../web/services/resource/ItemIssue", {}, itemIssueCallback);

            };
            httpGetAsync("../../web/services/resource/Item", {}, itemCallback);
            
        };
        httpGetAsync("../../web/services/resource/Employee", {}, empCallback);
    };

    $scope.init();
});

issueItemApp.directive('fileModel', ['$parse', function ($parse) {
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

issueItemApp.directive('datepicker', function() {
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