var fuzzcat = require('../');

var fuzzer = new fuzzcat.Fuzzer({
  'host': '127.0.0.1',
  'port': '80',
  //'enableSSL': true,
  //'clientKey': 'client.pem',
  //'clientCert': 'client.pem',
  //'ca': 'ca.pem'
});


fuzzer
  .addPayload(new Buffer("1000050101000000210000000afcf21f0000", 'hex'))
  .logFuzz()
  .setOption('delay', 1000)
  .start()
