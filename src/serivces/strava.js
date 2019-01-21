export function httpGetAsync(link, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", link, true); // true for asynchronous 
    xmlHttp.setRequestHeader('Authorization',
    'Bearer ' + "551c7baf03c57e1a68373317992a957f2573d283 ");
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(null);
}
