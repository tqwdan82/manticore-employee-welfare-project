/** 
 * 
 **/
const fs = require('fs');
const csv = require('csv-parser');

const find = function(id, list, listkey){
    for(let idx = 0; idx < list.length; idx++){
        let i = list[idx];
        if(i[listkey] === id){
            return i;
        }
    }
    return null;
};
//server libraries
// const utils = require('../../../../../server/util/utils.js');
// const logger = utils.logger() // logger object

//operation object
const operation = {
    details : {
        description: "Get all item issue records grouped by Employees"
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


       var handler = function(response){
            httpObj.responseData = {"data":response}; //set the response data
            httpObj.completeHttpResponse(httpObj); // respond to the http call   
        }

        const file = httpObj.request.file
        let inputDatas = [];

        let itemsHandler = function(iresponse){
            let allItems = iresponse.data;

            let empsHandler = function(eresponse){
                let allEmps = eresponse.data;

                console.log(allItems);
                console.log(allEmps);
                fs.createReadStream(file.path)
                .pipe(csv())
                .on('data', (row) => {
                    console.log(row)
                    let dataToCreate = {};
                    let item = find( row.Item_Name, allItems, 'ItemName' );
                    let emp = find(row.Employee_ID, allEmps, 'EmpID');
                    

                    dataToCreate['ItemID'] = item.id;
                    dataToCreate['EmpID'] = emp.id;
                    dataToCreate['Count'] = parseFloat(row.Count);
                    if(typeof row.Assist_Employee_ID !== 'undefined' && row.Assist_Employee_ID !== null && row.Assist_Employee_ID !=="") {
                        let onbhemp = find(row.Assist_Employee_ID, allEmps, 'EmpID');
                        dataToCreate['OnBehalfEmpID'] = onbhemp.id;
                    }
                    if(typeof row.Acknowledge_Date !== 'undefined' && row.Acknowledge_Date !== null && row.Acknowledge_Date !=="") {
                        dataToCreate['AckDate'] = new Date(row.Acknowledge_Date);
                    }
                    if(typeof row.Officer_Acknowledge_Date !== 'undefined' && row.Officer_Acknowledge_Date !== null && row.Officer_Acknowledge_Date !=="") {
                        dataToCreate['OfficerAckDate'] = new Date(row.Officer_Acknowledge_Date);
                        dataToCreate['OfficerAck'] = row.Officer_Acknowledge_ID;
                    }

                    inputDatas.push(dataToCreate);
                    
                })
                .on('end', () => {
                    console.log(inputDatas)
                    let opHandler = function(res){
                        fs.unlinkSync(file.path);
                        handler(res);
                    }
                    serviceManager.callOperation("resource", 'ItemIssue', "createOperation", 
                                    inputDatas, opHandler, httpObj.request.mcHeader);
                    
                });


            }
            serviceManager.callOperation("resource", 'Employee', "findOperation", 
                            {inputCriteria:{}}, empsHandler, httpObj.request.mcHeader);

        }
        serviceManager.callOperation("resource", 'Item', "findOperation", 
                            {inputCriteria:{}}, itemsHandler, httpObj.request.mcHeader);

        
        
        
        
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
