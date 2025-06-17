const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Allow CORS so your frontend can talk to this backend
const cors = require('cors');
app.use(cors());

// Route to get all countries
app.get('/countries', async (req, res) => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,capital,flags,region');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching countries:', error.message);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});