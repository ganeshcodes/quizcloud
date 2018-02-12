var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

// Create connection to database
var config = {
    userName: 'gxtpro',
    password: 'ganesh_123',
    server: 'shareitprodbserver.database.windows.net',
    options: {
      database: 'shareitprodb',
      encrypt: true
    }
}
var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err){
    if (!err){
      console.log('connection successful');
    } else {
      console.error('connection unsuccessful %o',err);
    }
});

module.exports = connection;