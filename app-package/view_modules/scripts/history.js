var historyApp = angular.module('historyApp', []);
historyApp.controller('historyCtrl', function($scope) {
    $scope.data = {
        allEmployees:[],
        allItems:[],
        history:[],
        displayPendingHistory:[],
        displayPastHistory:[]
    };
    $scope.inputEmpNo = "";
    $scope.init = function(){
        document.getElementById("overlay").style.display = "block";
        let sessionEmpNo = localStorage.getItem("sessionEmp");
        if(typeof sessionEmpNo === 'undefined' || sessionEmpNo === '' || sessionEmpNo === 'undefined'){
            $scope.inputEmpNo = "";
        }else{
            $scope.inputEmpNo = sessionEmpNo;

            let empCallback = function(empResponse){
                let empRes = JSON.parse(empResponse);
                $scope.data.allEmployees = empRes;
                let emp = find($scope.inputEmpNo, $scope.data.allEmployees, 'EmpID');

                let itemCallback = function(itemResponse){
                    let itemRes = JSON.parse(itemResponse);
                    $scope.data.allItems= itemRes;

                    let empItemIssueCallback = function(itemIssueResponse){
                        let itemIssueRes = JSON.parse(itemIssueResponse);
                        $scope.data.history = $scope.data.history.concat(itemIssueRes);

                        let assistItemIssueCallback = function(aitemIssueResponse){
                            let aitemIssueRes = JSON.parse(aitemIssueResponse);
                            $scope.data.history = $scope.data.history.concat(aitemIssueRes);

                            $scope.$apply(function(){
                                $scope.data.history.forEach(history =>{
                                    let disHistory = {};
                                    //ack / not ack
                                    if(history.AckDate !==null){
                                        let collectForOthers = false;
                                        disHistory.ackDate = history.AckDate;
                                        console.log(typeof history.AckDate);
                                        //collection type
                                        if(history.OnBehalfEmpID === null
                                            && history.EmpID === emp.id){ //self collection

                                            disHistory.badge = 'fa-hand-paper';
                                            //item text
                                            let item = find(history.ItemID, $scope.data.allItems, 'id');
                                            disHistory.text = history.Count + ' x ' + item.ItemName;

                                        }else if(history.OnBehalfEmpID !== null
                                            && history.EmpID === emp.id){ //assist self collection

                                            disHistory.badge = 'fa-hands-helping';
                                            //item text
                                            let item = find(history.ItemID, $scope.data.allItems, 'id');
                                            let aemp = find(history.OnBehalfEmpID, $scope.data.allEmployees, 'id');
                                            disHistory.text = history.Count + ' x ' + item.ItemName +'<br/> By '+ aemp.EmpName + "(" + aemp.EmpID + ")";;

                                        }else{ // assist collection

                                            disHistory.badge = 'fa-hands-helping';
                                            //item text
                                            let item = find(history.ItemID, $scope.data.allItems, 'id');
                                            let aemp = find(history.EmpID, $scope.data.allEmployees, 'id');
                                            disHistory.text = " " + history.Count + ' x ' + item.ItemName +'<br/> For '+ aemp.EmpName + "(" + aemp.EmpID + ")";
                                            collectForOthers= true;
                                        }

                                        //collected / pending
                                        if(history.OfficerAckDate === null){//pending
                                            disHistory.recordBg = 'bg-danger'
                                            disHistory.badgeBg = 'badge-danger'
                                            disHistory.collected = false;
                                            
                                        }else{ //collected
                                            disHistory.recordBg = 'bg-secondary'
                                            disHistory.badgeBg = 'badge-secondary';
                                            disHistory.collected = true;
                                            disHistory.collectDate = history.OfficerAckDate;
                                        }

                                        if(collectForOthers && history.OfficerAckDate !== null){ //collect for others and has collected
                                            disHistory.recordBg = 'bg-dark'
                                            disHistory.badgeBg = 'badge-dark';
                                        }
                                        if(!disHistory.collected)
                                            $scope.data.displayPendingHistory.push(disHistory);
                                        else
                                            $scope.data.displayPastHistory.push(disHistory);
                                    }
                                })

                            });

                            
                            document.getElementById("overlay").style.display = "none";
                        };
                        httpGetAsync("../../web/services/resource/ItemIssue?OnBehalfEmpId="+ emp.id, {}, assistItemIssueCallback);
                    
                    };
                    httpGetAsync("../../web/services/resource/ItemIssue?EmpID="+ emp.id, {}, empItemIssueCallback);
    
                };
                httpGetAsync("../../web/services/resource/Item", {}, itemCallback);
                
            };
            httpGetAsync("../../web/services/resource/Employee", {}, empCallback);
        }

        
        
    };

    $scope.init();
});


historyApp.filter('html', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);