var SERVER_PORT = 33333;
var CLIENT_HOST = '192.168.1.8';
var CLIENT_CONTROL_PORT = 33334;
var CLIENT_AHRS_PORT = 33335;
var SERIAL_PORT = "/dev/ttymxc3";

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

var com = require("serialport")
var serialPort = new com.SerialPort(SERIAL_PORT, {
  baudrate: 57600,
  parser: com.parsers.readline('\n')
}, false);


server.on('listening', function () {
	var address = server.address();
	console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
	if(remote.port == CLIENT_AHRS_PORT){
		console.log("AHRS Command: " + message);
		serialPort.write(message);
	}
	else
	console.log(remote.address + ':' + remote.port +' - ' + message);
	server.send(message, 0, message.length, CLIENT_CONTROL_PORT, remote.address); // echos message
});

serialPort.open(function () {
  console.log('Serial Port open on ' + SERIAL_PORT);
});

serialPort.on('data', function(data) {
	//console.log('data received: ' + data);
	var dataBuf = new Buffer(data);
	server.send(dataBuf, 0, dataBuf.length, CLIENT_AHRS_PORT, CLIENT_HOST); // echos message
});

server.bind(SERVER_PORT);