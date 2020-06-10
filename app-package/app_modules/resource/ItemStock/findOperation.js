const operation = {
    loadOperation: function(serviceManager, inputs, callback, mcHeader){

        let processCallback = function(data){
            callback(data);
        };
        
        let inputModelName = 'ItemStock';
        let modelDescr = serviceManager.callDBOperation.getModel(inputModelName);

        let queryCriteria = {
            where:{},
        };

        //limit criteria
        if( typeof inputs.inputCriteria !== "undefined"
            && typeof inputs.inputCriteria.limit !== "undefined"
            && typeof inputs.inputCriteria.limit === "number")
        {// if there is a limit passed in
            queryCriteria.limit = inputs.inputCriteria.limit;
        }

        //offset criteria
        if(typeof inputs.inputCriteria !== "undefined"
            && typeof inputs.inputCriteria.offset !== "undefined"
            && typeof inputs.inputCriteria.offset === "number")
        {// if there is a offset passed in
            queryCriteria.offset = inputs.inputCriteria.offset;
        }

        //order criteria
        if(typeof inputs.inputCriteria !== "undefined"
            && typeof inputs.inputCriteria.order !== "undefined"
            && Array.isArray(inputs.inputCriteria.order))
        {// if there is a order passed in
            queryCriteria.order = inputs.inputCriteria.order;
        }

        //group criteria
        if(typeof inputs.inputCriteria !== "undefined"
            && typeof inputs.inputCriteria.group !== "undefined"
            && typeof inputs.inputCriteria.group === "string")
        {// if there is a order passed in
            queryCriteria.order = inputs.inputCriteria.order;
        }

        if(typeof inputs.inputCriteria !== "undefined"
            && typeof inputs.inputCriteria.attributes !== "undefined"
            && Array.isArray(inputs.inputCriteria.attributes))
        {
            // validate against modelDescr
            //TODO: implement validate
            
            queryCriteria.attributes = inputs.inputCriteria.attributes;
        }

        if(typeof inputs.inputCriteria !== "undefined"
            && typeof inputs.inputCriteria.where !== "undefined")
        {            
            queryCriteria.where = inputs.inputCriteria.where;
        }

        serviceManager.callDBOperation.query(inputModelName, queryCriteria, processCallback, mcHeader);
    }
}
module.exports = operation;