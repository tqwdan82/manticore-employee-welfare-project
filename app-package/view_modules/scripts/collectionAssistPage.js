var collectionAPApp = angular.module('collectionAPApp', []);
collectionAPApp.controller('collectionAPCtrl', function($scope) {
    $scope.data = {
        allEmployees:[],
        allItems:[],
        allIssItems:[],
        issueItems: [],
        availableOptions: [],
        multipleSelect:[],
        multipleSelected:{},
        signature:'',
        employeeNo:''
    };
    $scope.inputEmpNo="";
    $scope.showSelection = false;
    $scope.showAcknowledge = false;
    $scope.showContinue = false;
    $scope.showSuccess = false;
    
    $scope.refreshList = function(){
        $scope.data.availableOptions = [];
        if($scope.inputEmpNo === '') $scope.data.availableOptions = [];
        else{
            let issKeys = Object.keys($scope.data.issueItems);
            issKeys.forEach(key => {
                if(key.includes($scope.inputEmpNo)){
                    let persItem = $scope.data.issueItems[key];
                    persItem.items.forEach(item =>{
                        let name = item.name + ' (' + persItem.name + ")";
                        let id = key+"_"+item.id;
                        $scope.data.availableOptions.push({'id':id, 'name':name});
                    });
                }
            });
        }

        if($scope.data.availableOptions.length > 0) 
            $scope.showSelection = true;
        else 
            $scope.showSelection = false;
    };

    $scope.addItems = function(){

        $scope.data.multipleSelect.forEach(id => {
            let idSections = id.split("_");
            let empNo = idSections[0];
            let empItemId = idSections[1];
            let empStuffs = $scope.data.issueItems[empNo];
            empStuffs.items.forEach(item => {
                if(item.id === empItemId){
                    $scope.data.multipleSelected[item.id] = item.name + '<br/>' + empStuffs.name +'[' + empNo + ']';
                }
            });
        });
        $scope.showContinue = (Object.keys($scope.data.multipleSelected).length > 0);
        $scope.inputEmpNo = '';
        $scope.refreshList();
    };

    $scope.deleteItem = function(key){
        delete $scope.data.multipleSelected[key];
        $scope.showContinue = (Object.keys($scope.data.multipleSelected).length > 0);
    };

    $scope.continue = function(){
        if(Object.keys($scope.data.multipleSelected).length >0)
            $scope.showAcknowledge = true;
        else
            $scope.showAcknowledge = false;
    };

    $scope.cancelAck = function(){
        $scope.showAcknowledge = false;
    };

    $scope.clearSignature = function(){
        var canvas = document.getElementById("sig-canvas");
        canvas.width = canvas.width;
        $scope.data.signature = "";
    };

    function isCanvasBlank(canvas) {
        const context = canvas.getContext('2d');
      
        const pixelBuffer = new Uint32Array(
          context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
        );
      
        return !pixelBuffer.some(color => color !== 0);
    }
    
    $scope.acknowledge = function(){
        
        var canvas = document.getElementById("sig-canvas");
        
        if(isCanvasBlank(canvas)){
            $('#invalidAckModal').modal('show');
            return;
        }
        $scope.data.signature = canvas.toDataURL();
        document.getElementById("overlay").style.display = "block";

        //TODO
        let updateList = [];
        let currDate = new Date();
        Object.keys($scope.data.multipleSelected).forEach(key => {
            let selectedItem = find(key, $scope.data.allIssItems, 'id');
            let meEmp = find($scope.data.employeeNo, $scope.data.allEmployees, 'EmpID');
            selectedItem.AckDate = currDate;
            selectedItem.Acknowledgement = $scope.data.signature;
            selectedItem.OnBehalfEmpID = meEmp.id;
            updateList.push(selectedItem);
        });

        let updateCallback = function(data){
            document.getElementById("overlay").style.display = "none";
        };
        httpPutAsync("../../web/services/resource/ItemIssue", updateList, updateCallback);        
        $scope.showSuccess = true;
    };

    $scope.init = function(){
        document.getElementById("overlay").style.display = "block";
        $scope.data.employeeNo = localStorage.getItem("sessionEmp");
        
        let httpCallback = function(response){
            let res = JSON.parse(response);
            $scope.$apply(function(){
                $scope.data.allEmployees = res.allEmployees;
                $scope.data.allItems = res.allItems;
                $scope.data.allIssItems = res.allIssItems;
                $scope.data.issueItems = res.allEmpIssItems;
            });
            document.getElementById("overlay").style.display = "none";
        };
        httpGetAsync("../../web/services/distriService/getAllIssueItem?exclude="+$scope.data.employeeNo, {}, httpCallback);
    };

    $scope.init();

});

collectionAPApp.filter('html', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);