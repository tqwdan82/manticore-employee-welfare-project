const getKeyName = function(inputs){
    let table = inputs.modelDef;

    let dataPrimarykey;
    for( let key in table.rawAttributes ){
        let attrData = table.rawAttributes[key];
        if(typeof attrData.primaryKey !== 'undefined'
            && attrData.primaryKey){
                dataPrimarykey = key;
                break;
        }        
    }
    return dataPrimarykey;
};

const operation = {
    loadOperation: function(serviceManager, inputs, callback, mcHeader){

        let inputModelName = 'ItemStock';
        let table = serviceManager.callDBOperation.getModel(inputModelName);
        let key = getKeyName({'modelDef':table, 'inputData':inputs})

        // check if input data has key
        if(typeof key === 'undefined'){// no key

            let returnData = {};
            returnData["status"] = "Fail";
            returnData["details"] = "No id/key is provided";

            callback(returnData);

        }else{ // has key

            let deleteCallback = function(deleteData){
                console.log(deleteData);
                callback(deleteData);
            };

            let query = {}, queryCriteria = {};
            query[key] = inputs[key];
            queryCriteria.where = query;
            serviceManager.callDBOperation.delete(inputModelName, queryCriteria, deleteCallback, mcHeader);
        }

    }
}
module.exports = operation;