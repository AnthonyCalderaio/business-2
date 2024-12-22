require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Get API Key from environment variable
const API_KEY = process.env.RESEMBLE_API_KEY;

app.use(express.json());  // This is important for parsing the request body as JSON

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

// POST /api/projects
app.post('/create', async (req, res) => {
  const { projectName, description = '', isCollaborative = false, isArchived = false } = req.body;

  try {
    const response = await axios.post(
      'https://app.resemble.ai/api/v2/projects',
      {
        name: projectName,
        description, // Optional: Add a meaningful description
        is_collaborative: isCollaborative,
        is_archived: isArchived,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`, // Securely manage API keys
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error creating project:', error.message);
    res.status(500).json({ error: 'Failed to create project.' });
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

// Endpoint to get all clips from Resemble API
app.get('/clips', async (req, res) => {
  try {
    const project_uuid = req.query.project_uuid;  // Get voice_uuid from query parameters
    const response = await axios.get(`https://app.resemble.ai/api/v2/projects/${project_uuid}/clips?page=1&page_size=10`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      },
      params: {
        page: 1,
        page_size: 10
      }
    });

    const clips = response.data.items;
    res.json(clips);
  } catch (error) {
    console.error('Error fetching clips:', error);
    res.status(500).json({ message: 'Error fetching clips' });
  }
});

// Delete Clip Endpoint
app.delete('/deleteClip', async (req, res) => {
  const { projectUUID, clipUUID } = req.body;

  if (!projectUUID || !clipUUID) {
    return res.status(400).json({ error: 'projectUUID and clipUUID are required.' });
  }

  try {
    console.log('trying!')
    const response = await axios.delete(`https://app.resemble.ai/api/v2/projects/${projectUUID}/clips/${clipUUID}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    return res.status(200).json({ success: true, message: 'Clip deleted successfully.' });
  } catch (error) {
    console.log('trying! error')
    console.error('Error deleting clip:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data || 'An error occurred while deleting the clip.',
    });
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