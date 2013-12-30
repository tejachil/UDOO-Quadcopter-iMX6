var SERVER_PORT = 33333;
var CLIENT_HOST = '192.168.1.8';
var CLIENT_CONTROL_PORT = 33334;
var CLIENT_AHRS_PORT = 33335;

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('listening', function () {
	var address = server.address();
	console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
	console.log(remote.address + ':' + remote.port +' - ' + message);
	// server.send(message, 0, message.length, CLIENT_CONTROL_PORT, remote.address); // echos message
});

server.bind(SERVER_PORT);