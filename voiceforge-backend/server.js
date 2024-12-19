require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Get API Key from environment variable
const API_KEY = process.env.RESEMBLE_API_KEY;

app.use(express.json());  // This is important for parsing the request body as JSON

// Enable CORS for all routes
app.use(cors());

// Optionally, allow CORS only from specific origin (Angular frontend)
app.use(cors({
  origin: 'http://localhost:4200', // Allow only requests from the Angular app
  methods: ['GET', 'POST'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));



// Endping to get voices
app.get('/voices', async (req, res) => {
  if (!API_KEY) {
    console.error('API key is missing!');
    return res.status(500).json({ error: 'API key is missing!' });
  }


  const endpoint = 'https://app.resemble.ai/api/v1/voices';

  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    res.json(response.data); // Send voices data back to the frontend
  } catch (error) {
    console.error('Error fetching voices:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch voices' });
  }
});

// Endpoint to generate a voice preview
app.post('/preview', async (req, res) => {
  const { projectId, voiceId, text, pitch, speed, emotion } = req.body;

  if (!voiceId || !text || !pitch || !speed || !emotion) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const endpoint = `https://app.resemble.ai/api/v2/projects/${projectId}/clips`; // Updated endpoint


  try {
    const response = await axios.post(endpoint, {
      title: "Voice Preview", // Static title
      voice_uuid: voiceId,    // The selected voice ID
      body: text,             // The text to synthesize
    }, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    // Assuming the API responds with a URL to the generated audio
    const audioUrl = response.data;

    return res.json({ audioUrl });
  } catch (error) {
    console.error('Error generating voice preview:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate preview' });
  }
});

// Get projects from Resemble API
app.get('/projects', async (req, res) => {
  try {
    const response = await axios.get(`https://app.resemble.ai/api/v2/projects?page=1&page_size=10`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      params: {
        page: 1,
        page_size: 10, // Adjust page size as needed
      },
    });

    // const projects = response.data.data.map(project => ({
    //   uuid: project.uuid, // Extract only the uuid and other details you need
    //   name: project.name,
    // }));

    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching projects:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});




app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
