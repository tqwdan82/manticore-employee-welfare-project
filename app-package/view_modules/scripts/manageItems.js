var mgmItemApp = angular.module('mgmItemApp', []);
mgmItemApp.controller('mgmItemCtrl', function($scope) {
    $scope.data = {
        items:[],
        replenishCount:0,
        reduceCount:0
    };
    $scope.toDelete='';
    $scope.toReplenish='';
    $scope.toReduce='';
    $scope.itemHistory = [];

    $scope.deleting = function(id){
        $scope.toDelete=id;
    };

    $scope.delete = function(){
        document.getElementById("overlay").style.display = "block";
        let httpCallback = function(response){
            $scope.init();
        };
        httpDeleteAsync("../../web/services/resource/Item", {'id':$scope.toDelete}, httpCallback);
    };

    $scope.setReplenishPointer = function(itemId){
        $scope.toReplenish = itemId;
    };

    $scope.replenish = function(){
        
        document.getElementById("overlay").style.display = "block";
        let searchCallback = function(response){
            let resList = JSON.parse(response);
            let res = resList[0];
            if(typeof res !== 'undefined'){
                let finalStockCount = parseFloat(res.ItemCount) + parseFloat($scope.data.replenishCount);
                res.ItemCount = finalStockCount;
                let updateItemCallback = function(uiResponse){
                    let responseCallback = function(mvRes){
                        
                        $scope.$apply(function(){
                            $scope.data.items.forEach(function(item){
                                if(item.id === $scope.toReplenish){
                                    item.ItemCount = finalStockCount;
                                }
                            });
                            document.getElementById("overlay").style.display = "none";
                        });

                    }

                    let itemMove = {
                        'ItemId': $scope.toReplenish,
                        'StockMovementType':"REPLENISH",
                        'StockMovementCount':$scope.data.replenishCount
                    }
                    httpPostAsync("../../web/services/resource/ItemStock", itemMove, responseCallback);
                }
                httpPutAsync("../../web/services/resource/Item", res, updateItemCallback);
            }else{

                document.getElementById("overlay").style.display = "none";
            }
        };

        httpGetAsync("../../web/services/resource/Item?id="+$scope.toReplenish, {}, searchCallback);
    };

    $scope.setReductionPointer = function(itemId){
        $scope.toReduce = itemId;
    };

    $scope.reduce = function(){
        
        document.getElementById("overlay").style.display = "block";
        let searchCallback = function(response){
            let resList = JSON.parse(response);
            let res = resList[0];
            if(typeof res !== 'undefined'){
                let finalStockCount = parseFloat(res.ItemCount) - parseFloat($scope.data.reduceCount);
                
                if(finalStockCount < 0){
                    document.getElementById("overlay").style.display = "none";
                    $('#reduceErrorModal').modal('show');
                    return;
                }
                
                res.ItemCount = finalStockCount;
                let updateItemCallback = function(uiResponse){
                    let responseCallback = function(mvRes){
                        
                        $scope.$apply(function(){
                            $scope.data.items.forEach(function(item){
                                if(item.id === $scope.toReduce){
                                    item.ItemCount = finalStockCount;
                                }
                            });
                            document.getElementById("overlay").style.display = "none";
                        });

                    }

                    let itemMove = {
                        'ItemId': $scope.toReduce,
                        'StockMovementType':"REDUCTION",
                        'StockMovementCount':$scope.data.reduceCount
                    }
                    httpPostAsync("../../web/services/resource/ItemStock", itemMove, responseCallback);
                }
                httpPutAsync("../../web/services/resource/Item", res, updateItemCallback);
            }else{

                document.getElementById("overlay").style.display = "none";
            }
        };
        httpGetAsync("../../web/services/resource/Item?id="+$scope.toReduce, {}, searchCallback);
    };

    $scope.getHistory = function(itemId){

        document.getElementById("modaloverlay").style.display = "block";
        $scope.itemHistory = [];
        let httpCallback = function(response){
            let res = JSON.parse(response);

            $scope.$apply(function(){
                $scope.itemHistory = res;
                document.getElementById("modaloverlay").style.display = "none";
            });
        };
        httpGetAsync("../../web/services/resource/ItemStock?ItemId="+itemId, {}, httpCallback);
    };

    $scope.init = function(){
        $scope.data = {
            items:[],
            replenishCount:0,
            reduceCount:0
        };

        document.getElementById("overlay").style.display = "block";
        let httpCallback = function(response){
            let res = JSON.parse(response);
            
            $scope.$apply(function(){
                $scope.data.items = res;
                document.getElementById("overlay").style.display = "none";
            });
        };
        httpGetAsync("../../web/services/resource/Item", {}, httpCallback);
    };

    $scope.init();
});