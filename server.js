var args = process.argv.splice(2);
var http = require("http");
const express = require("express"); 
const path = require('path');
const port = args[0];
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

server.on("close", function() {
  console.log(" Server Stopping...");
});
process.on("SIGINT", function() {
  server.close();
});

server.listen(port, () => {
  console.log(`Listening on port ${port}. Please visit the link http://localhost:${port}`);

});
