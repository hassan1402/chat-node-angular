var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendfile('public/index.html');
});
app.get('javascripts/client.js', function(req, res){
    res.sendfile('public/javascripts/client.js');
});

io.on('connect', function(socket){
    console.log('a user connected: ' + socket.id);
	socket.emit('Ack_connect', 'Status connection : connected');
	
    socket.on('disconnect', function(){
		console.log( socket.name + ' has disconnected from the chat.' + socket.id);
    });
    socket.on('join', function (data) {
        socket.name = data.from;
        console.log(socket.name + ' joined the chat.');
    });
    socket.on('message', function(data){
		var message = {from: data.from, message: data.message, time: new Date()}
		console.log('MESSAGE Received : '+JSON.stringify(message));
        socket.emit('Ack_message', 'message received');
		socket.emit('message', message);
    });
});
http.listen(8080, function(){
    console.log('(-_-) listening on 8080');
});
