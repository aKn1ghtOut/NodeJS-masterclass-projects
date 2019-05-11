/*
 * Primary file for the API
 */

 var http = require("http");
 //var https= require("https");
 var url = require("url");
 var StringDecoder = require("string_decoder").StringDecoder;
 var config = require("./config")
 //var fs = require("fs");

 //Instantiating only the HTTP server
 var HTTP_Server = http.createServer(function(req, res)
 {
     unifiedServer(req, res);
 });


 //Start the server and have it listen
 HTTP_Server.listen(config.httpPort, function()
 {
     console.log("The HTTP server is listening on", config.httpPort);
 });

 ///Instantiating only the HTTPS server
//  var httpsOptions = {
//      "key": fs.readFileSync("./https/key.pem"),
//      "cert": fs.readFileSync("./https/cert.pem"),
//  };
//  var HTTPS_Server = https.createServer(httpsOptions, function(req, res)
//  {
//      unifiedServer(req, res);
//  });


//  //Start the server and have it listen on port 3000
//  HTTPS_Server.listen(config.httpsPort, function()
//  {
//      console.log("The HTTPS server is listening on", config.httpsPort);
//  });
 
 var unifiedServer = function(req, res)
 {
     //Get the URL and parse it
    var parsedURL = url.parse(req.url, true);

    //Get the path
    var path = parsedURL.pathname;

    //Remove the leading and lagging slashes from the path
    var tPath = path.replace(/^\/+|\/+$/g, "");

    //Get the queryString as an Object
    //var queryStringObject = parsedURL.query;

    //Get the HTTP method
    //var method = req.method.toLowerCase();

    //Get the header variables
    //var headers = req.headers;

    //Get the payload if it exists
    //var decoder = new StringDecoder("utf-8");
    //var buffer = "";
    req.on('data', function(data)
    {
        //buffer += decoder.write(data);
    });

    req.on('end', function()
    {
        //buffer += decoder.end();

        var chosenHandler = typeof(router[tPath]) !== 'undefined' ? router[tPath] : handlers.notFound;
        
        //data for the callback
        var data = {};/*{
            "trimmedPath" : tPath,
            "queryStringObject" : queryStringObject,
            'method' : method,
            'headers': headers,
            'payload': buffer
        };*/

        chosenHandler(data, function(statusCode, payload)
        {
            //Use status code defined by handler, or use 200 as default
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            //Default payload is an empty payload
            payload = typeof(payload) == 'object' ? payload : {};

            let payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log("Returning\nStatus Code: ", statusCode, "\nPayload String: ", payloadString);
        });

    });

    //handlers
    var handlers = {};
    
    handlers.notFound = function(data, callback){
        callback(404);
    };

    handlers.hello = function(data, callback){
        //Callback an HTTP Status Code, and a payload
        callback(200, {"message" : "Hello there, Welcome to the API host"});
    }


    //router
    var router = {
        "hello" : handlers.hello
    }
 }