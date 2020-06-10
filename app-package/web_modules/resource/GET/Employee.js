/** 
 * 
 **/

//server libraries
// const utils = require('../../../../../server/util/utils.js');
// const logger = utils.logger() // logger object

//operation object
const operation = {
    details : {
        description: "Standard retrieve operation for Employee"
    },
    /** 
     * 
     * Header configuration requirement
     * modify this based on the requirements
     * 
     * 
    */
    headerConfig : {},
    /** 
     * 
     * Input data validation
     * modify this based on the requirements
     * 
     * 
    */
    inputValidation : function(data)
    {
        var check = true;
        return check;
    },
    //operation object
    loadWebOperation: function(serviceManager, httpObj)
    {
        //operation implementation
        
        /** 
         * 
         * OPERATION IMPLEMENTATION STARTS HERE
         * 
         * 
        */
        
        let resourceName = 'Employee';

        var handler = function(response){
            httpObj.responseData = {"data":response.data}; //set the response data
            httpObj.completeHttpResponse(httpObj); // respond to the http call   
        }

        let inCrit = {};
        //check if there is any input criteria for query
        if(typeof httpObj.request.body !== 'undefined'
            && Object.keys(httpObj.request.body).length > 0)
        { // if there is input query
            inCrit.where = httpObj.request.body;
        }

        //check if there is any input criteria for limit
        if(typeof httpObj.request.query.limit !== 'undefined'
            && /^\+?\d+$/.test(httpObj.request.query.limit))
        { // if there is input limit
            inCrit.limit = parseInt(httpObj.request.query.limit, 10);
        }

        //check if there is any input criteria for offset
        if(typeof httpObj.request.query.offset !== 'undefined'
            && /^\+?\d+$/.test(httpObj.request.query.offset))
        { // if there is input offset
            inCrit.offset = parseInt(httpObj.request.query.offset, 10);
        }

       //check if there is any input criteria for order
        if(typeof httpObj.request.query.order !== 'undefined')
        { // if there is input order
            let orderByGrps = httpObj.request.query.order.split(",");
            let orderByArrays = [];
            
            for(let ogi = 0; ogi < orderByGrps.length; ogi++){
                let orderByGrp = orderByGrps[ogi];
                let orderByArray = orderByGrp.split("-");
                orderByArrays.push(orderByArray);
            }

            inCrit.order = orderByArrays;
        }

        //check for other input criteria
        if(typeof inCrit.where === 'undefined') inCrit.where = {};
        Object.keys(httpObj.request.query).forEach(key => {
            if(key !== 'limit' || key !== 'offset' || key !== 'order' || key !== 'attributes'){
                if(typeof inCrit.where[key] === 'undefined'
                    && Array.isArray( httpObj.request.query[key])){

                    inCrit.where[key] = httpObj.request.query[key];

                }else if(typeof inCrit.where[key] === 'undefined'
                    && !Array.isArray( httpObj.request.query[key])){

                    inCrit.where[key] = [httpObj.request.query[key]];

                }else if(Array.isArray( httpObj.request.query[key])){

                    inCrit.where[key].concat(httpObj.request.query[key]);

                }else if(!Array.isArray( httpObj.request.query[key])){

                    inCrit.where[key].push(httpObj.request.query[key]);
                }
            }
        });

        serviceManager.callOperation("resource", resourceName, "findOperation", 
                                        {inputCriteria:inCrit}, handler, httpObj.request.mcHeader);
        /** 
         * 
         * OPERATION IMPLEMENTATION ENDS HERE
         * 
         * 
        */
    }
    
}

module.exports = {
    operation:operation
};
