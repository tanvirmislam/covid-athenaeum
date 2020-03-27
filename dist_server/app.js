"use strict";

var express = require('express');

var cors = require('cors');

var routes = require('./router/api/routes');

var PORT = process.env.PORT || 5000;
var app = express();
app.use(cors());
app.use('/', routes); // app.use('/api', routes);
// Client app routes redirection
// app.use(express.static(__dirname + '/public/'));
// app.get(/.*/, (request, response) => {
//     response.sendFile(__dirname, 'public/index.html');
// });

app.listen(PORT, () => {
  console.log("Server listening to PORT: ".concat(PORT));
});