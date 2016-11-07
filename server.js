
'use strict'
const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
let todos = [


    {id: Math.random() + '', message: 'Go to class', checked :false},
    {id: Math.random() + '', message: 'Go to another class', checked :false},
    {id: Math.random() + '', message: 'Go to another another class', checked :false}


];



const httpServer = http.createServer(function(req, res) {

    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);
    const method = req.method;
    if(method === 'GET')
    {
        if (req.url === '/todos') {

            const json = JSON.stringify(todos);
            res.setHeader('Content-Type', 'application/json');
            res.end(json);
            return;
        }
    }
    fs.readFile('./public' + req.url, function (err, data) {
        if (err) {
            res.statusCode = 404;
            res.end("<h1 style='text-align: center'>File Not Found</h1>")
        }
        res.statusCode = 200;
        res.end(data);
    });
    if(method === 'POST') {
        if (req.url === ('/todos')) {

            // read the content of the message
            let body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body);  // now that we have the content, convert the JSON into an object
                jsonObj.id = Math.random() + ''; // assign an id to the new object
                // store the new object into our array (our 'database'
                todos.push(jsonObj);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(jsonObj));

            });

        }
    }

    if(method === 'PUT') {
        if(req.url === '/todos') {

            // read the content of the message
            let body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body); // now that we have the content, convert the JSON into an object

                console.log(jsonObj);
                for(let i = 0; i < todos.length; i++) {
                    if(todos[i].id === jsonObj.id) { // found the same object
                        todos[i].checked = jsonObj.checked; // replace the old object with the new object
                        res.statusCode = 202;
                        res.setHeader('Content-Type', 'application/json');
                        return res.end(JSON.stringify(jsonObj));
                    }
                }

                res.statusCode = 404;
                return res.end('Data was not found and can therefore not be updated');
            });
            return;
        }
    }
    if(method === 'DELETE') {
        if(req.url.indexOf('/todos/') === 0) {
            let id =  req.url.substr(7);
            for(let i = 0; i < todos.length; i++) {
                if(id === todos[i].id) {
                    todos.splice(i, 1);
                    res.statusCode = 200;
                    return res.end('Successfully removed');
                }
            }
            res.statusCode = 404;
            return res.end('Data was not found');
        }
    }
});
    httpServer.listen(666);