var express = require('express');
var router = express.Router();
var app = express();

/* GET api listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});


/* GET fuzzedPackets listing. */
router.get('/fuzzedPackets', function(req, res) {
  var r = {};
  r.error = false;
  r.result = req.app.get('fuzz').fuzzedPackets;
  res.json(r);
});

module.exports = router;
