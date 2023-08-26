// Import the WebSocket module
import WebSocket from 'ws';
import { window } from './main';

var connectionId: number
var connection = null



export function ConnectToWebSocketServer() {

  // WebSocket server URL
  const SERVER_URL = 'ws://localhost:1111';

  // Create a WebSocket client instance
  connection = new WebSocket(SERVER_URL);

  // Event listener for when the connection is established
  connection.on("open", function open() {
    console.log("connection open");

    connectionId = Date.now()

    connection?.send(
      JSON.stringify({
        registerConnection: {
          connectionId: connectionId,
          identifier: `talkgpt`,
          isWindowFocused: window.isFocused,
        },
      })
    );
  });

  // Event listener for receiving messages from the server
  connection.on("message", function message(data) {

    const dataPacket = JSON.parse(`${data}`);
    console.log("received: %s", dataPacket);

    const command = Object.keys(dataPacket)[0];

    switch (command) {

      case "transcription":
        // apiProcessorGen3(dataPacket.spokenSentence, isFocused, windowID);
        window.webContents.send('transcription', dataPacket.transcription.spokenSentence);

      default:
        break;
    }
  });

  // Event listener for handling errors
  connection.on('error', (error) => {
    // console.error('WebSocket error:', error);
    connection = null
    connectionId = null

  });
  // Event listener for handling connection closure
  connection.on("close", function message(e) {
    connection = null
    connectionId = null

    window.webContents.send('error', e)
    console.log("connection close");
    setTimeout(() => {
      ConnectToWebSocketServer();
    }, 1000);
  });
}

export function SetupWindowState() {
  window.on('focus', () => {
    console.log('Window focused');
    connection?.send(JSON.stringify({
      windowState: {
        connectionId: connectionId,
        identifier: `talkgpt`,
        isWindowFocused: true
      }
    }));
    window.webContents.send('state', true)


  });

  window.on('blur', () => {
    console.log('Window blurred');
    connection?.send(JSON.stringify({
      windowState: {
        connectionId: connectionId,
        identifier: `talkgpt`,
        isWindowFocused: false
      }
    }));
    window.webContents.send('state', false)

  });
}
