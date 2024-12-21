require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Get API Key from environment variable
const API_KEY = process.env.RESEMBLE_API_KEY;

app.use(express.json());  // This is important for parsing the request body as JSON

// OG worked
// Enable CORS for all routes
// app.use(cors());

// app.use(cors({
//   origin: 'http://localhost:4200', // Allow only requests from the Angular app
//   methods: ['GET', 'POST'], // Specify allowed HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
// }));


// Trying to fix cors issue
// const corsOptions = {
//   origin: ['https://voiceforge.netlify.app/','http://localhost:4200'], // Add your frontend URL
//   methods: ['GET', 'POST'],
// };

// app.use(cors(corsOptions));


// Latest attempt
const allowedOrigins = [
  'https://voiceforge.netlify.app',  // Your Netlify URL
  'http://localhost:4200',           // Local testing URL (if you're working locally)
];

app.use(cors({
  origin: (origin, callback) => {
    // Check if the origin is in the allowed list or if no origin is provided (for local testing)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);  // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'));  // Reject the request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Endping to get voices from Resemble API
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

// Endpoint to generate a voice preview from Resemble API
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

// Create voices from Resemble API
app.post('/create-voice', async (req, res) => {
  const { name, consent, dataset_url } = req.body;

  if (!name || !consent) {
    return res.status(400).json({ error: 'Name and consent are required.' });
  }

  const endpoint = `https://app.resemble.ai/api/v2/voices`;

  const payload = {
    name,
    consent,
    ...(dataset_url && { dataset_url }), // Add dataset_url only if provided
  };

  try {
    const response = await axios.post(endpoint, payload, {
      headers: {
        Authorization: `Token token=${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error creating voice:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create voice' });
  }
});

app.get('/test', async (req, res) =>{
  res.send('I\'m working!');
})


const port = process.env.PORT || 3000;  // Heroku sets the PORT env variable, otherwise fallback to 3000 locally
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});