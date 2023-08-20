// Import the WebSocket module
import { ipcMain } from 'electron';
import WebSocket from 'ws';
import { win } from './main';

var connectionId: string
var connection = null



export function ConnectToWebSocketServer() {

  win.on('focus', () => {
    console.log('Window focused');
    connection?.send(JSON.stringify({
      windowState: {
        connectionId: connectionId,
        identifier: `talkgpt`,
        isWindowFocused: true
      }
    }));
  
  });
  
  win.on('blur', () => {
    console.log('Window blurred');
    connection?.send(JSON.stringify({
      windowState: {
        connectionId: connectionId,
        identifier: `talkgpt`,
        isWindowFocused: false
      }
    }));
  
  });

  // WebSocket server URL
  const SERVER_URL = 'ws://localhost:1111';

  // Create a WebSocket client instance
  connection = new WebSocket(SERVER_URL);

  // Event listener for when the connection is established
  connection.on("open", function open() {
    console.log("connection open");
    connection?.send(JSON.stringify({ identifier: `talkgpt` }));
  });

  // Event listener for receiving messages from the server
  connection.on("message", function message(data) {

    const dataPacket = JSON.parse(`${data}`);
    console.log("received: %s", dataPacket);

    const command = Object.keys(dataPacket)[0];

    switch (command) {
      case "connectionId":
        connectionId = dataPacket.connectionId.timeStamp
        break;

      case "transcription":
        // apiProcessorGen3(dataPacket.spokenSentence, isFocused, windowID);
        win.webContents.send('transcription', dataPacket.transcription.spokenSentence);

      default:
        break;
    }
  });

  // Event listener for handling errors
  connection.on('error', (error) => {
    console.error('WebSocket error:', error);
    // setTimeout(() => {
    //   ConnectToWebSocketServer();
    // }, 1000);
  });
  // Event listener for handling connection closure
  connection.on("close", function message(data) {
    console.log("connection close");
    // setTimeout(() => {
    //   ConnectToWebSocketServer();
    // }, 1000);
  });
}

