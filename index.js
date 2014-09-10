var radamsa = require('node-radamsa');
var tls = require('tls');
var net = require('net');
var fs = require('fs');
var assert = require('assert');
var debug = require('debug')('fuzzcat');

function Fuzzer(options){

  // parse and init options
  options = options || {};
  this.host = options.host || '127.0.0.1';
  this.port = options.port || 443;
  this.enableSSL = options.enableSSL || false;
  this.clientKey = options.clientKey || null;
  this.clientCert = options.clientCert || null;
  this.clientCa = options.clientCa || null;

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

Fuzzer.prototype.radamsaFuzz = function(sock, payload, delay, no_repeat){
  var fuzz = radamsa.fromBuffer(payload);
  delay = delay || 10;
  if(no_repeat !== undefined){
    fuzz.once('data', function(data){
      debug('fuzz data:', data);
      sock.write(new Buffer(data));
    })
  } else {
    var repeat = setInterval(function(){
      Fuzzer.prototype.radamsaFuzz(sock, payload, null, true);
    }, delay);
    sock.on('end', function(data){
      debug('end', 'closing radamsa fuzz socket');
      clearInterval(repeat);
      // Fuzz again
      Fuzzer.prototype.radamsaFuzz(sock, payload, delay);
    });

    sock.on('error', function(data){
      debug('error', data);
      clearInterval(repeat);
      // Fuzz again
      Fuzzer.prototype.radamsaFuzz(sock, payload, delay);
    });
  }


return this;
}


Fuzzer.prototype.start = function(){

  var sock = this.socket.connect(this.connectOptions);
  this.dataStream = sock;

  for(var i=0; i<this.payloads.length; i++){
    // socket, payload, delay
    this.radamsaFuzz(sock, this.payloads[i], this.fuzzOptions.delay);
  }
  sock.on('data', function(data){
    debug('data', data.toString());
  });

}


exports.Fuzzer = Fuzzer;
