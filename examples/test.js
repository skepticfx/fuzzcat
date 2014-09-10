var fuzzcat = require('../');

var fuzzer = new fuzzcat.Fuzzer({
  'host': 'facebook.com',
  'port': '443',
  'enableSSL': true
});


fuzzer
  .addPayload(new Buffer("1000050101000000210000000afcf21f0000", 'hex'))
  .logFuzz()
  .setOption('delay', 10)
  .serve(5000)
  .start()
