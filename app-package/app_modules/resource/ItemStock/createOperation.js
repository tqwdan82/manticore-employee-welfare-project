const dbUtil = require('../../../server/util/utilsDB');

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

        let inputModelName = 'ItemStock';
        let table = serviceManager.callDBOperation.getModel(inputModelName);
        //let errors = validate({'modelDef':table, 'inputData':inputs})

        let processCallback = function(data){
            callback(data);
        };

        // if(errors.length === 0)
            serviceManager.callDBOperation.create(inputModelName, inputs, processCallback, mcHeader);
    }
}
module.exports = operation;