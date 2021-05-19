const axios = require('axios');

const request = axios.create({
  baseURL: 'http://numbersapi.com',
  timeout: 1000,
  headers: { accept: 'application/json' }
});

module.exports = request;
