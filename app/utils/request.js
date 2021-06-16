const axios = require('axios');

const request = axios.create({
  baseURL: process.env.AUTH0_DOMAIN,
  timeout: 1000,
  headers: { accept: 'application/json' }
});

module.exports = request;
