const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
  console.log('A user connected');

  // Send a JSON message to the client after they connect
  ws.send({ message: 'Hello from server!' });

  ws.on('message', (message) => {
    console.log('Received message from client:', message);

    // Here, you can process the message, and then send a response back to the client
    // For now, let's send back a simple acknowledgment in JSON format
    try {
      const data = JSON.parse(message); // Parse the incoming message
      const { pitch, speed, emotion } = data; // Get pitch, speed, and emotion
      console.log('Voice settings received:', pitch, speed, emotion);

      // Send a response back to the frontend in JSON format
      const response = {
        message: 'Voice settings received!',
        pitch: pitch,
        speed: speed,
        emotion: emotion,
      };

      // Send the response back as a JSON string
      ws.send(JSON.stringify(response));
    } catch (error) {
      console.error('Error parsing message:', error);
      ws.send(JSON.stringify({ error: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    console.log('A user disconnected');
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});
