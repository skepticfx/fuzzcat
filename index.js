var radamsa = require('node-radamsa');
var tls = require('tls');
var net = require('net');
var fs = require('fs');
var assert = require('assert');
var debug = require('debug')('fuzzcat');
var appServer = require('./server');
var events = require('events');
var util = require('util');

function Fuzzer(options){

  // parse and init options
  options = options || {};
  this.host = options.host || '127.0.0.1';
  this.port = options.port || 443;
  this.enableSSL = options.enableSSL || false;
  this.clientKey = options.clientKey || null;
  this.clientCert = options.clientCert || null;
  this.ca = options.ca || null;

  this.logFuzz = function(){
    debug = console.log;
  return this;
  }

  this.connectOptions = {};
  this.connectOptions.host = this.host;
  this.connectOptions.port = this.port;
  if(this.clientKey)  this.connectOptions.key = fs.readFileSync(this.clientKey);
  if(this.clientCert)  this.connectOptions.cert = fs.readFileSync(this.clientCert);
  if(this.ca) this.connectOptions.ca = fs.readFileSync(this.ca);
  this.connectOptions.rejectUnauthorized = false;


  this.payloads = [];
  this.fuzzedPackets = 0;
  this.socket = '';

  this.fuzzOptions = {};
  this.fuzzOptions.delay = 1000;


  this.dataStream = '';

  if(this.enableSSL){
    this.socket = tls;
  } else {
    this.socket = net;
  }

}

util.inherits(Fuzzer, events.EventEmitter);

Fuzzer.prototype.setOption = function(name, value){
  assert(name, null);
  assert(value, null);
  this.connectOptions[name] = value;
  this.fuzzOptions[name] = value;
return this;
}


// TODO: Support relative paths. Only supports, actual path for now.
// If its a string, then consider it as a file path and Buffer it.
// If its a buffer, then just, well - add the buffer.
Fuzzer.prototype.addPayload = function(data){
  if(typeof data === 'string')
    this.payloads.push(fs.readFileSync(data));
  if(data instanceof Buffer)
    this.payloads.push(data);

return this;
}

Fuzzer.prototype.radamsaFuzz = function(sock, payload, delay, no_repeat, _global){
  var fuzz = radamsa.fromBuffer(payload);
  delay = delay || 10;
  if(no_repeat !== undefined && no_repeat !== null){
    fuzz.once('data', function(data){
      debug('fuzz data:', data);
      sock.write(new Buffer(data), function(){
        _global.emit('packetSent', data)
      });
      _global.fuzzedPackets++;
    })
  } else {
    var repeat = setInterval(function(){
      Fuzzer.prototype.radamsaFuzz(sock, payload, null, true, _global);
    }, delay);
    sock.on('end', function(data){
      debug('end', 'closing radamsa fuzz socket');
      clearInterval(repeat);
      // Fuzz again
      //Fuzzer.prototype.radamsaFuzz(sock, payload, delay, null, _global);
    });

    sock.on('error', function(data){
      debug('error', data);
      clearInterval(repeat);
      // Fuzz again
      // Fuzzer.prototype.radamsaFuzz(sock, payload, delay, null, _global);
    });

    sock.on('data', function(data){
      debug('data', data.toString());
    });
  }


return this;
}


Fuzzer.prototype.start = function(){

  //var sock = this.socket.connect(this.connectOptions);
  //this.dataStream = sock;

  for(var i=0; i<this.payloads.length; i++){
    // socket, payload, delay, no_repeat, _global
    //this.radamsaFuzz(sock, this.payloads[i], this.fuzzOptions.delay, null, this);
    this.customFuzz(this.payloads[i], this.fuzzOptions.delay, this);
  }


}


// General fuzzing loop
// 1. For the given payload keep passing the fuzz function and repeat
// 2.


Fuzzer.prototype.customFuzz = function(payload, delay, _global){

  var timer = setInterval(function(){
    var fuzz = radamsa.fromBuffer(payload);
    fuzz.once('data', function(payload){
      Fuzzer.prototype.sendPacket(payload, _global);
    });
  }, delay);

}

Fuzzer.prototype.sendPacket = function(payload, _global){
  var sock = _global.socket.connect(_global.connectOptions);
  sock.write(payload, function(){
    _global.emit('packetSent', payload);
    console.log(payload);
  })

  sock.on('end', function(data){
    //debug('end', 'closing radamsa fuzz socket');
  });

  sock.on('error', function(data){
    debug('error', data);
  });

  sock.on('data', function(data){
    debug('data recieved', data.toString());
  });

}


Fuzzer.prototype.serve = function(port){
  var that = this;
  appServer
    .start(port, this)
    .on('start', function(){
      that.emit('serverStarted');
    })
return this;
}



exports.Fuzzer = Fuzzer;
