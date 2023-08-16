// Import the WebSocket module
import WebSocket from 'ws';


function ConnectToWebSocketServer() {

  // WebSocket server URL
  const SERVER_URL = 'wss://localhost:1111';

  // Create a WebSocket client instance
  var connection = new WebSocket(SERVER_URL, { rejectUnauthorized: false });

  // Event listener for when the connection is established
  connection.on("open", function open() {
    console.log("connection open");
    connection?.send(JSON.stringify({ id: `talkgpt` }));
  });

  // Event listener for receiving messages from the server
  connection.on('message', (message) => {
    console.log(`Received from server: ${message}`);
  });

  // Event listener for handling errors
  connection.on('error', (error) => {
    console.error('WebSocket error:', error);
    setTimeout(() => {
      ConnectToWebSocketServer();
    }, 1000);
  });
  // Event listener for handling connection closure
  connection.on("close", function message(data) {
    console.log("connection close");
    setTimeout(() => {
      ConnectToWebSocketServer();
    }, 1000);
  });
}

ConnectToWebSocketServer();
