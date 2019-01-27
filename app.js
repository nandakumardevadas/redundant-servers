const http = require("http");
const httpProxy = require("http-proxy");
const _ = require("lodash");
const isReachable = require("is-reachable");
const path = require("path");
const express = require("express");

const serverConfig = require("./config");

var app = express();

const port = 4700;
let serversList = serverConfig.serversList;
let retryLimit = serverConfig.retryLimit;

let proxyObj = {};
serversList.map(value => {
  proxyObj[value.target] = new httpProxy.createProxyServer({
    target: value.target
  });
  return proxyObj[value.target];
});

var selectServer = (req, res) => {
  let activeServers = _.filter(serversList, { down: false });
  let targetServer = null;
  if (activeServers.length > 0) {
    let maxDevicesServer = _.maxBy(activeServers, "connectedDevices");
    targetServer = proxyObj[maxDevicesServer.target];
  }
  return targetServer;
};

var serverCallback = (req, res) => {
  var proxy = selectServer();
  if (!proxy) {
    return res.sendFile(__dirname + "/index.html");
  }
  proxy.web(req, res);
  proxy.on("error", error => { console.log('Error'); });
};
app.use(express.static(path.join(__dirname, "assets")));
app.use(serverCallback);
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

var server = http.createServer(app);

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
  setInterval(async () => {
    for (let retry = 1; retry <= retryLimit; retry++) {
      let targetArray = [];
      for (const value of serversList) {
        targetArray.push(isReachable(value.target));
      }
      const serverStatusResponse = await Promise.all(targetArray);
      if (_.includes(serverStatusResponse, false)) {
        serversList.forEach(value => {
          value.down = true;
        });
      } else {
        serversList.forEach(value => {
          value.down = false;
        });
      }
    }
  }, 1000);
});
