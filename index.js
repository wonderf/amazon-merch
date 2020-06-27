var express = require('express');
const PORT = process.env.PORT || 3000;

var app = express();


app.use(express.static('public'));


app.listen(PORT, function () {
  console.log('Example app listening');
});