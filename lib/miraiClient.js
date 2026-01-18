require("dotenv").config();
const axios = require("axios");

const MIRAI_BASE_URL = process.env.MIRAI_URL || "http://127.0.0.1:8000";

async function callMirAI(endpoint, payload) {
  const response = await axios.post(`${MIRAI_BASE_URL}${endpoint}`, payload, {
    timeout: 30000,
  });
  return response.data;
}

module.exports = { callMirAI };
