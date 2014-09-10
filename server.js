#!/usr/bin/env node
var debug = require('debug')('sever');
var app = require('./app');
var events = require('events');

exports.start = function(port, fuzz){

  var EE = new events.EventEmitter();
  app.set('port', port || 3000);

  var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
    app.set('fuzz', fuzz);
    EE.emit('start', app);

    var io = require('socket.io')(server);
    io.on('connection', function (socket) {
      socket.emit('fuzzDetails', {
        host: fuzz.connectOptions.host,
        port: fuzz.connectOptions.port,
        delay: fuzz.fuzzOptions.delay
      });
      app.set('websocket', io);
    });

    fuzz.on('packetSent', function(data){
      io.emit('packetSent', data.length, fuzz.fuzzedPackets);
    });

  });

return EE;
}
