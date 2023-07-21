const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008; // You can change the port number if needed

app.get('/numbers', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'No URLs provided in query parameters.' });
  }

  const urlList = Array.isArray(url) ? url : [url];
  const requests = urlList.map((url) =>
    axios
      .get(url.trim(), { timeout: 500 })
      .then((response) => response.data.numbers)
      .catch((error) => {
        console.error(`Error fetching data from ${url}:`, error);
        return [];
      })
  );

  try {
    const responses = await Promise.all(requests);
    const mergedNumbers = [...new Set(responses.flat())].sort((a, b) => a - b);
    return res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
