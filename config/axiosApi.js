const axios = require('axios');

// Create a common axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 60000, // Set a timeout for requests
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

module.exports = api;