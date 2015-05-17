var fuzzcat = require('../index');

var fuzzer = new fuzzcat.Fuzzer({
  'host': 'scanme.nmap.org',
  'port': '22',
  'enableSSL': false
});


fuzzer
  .addPayload(new Buffer("1000050101000000210000000afcf21f0000", 'hex'))
  .logFuzz()
  .setOption('delay', 1000)
  .serve(5000)
  .start()
