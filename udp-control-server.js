var SERVER_PORT = 33333;
var CLIENT_HOST = '192.168.1.8';
var CLIENT_CONTROL_PORT = 33334;
var CLIENT_AHRS_PORT = 33335;

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/ttyUSB0", {
  baudrate: 57600
}, false);

server.on('listening', function () {
	var address = server.address();
	console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
	console.log(remote.address + ':' + remote.port +' - ' + message);
	// server.send(message, 0, message.length, CLIENT_CONTROL_PORT, remote.address); // echos message
});

serialPort.open(function () {
  console.log('open');
  serialPort.on('data', function(data) {
    //console.log('data received: ' + data);
    server.send(data, 0, data.length, CLIENT_AHRS_PORT, CLIENT_HOST); // echos message
  });
});

server.bind(SERVER_PORT);