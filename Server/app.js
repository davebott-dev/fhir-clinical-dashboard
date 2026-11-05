require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const apiRoute = require('./routes/api');

app.use('/api', apiRoute); // Use the API routes for any requests starting with /api

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});