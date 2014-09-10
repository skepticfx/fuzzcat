var should = require('should');
var fuzzcat = require('../');
var tlsecho = require('tlsecho');
var net = require('net');

var tlsPort = 8000;
var tcpPort = 8001;

describe('ping/pong', function(){
  this.timeout(5000);

  describe('over SSL channel', function(){
      var server = tlsecho.start(tlsPort);

    // TODO: Use https to test the fuzzer
    it('simple ping pong', function(done){
      var fuzz1 = new fuzzcat.Fuzzer();
      fuzz1
        .setOption('host', '127.0.0.1')
        .setOption('port', tlsPort)
        .setOption('enableSSL', true)
        .addPayload(__dirname+'/payloads/1.txt')
        .start();
      server.on('connection', function(sock){
        sock.once('data', function(data){
          data.should.be.an.instanceOf.Buffer;
          done();
        })
      })
    })

    after(function(done){
      server.close();
      done();
    })
  })


  describe('over plain TCP channel', function(){
    var server = '';
    before(function(done){
      server = net.createServer(function(sock){
        sock.pipe(sock);
        sock.on('data', function(data){
          console.log(data)
        })
      });
      server.listen(tcpPort, done);
    })

    // TODO: Use https to test the fuzzer
    it('simple ping pong', function(done){
      var fuzz1 = new fuzzcat.Fuzzer();
      fuzz1
        .setOption('host', '127.0.0.1')
        .setOption('port', tcpPort)
        .addPayload(new Buffer([0x01, 0x0A, 0x09, 0x00]))
        //.logFuzz()
        .start();

      server.on('connection', function(sock){
        sock.once('data', function(data){
          data.should.be.an.instanceOf.Buffer;
          done();
        })
      })

    })

  })

})
