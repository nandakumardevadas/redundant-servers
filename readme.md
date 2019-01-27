# To Start the two individual servers:
    node server.js 8001
    node server.js 8002
    
# To Start the Main Server:
    npm start

# To update the individual servers config or settings:
```javascript
const serverConfig = {
  "retryLimit" : 5, // To Set the retry limit to check the status of the server
  "serversList": [ // Servers list to update the status check
    {
      target: "http://localhost:8001", // Server URL
      host: "localhost",
      port: "8001",
      connectedDevices: 5, // No of devices connected to this server
      down: false // To indicate the server is down or not
    },
    {
      target: "http://localhost:8002", // Server URL
      host: "localhost",
      port: "8002",
      connectedDevices: 10, // No of devices connected to this server
      down: false // To indicate the server is down or not
    }
  ]
}

```
# Default URL's generated on starting the servers:
    1. [http://localhost:4700]: http://localhost:4700
    2. [http://localhost:8001]: http://localhost:8001
    2. [http://localhost:8002]: http://localhost:8002

# Server to view the status:
    1. http://localhost:4700

> ### Server updates status every 3 seconds
