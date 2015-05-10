var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

app.use('/', express.static('app/'));
app.use('/bower_components', express.static('bower_components/'));

io.sockets.on('connection', function(socket){
	socket.on('send transaction', function(data){
		io.sockets.emit('new transaction', data);
	});
});

var port = Number(process.env.PORT || 3000);

server.listen(port, function () {
    'use strict';
    console.log('listening on *:3000');
});

