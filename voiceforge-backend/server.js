require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Get API Key from environment variable
const API_KEY = process.env.RESEMBLE_API_KEY;

// Enable CORS for all routes
app.use(cors());

// Optionally, allow CORS only from specific origin (Angular frontend)
app.use(cors({
  origin: 'http://localhost:4200', // Allow only requests from the Angular app
  methods: ['GET', 'POST'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

app.get('/voices', async (req, res) => {
  if (!API_KEY) {
    console.error('API key is missing!');
    return res.status(500).json({ error: 'API key is missing!' });
  }

  console.log('Using API Key:', API_KEY);  // This should log the correct API key

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

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
