const axios = require('axios');

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

const huggingfaceInstance = axios.create({
  baseURL: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
  headers: {
    Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
  },
});

module.exports = huggingfaceInstance;
