const Http = new XMLHttpRequest();

const httpGetAsync = function(url, input, callback){
    Http.onreadystatechange = (e) => {
        if( Http.readyState==4 && Http.status==200){
            callback(Http.responseText);
        }
    }

    Http.open("GET", url, true);
    if(typeof input === 'undefined')
    {
        Http.send();
    } else {
        Http.send(JSON.stringify(input));
    }

    
};

const httpPostAsync = function(url, input, callback){
    Http.onreadystatechange = (e) => {
        if( Http.readyState==4 && (Http.status==200 || Http.status==204)){
            callback(Http.responseText);
        }
    }

    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    if(typeof input === 'undefined')
    {
        Http.send();
    } else {
        Http.send(JSON.stringify(input));
    }

    
};

const httpBinPostAsync = function(url, input, callback){
    Http.onreadystatechange = (e) => {
        if( Http.readyState==4 && (Http.status==200 || Http.status==204)){
            callback(Http.responseText);
        }
    }

    Http.open("POST", url, true);
    //Http.setRequestHeader("Content-Type", "application/json");
    if(typeof input === 'undefined')
    {
        Http.send();
    } else {
        Http.send(input);
    }

    
};

const httpPutAsync = function(url, input, callback){
    Http.onreadystatechange = (e) => {
        if( Http.readyState==4 && (Http.status==200 || Http.status==204)){
            callback(Http.responseText);
        }
    }

    Http.open("PUT", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    if(typeof input === 'undefined')
    {
        Http.send();
    } else {
        Http.send(JSON.stringify(input));
    }

    
};

const httpDeleteAsync = function(url, input, callback){
    Http.onreadystatechange = (e) => {
        if( Http.readyState==4 && (Http.status==200 || Http.status==204)){
            callback(Http.responseText);
        }
    }

    Http.open("DELETE", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    if(typeof input === 'undefined')
    {
        Http.send();
    } else {
        Http.send(JSON.stringify(input));
    }

    
};

const find = function(id, list, listkey){
    for(let idx = 0; idx < list.length; idx++){
        let i = list[idx];
        if(i[listkey] === id){
            return i;
        }
    }
    return null;
};

const findAll = function(id, list, listkey){
    let returnList = [];
    for(let idx = 0; idx < list.length; idx++){
        let i = list[idx];
        if(i[listkey] === id){
            returnList.push(i);
        }
    }
    return returnList;
};