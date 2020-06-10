/** 
 * 
 **/
const fs = require('fs');
const csv = require('csv-parser');
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
        fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (row) => {
            let dataToCreate = {};
            dataToCreate['EmpID'] = row.Employee_Number;
            dataToCreate['EmpName'] = row.Employee_Name;
            dataToCreate['EmpDep'] = row.Employee_Department;
            if(typeof row.Employee_Start_Date !== 'undefined' && row.Employee_Start_Date !== null && row.Employee_Start_Date !=="") {
                dataToCreate['EmpStartDate'] = new Date(row.Employee_Start_Date);
            }
            if(typeof row.Employee_End_Date !== 'undefined' && row.Employee_End_Date !== null && row.Employee_End_Date !=="") {
                dataToCreate['EmpEndDate'] = new Date(row.Employee_End_Date);
            }
            dataToCreate['EmpContact'] = row.Employee_Contact;

            inputDatas.push(dataToCreate);
            
        })
        .on('end', () => {
            let opHandler = function(res){
                fs.unlinkSync(file.path);
                handler(res);
            }
            serviceManager.callOperation("resource", 'Employee', "createOperation", 
                            inputDatas, opHandler, httpObj.request.mcHeader);
            
        });
        
        
        
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
