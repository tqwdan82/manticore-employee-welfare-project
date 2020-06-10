const dbUtil = require('../../../server/util/utilsDB');

const find = function(id, list, listkey){
    for(let idx = 0; idx < list.length; idx++){
        let i = list[idx];
        if(i[listkey] === id){
            return i;
        }
    }
    return null;
};

const validate = function(inputs){
    let table = inputs.modelDef;
    let data = inputs.inputData;

    let errorMessages = [];
    for( let key in table.rawAttributes ){
        let type = table.rawAttributes[key].type.key;


        if(!!dbUtil.validate[type]
            && (key !== 'createdAt' 
                && key !== 'updatedAt'
                && key !== 'deletedAt')){
            if(!dbUtil.validate[type](data[key]))
                errorMessages.push(key +" is a " + type + " type");
        }
        
    }
    return errorMessages;
};

const operation = {
    loadOperation: function(serviceManager, inputs, callback, mcHeader){

        let inputModelName = 'ItemIssue';
        if(Array.isArray(inputs) && inputs.length > 0){

            let creates = [];
            let sendToCreate = true;
            inputs.forEach(input =>{
                let create = {
                    'model': inputModelName,
                    'data':input,
                    'type':'create'
                }
                creates.push(create);
            });
            if(!sendToCreate){
                //return failure
                let returnData = {};
                returnData["status"] = "Fail";
                returnData["details"] = "One or more records do not have id/key provided";

                callback(returnData);
            }else{
                let processCallback = function(data){
                    callback(data);
                };
                serviceManager.callDBOperation.transact(creates, processCallback, mcHeader);
            }

        } else if(typeof inputs === 'object'){

            //perform update action
            let processCallback = function(data){

                let getEmpCallback = function(gecRes){
                    let empsData = gecRes.data;

                    let getItemCallback = function(gicRes){
                        let itemsData = gicRes.data;

                        let item = find(inputs.ItemID, itemsData, 'id');
                        let emp = find(inputs.EmpID, empsData, 'id');

                        let sendTelegramCallback = function(tData){
                            callback(data);
                        }
                        console.log(inputs)
                        let message = "Dear " + emp.EmpName + ", " + "you have been issued " + inputs.Count +" "+ item.ItemName +". Please acknowledge on the Employee Welfare App and proceed to collect from our Admin Officers. Thank you."
                        serviceManager.callOperation("telegramConn","telegram-connector","sendMessage", {"message":message}, sendTelegramCallback, mcHeader);

                    }
                    serviceManager.callOperation('resource', 'Item','findOperation', {inputCriteria:{}}, getItemCallback,mcHeader);
                }
                serviceManager.callOperation('resource', 'Employee','findOperation', {inputCriteria:{}}, getEmpCallback,mcHeader);

               
                
            };
            serviceManager.callDBOperation.create(inputModelName, inputs, processCallback, mcHeader);

        }
        // let table = serviceManager.callDBOperation.getModel(inputModelName);
        // //let errors = validate({'modelDef':table, 'inputData':inputs})

        // let processCallback = function(data){
        //     callback(data);
        // };

        // // if(errors.length === 0)
        //     serviceManager.callDBOperation.create(inputModelName, inputs, processCallback, mcHeader);
    }
}
module.exports = operation;