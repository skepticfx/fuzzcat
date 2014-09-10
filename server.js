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
  });

return EE;
}
