var http = require('http');
var url  = require('url');
var pg = require('pg');
var connString = 'postgres://student:student@localhost/student';


function textHandler(request, response) {
  console.log('received a request from ' + request.headers.host);
  console.log('resource requested: ' + request.url);
  
  response.writeHead(200, { 'Content-Type' : 'text/plain' });

  response.write('hello: ' + request.headers.host + '\n');
  response.write('  --> you requested ' + request.url);
  response.end();
}
function singleHandler(request, response) {
  pg.connect(connString, function (err, client, done) {
    if (err) {
      response(err);
    }
    else {
      client.query('select U.fname as first,U.lname as last,A.street,A.city from address A,users U,lives L', function (err, result) {
        // Ends the "transaction":
        done();
        // Disconnects from the database:
        client.end();
        if (err) {
          response(err);
        }
        else {
          response(undefined, result.rows);
        }
      });
    }
  });
}

function printUsers(err, users) {
  if (err) {
    throw err;
  }
  else {
    users.forEach(function (user) {
      console.log(user);
    });
  }
}

function jsonHandler(request, response) {
  response.writeHead(200, { 'Content-Type' : 'text/json' });

  var obj = {
    host: request.headers.host,
    url : request.url
  };

  json = JSON.stringify(obj);
  response.write(json);
  response.end();
}

if (process.argv.length < 3) {
  console.log('usage: node http-server.js [text|json|s]');
  process.exit(1);
}

var handlerType = process.argv[2];
if (!(handlerType === 'text' || handlerType === 'json')) {
  console.log('usage: node http-server.js [text|json|s]');
  process.exit(1);  
}

var server = null;

switch (handlerType) {
  case 'text':
    server = http.createServer(textHandler);
    break;
  case 'json':
    server = http.createServer(jsonHandler);
    break;
case 's':
    server = http.createServer(singleHandler);
    break;
  default:
    throw new Error('invalid handler type!');
}

server.listen(4000);
console.log('Server is listening!');
