var args = process.argv.splice(2);
var http = require("http");
const express = require("express"); 
const path = require('path');
var app = express();
 
app.set("view engine", "ejs")
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'assets')));
app.get("/", function(req, res) {
  res.render("server.ejs", {
      port: args[0]
  });
});

var server = http.createServer(app);

server.listen(args[0]);
