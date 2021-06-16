const axios = require('axios');

exports.requestAuth0 = axios.create({
  baseURL: process.env.AUTH0_DOMAIN,
  timeout: 1000,
  headers: { accept: 'application/json' }
});

exports.requestNumber = axios.create({
  baseURL: process.env.NUMBER_API_URL,
  timeout: 1000,
  headers: { accept: 'application/json' }
});
