var collectionSP1App = angular.module('collectionSP1App', []);
collectionSP1App.controller('collectionSP1Ctrl', function($scope) {
    $scope.data = {
        multipleSelect: [],
        multipleSelectDisplay:[],
        availableOptions: [],
        signature:"",
        empInfo:{},
        allItems:[],
        empIssItems:[]
    };
    $scope.showAck = false;
    $scope.hasCollectibles = false;
    $scope.showSuccess = false;
    $scope.data.availableOptions =[];

    $scope.reflectChange = function(){
        if( $scope.data.multipleSelect.length > 0 ){
            $scope.showAck = true;
        }else{
            $scope.showAck = false;
        }
    };

    $scope.reflectSignChange = function(){
        if($scope.data.signature.length > 0){
            $scope.canAck = true;
        }else{
            $scope.canAck = false;
        }
        // console.log($scope.canAck);
    }

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


        $scope.data.multipleSelect.forEach(element => {
            $scope.data.availableOptions.forEach(option => {
                if(option.id === element)
                    $scope.data.multipleSelectDisplay.push(option.name);
            });

            $scope.data.empIssItems.forEach(empIssItem =>{
                empIssItem.Acknowledgement=$scope.data.signature;
                empIssItem.AckDate = new Date();
            });
            let updateCallback = function(data){
                // console.log(data)
                document.getElementById("overlay").style.display = "none";
            };
            httpPutAsync("../../web/services/resource/ItemIssue", $scope.data.empIssItems, updateCallback);
        });

        
        $scope.showSuccess = true;
    };

    $scope.clearSignature = function(){
        var canvas = document.getElementById("sig-canvas");
        canvas.width = canvas.width;
        $scope.data.signature = "";
    };

    $scope.init = function(){
        let sessionEmpNo = localStorage.getItem("sessionEmp");
        // $scope.data.availableOptions = [
        //     {id: '1', name: '1 x Thermometer'},
        //     {id: '2', name: '2 x Reusable Mask'},
        //     {id: '3', name: '1 x Face Shield'},
        //     {id: '4', name: '1 x Hand Sanitizer'}
        // ];
        // if( $scope.data.availableOptions.length > 0 ){
        //     $scope.hasCollectibles = true;
        // }
        let empsCallback = function(empsResponse){
            let empsRes = JSON.parse(empsResponse);
            let empRes = empsRes[0];
            $scope.data.empInfo = empRes;


            let itemsCallback = function(itemsResponse){
                let itemsRes = JSON.parse(itemsResponse);
                $scope.data.allItems = itemsRes;

                let itemIssCallback = function(itemIssResponse){
                    let itemIssRes = JSON.parse(itemIssResponse);
                    $scope.data.empIssItems = itemIssRes;
                    $scope.$apply(function(){
                        itemIssRes.forEach(itemIss => {
                            if(itemIss.OfficerAck === null 
                                && itemIss.AckDate === null ){
                                let itemString = '';
                                for(let idx = 0; idx <itemsRes.length; idx++){
                                    let item = itemsRes[idx];
                                    if(item.id === itemIss.ItemID){
                                        itemString = item.ItemName;
                                        break;
                                    }
                                }

                                $scope.data.availableOptions.push({
                                    'id':itemIss.id,
                                    'name': itemIss.Count+' x ' +itemString
                                });
                            }
                        });
                        if( $scope.data.availableOptions.length > 0 ){
                            $scope.hasCollectibles = true;
                        }else{
                            $scope.hasCollectibles = false;
                        }
                        
                    });
                }
                    
                httpGetAsync("../../web/services/resource/ItemIssue?EmpID="+empRes.id, {}, itemIssCallback);
            }
            httpGetAsync("../../web/services/resource/Item", {}, itemsCallback);
            
        }

        httpGetAsync("../../web/services/resource/Employee?EmpID="+sessionEmpNo, {}, empsCallback);
    };

    

    $scope.init();
});