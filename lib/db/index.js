function foo() {
  return "foo";
}

exports.foo = foo

var pg = require('pg');

var connString = 'postgres://student:student@localhost/student';

function getUsers2(callback) {
  pg.connect(connString, function (err, client, done) {
    if (err) {
      callback(err);
    }
    else {
      client.query('select U.fname as first,U.lname as last,A.street,A.city from address A,users U,lives L', function (err, result) {
        // Ends the "transaction":
        done();
        // Disconnects from the database:
        client.end();
        if (err) {
          callback(err);
        }
        else {
          callback(undefined, result.rows);
        }
      });
    }
  });
}

function getUsers3(callback) {
  pg.connect(connString, function (err, client, done) {
    if (err) {
      callback(err);
    }
    else {
      client.query('select * from users,address,lives', function (err, result) {
        // Ends the "transaction":
        done();
        // Disconnects from the database:
        client.end();
        if (err) {
          callback(err);
        }
        else {
          callback(undefined, result.rows);
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

if (process.argv.length < 3) {
  console.log('usage: node users.js [s|a]');
  process.exit(1);
}

switch (process.argv[2]) {
case 's':
  getUsers2(printUsers);
  break;
case 'a':
  getUsers3(printUsers);
  break;
default:
  console.log("I don't know what you mean: " + process.argv[2]);
  process.exit(1);
}

