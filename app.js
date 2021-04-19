var http = require('http');
var fs = require('fs');
var index = fs.readFileSync( 'index.html');
var counter=0;
var SerialPort = require('serialport');
const parsers = SerialPort.parsers;
var sys = require('sys'),
    exec = require('child_process').exec;
const parser = new parsers.Readline({
    delimiter: '\r\n'
});

var port = new SerialPort('/dev/cu.usbmodem14401',{ 
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

port.pipe(parser);

var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

var io = require('socket.io').listen(app);

io.on('connection', function(socket) {
    
    console.log('Node is listening to port');
    exec('osascript -e "set volume output volume 100"', {silent:true}).output;
    // exec('open https://www.youtube.com/watch?v=gQYsUjT-IBo', {silent:true}).output;

});

parser.on('data', function(data) {
    
    console.log('Received data from port: ' + data);
    var myArray = data.split(" ");
    exec('osascript -e "set volume output volume '+((myArray[0]-24.5)*200)+'\"', {silent:true}).output; 
    setTimeout(function(){ console.log("waiting"); }, 6000);
    io.emit('data', data);
    
});

app.listen(3000);
