const http = require("http");
const httpProxy = require("http-proxy");
const _ = require("lodash");
const isReachable = require("is-reachable");
const path = require("path");
const express = require("express");

// Server configuration settings
const serverConfig = require("./config");

var app = express();

const port = 4700;
// Servers list with the settings based on the config file
let serversList = serverConfig.serversList;
// Retry limit to check the server status
let retryLimit = serverConfig.retryLimit;

let proxyObj = {};
serversList.map(value => {
  proxyObj[value.target] = new httpProxy.createProxyServer({
    target: value.target
  });
  return proxyObj[value.target];
});

/**
 * To Switch between the servers based on connections set in config file
 */
function selectServer(req, res) {
  let activeServers = _.filter(serversList, { down: false });
  let targetServer = null;
  if (activeServers.length > 0) {
    let maxDevicesServer = _.maxBy(activeServers, "connectedDevices");
    targetServer = proxyObj[maxDevicesServer.target];
  }
  return targetServer;
};

/**
 * To setup and redirect to the particular server with the server status
 */
function serverCallback(req, res) {
  var proxy = selectServer();
  if (!proxy) {
    return res.sendFile(__dirname + "/index.html");
  }
  proxy.web(req, res);
  proxy.on('error', (error) => {

  })
};
app.use(express.static(path.join(__dirname, "assets")));
app.use(serverCallback);
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

var server = http.createServer(app);

server.listen(port, () => {
  console.log(`Listening on port ${port}`);

  // To check the server status health based on the retry limit based on the config file
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
