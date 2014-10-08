var pg = require('pg');

var connString = 'postgres://student:student@localhost/student';

function getUsers(callback) {
  pg.connect(connString, function (err, client, done) {
    if (err) {
      callback(err);
    }
    else {
      client.query('select * from users', function (err, result) {
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

function getUsers2(callback) {
  pg.connect(connString, function (err, client, done) {
    if (err) {
      callback(err);
    }
    else {
      client.query('select fname,lname from users', function (err, result) {
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


function createUser(uid, fname, lname, passwd, age, callback) {
  pg.connect(connString, function (err, client, done) {
    if (err) {
      callback(err);
    }
    else {
      var str = 'insert into users (uid, fname, lname, password, age) values ($1, $2, $3, $4, $5)';
      client.query(str, [uid, fname, lname, passwd, age],
        function (err, result) {
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

function updatePassword(fname, lname, passwd, callback) {
  pg.connect(connString, function (err, client, done) {
    if (err) {
      callback(err);
    }
    else {
      var str = 'update users set password=$1 where fname=$2 and lname=$3';
      client.query(str, [passwd, fname, lname],
        function (err, result) {
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

function printUserNames(err, users) {
  if (err) {
    throw err;
  }
  else {
    users.forEach(function (user) {
      console.log(user.fname);
      console.log(user.lname);
    });
  }
}

function printUserAge(err, users) {
  if (err) {
    throw err;
  }
  else {
    users.forEach(function (user) {
      console.log(user.age);
    });
  }
}

if (process.argv.length < 3) {
  console.log('usage: node users.js [u|n|p|c|q]');
  process.exit(1);
}

switch (process.argv[2]) {
case 'u':
  getUsers(printUsers);
  break;
case 'n':
  getUsers(printUserNames);
  break;
case 'p':
  var fname  = process.argv[3];
  var lname  = process.argv[4];
  var passwd = process.argv[5];
  updatePassword(fname, lname, passwd, printUsers);
  break;
case 'c':
  var uid    = process.argv[3];
  var fname  = process.argv[4];
  var lname  = process.argv[5];
  var passwd = process.argv[6];
  var age    = process.argv[7];
  createUser(uid, fname, lname, passwd, age, printUsers);
  break;
case 'q':
  getUsers2(printUsers);
  break;
default:
  console.log("I don't know what you mean: " + process.argv[2]);
  process.exit(1);
}
