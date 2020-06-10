//private method to find out what is the primary key 
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
        if(typeof key === 'undefined'){ //does not have key

            //return failure
            let returnData = {};
            returnData["status"] = "Fail";
            returnData["details"] = "No id/key is provided";

            callback(returnData);

        }else{ // have key

            //perform update action
            let processCallback = function(data){
                callback(data);
            };
            let query = {};
            query[key] = inputs[key];
            serviceManager.callDBOperation.update(inputModelName, query, inputs, processCallback, mcHeader);
        }

    }
}
module.exports = operation;