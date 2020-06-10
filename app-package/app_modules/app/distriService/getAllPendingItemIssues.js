const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const find = function(id, list, listkey){
    for(let idx = 0; idx < list.length; idx++){
        let i = list[idx];
        if(i[listkey] === id){
            return i;
        }
    }
    return null;
};

const operation = {
    loadOperation: function(serviceManager, inputs, callback, mcHeader){

        let processCallback = function(data){
            callback(data);
        };
        
        let allEmployees =[];
        let allItems =[];

        let processEmpsCallback = function(allEmps){
            allEmployees = allEmps.data;

            let processItemsCallback = function(allItms){
                allItems = allItms.data;

                let processItemIssCallback = function(allIssItems){
                    let allItemIss = allIssItems.data
                    let returnData = {};
                    allItemIss.forEach(function(itemIss){
                        let femp = find(itemIss.EmpID, allEmployees, 'id');
                        let fitem = find(itemIss.ItemID, allItems, 'id');

                        if(typeof returnData[femp.EmpID] === 'undefined'){// not found
                            returnData[femp.EmpID] = {
                                'name': femp.EmpName,
                                'empId': itemIss.EmpID,
                                'items':[{
                                    'id': itemIss.id,
                                    'name': itemIss.Count + ' x ' + fitem.ItemName,
                                    'data': itemIss
                                }]
                            };
                            
                        }else{ // found
                            returnData[femp.EmpID].items.push({
                                'id': itemIss.id,
                                'itemId': itemIss.ItemID,
                                'name': itemIss.Count + ' x ' + fitem.ItemName
                            });
                        }
                        
                    });

                    processCallback({
                        'allEmployees':allEmployees,
                        'allItems':allItems,
                        'allIssItems':allItemIss,
                        'allEmpIssItems': returnData
                    })

                }

                
                let queryCriteria = {
                    where:{
                        AckDate: {
                            [Op.eq]: null
                        }
                    },
                    order:[['OfficerAckDate', 'ASC'],['OfficerAckDate', 'ASC']]
                };

                if(typeof inputs.exclude !== 'undefined'){
                    let emp_id = '';
                    for(let eidx = 0; eidx < allEmployees.length; eidx++){
                        let eEmp = allEmployees[eidx];
                        if(eEmp.EmpID === inputs.exclude){
                            emp_id = eEmp.id;
                            break;
                        }
                    }
                    if(emp_id !== ''){
                        queryCriteria.where['EmpID'] = {
                            [Op.not]: [emp_id]
                        };
                    }
                }
                serviceManager.callDBOperation.query('ItemIssue', queryCriteria, processItemIssCallback, mcHeader);

            }
            serviceManager.callDBOperation.query('Item', {where:{}}, processItemsCallback, mcHeader);
        };
        serviceManager.callDBOperation.query('Employee', {where:{}}, processEmpsCallback, mcHeader);
       
        // let modelDescr = serviceManager.callDBOperation.getModel(inputModelName);

        // let queryCriteria = {
        //     where:{},
        // };

        // //limit criteria
        // if( typeof inputs.inputCriteria !== "undefined"
        //     && typeof inputs.inputCriteria.limit !== "undefined"
        //     && typeof inputs.inputCriteria.limit === "number")
        // {// if there is a limit passed in
        //     queryCriteria.limit = inputs.inputCriteria.limit;
        // }

        // //offset criteria
        // if(typeof inputs.inputCriteria !== "undefined"
        //     && typeof inputs.inputCriteria.offset !== "undefined"
        //     && typeof inputs.inputCriteria.offset === "number")
        // {// if there is a offset passed in
        //     queryCriteria.offset = inputs.inputCriteria.offset;
        // }

        // //order criteria
        // if(typeof inputs.inputCriteria !== "undefined"
        //     && typeof inputs.inputCriteria.order !== "undefined"
        //     && Array.isArray(inputs.inputCriteria.order))
        // {// if there is a order passed in
        //     queryCriteria.order = inputs.inputCriteria.order;
        // }

        // //group criteria
        // if(typeof inputs.inputCriteria !== "undefined"
        //     && typeof inputs.inputCriteria.group !== "undefined"
        //     && typeof inputs.inputCriteria.group === "string")
        // {// if there is a order passed in
        //     queryCriteria.order = inputs.inputCriteria.order;
        // }

        // if(typeof inputs.inputCriteria !== "undefined"
        //     && typeof inputs.inputCriteria.attributes !== "undefined"
        //     && Array.isArray(inputs.inputCriteria.attributes))
        // {
        //     // validate against modelDescr
        //     //TODO: implement validate
            
        //     queryCriteria.attributes = inputs.inputCriteria.attributes;
        // }

        // if(typeof inputs.inputCriteria !== "undefined"
        //     && typeof inputs.inputCriteria.where !== "undefined")
        // {            
        //     queryCriteria.where = inputs.inputCriteria.where;
        // }

        // serviceManager.callDBOperation.query(inputModelName, queryCriteria, processCallback, mcHeader);
    }
}
module.exports = operation;