Fuzzcat
=======
Super fast network fuzzer written in node.js

## Installation

* Make sure you have Radamsa command line installed. Its an easy install form here: https://code.google.com/p/ouspg/wiki/Radamsa
* Then do a `npm install fuzzcat`

## Usage


````
var fuzzcat = require('fuzzcat');

var fuzzer = new fuzzcat.Fuzzer({
  'host': 'scanme.nmap.org',
  'port': '22',
  'enableSSL': false // Do not use an SSL Transport layer. Rather do normal TCP Fuzz.
});


fuzzer
  .addPayload(new Buffer("1000050101000000210000000afcf21f0000", 'hex')) // Add as much payloads as you would like
  .logFuzz() // Log your fuzz activity on the command line
  .setOption('delay', 1000) // Delay between each packet
  .serve(5000) // PORT to serve the web GUI about Fuzz stats
  .start()

````

* Take a look at the examples to get an idea of how to fuzz.
* Use Fuzzcat.serve(PORT) to enable the Web UI
* TODO: More doc on usage.

## Features

* Supports SSL with Client certificates.
* Web based UI for monitoring fuzz status.


## TODO

* Make it easy to construct binary protocols and fuzz them.
* More robust test cases
* Make adding advanced payloads more easier
* Add ablilty to choose between UDP/TCP just like the SSL/Non-SSL one.

## License

The MIT License (MIT)

Copyright (c) Ahamed Nafeez

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
