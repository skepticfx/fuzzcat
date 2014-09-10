var fuzzcat = require('../'); // require('fuzzcat')

var basicFuzz = new fuzzcat.Fuzzer({
  "host": "127.0.0.1",
  "port": 8000,
  "enableSSL": true
});


basicFuzz
  .addPayload('../fixtures/payloads/payload1.txt')
  .start()
