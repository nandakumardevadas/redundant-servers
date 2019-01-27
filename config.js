const serverConfig = {
  "retryLimit" : 5, 
  "serversList": [
    {
      target: "http://localhost:8001",
      host: "localhost",
      port: "8001",
      connectedDevices: 5,
      down: false
    },
    {
      target: "http://localhost:8002",
      host: "localhost",
      port: "8002",
      connectedDevices: 10,
      down: false
    }
  ]
}

module.exports = serverConfig;