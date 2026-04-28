const serverless = require("serverless-http");
const connectDB = require("../backend/src/config/db");
const app = require("../backend/src/app");

// Connect to MongoDB once per cold start
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  await connectDB();
  isConnected = true;
};

const handler = serverless(app);

module.exports = async (req, res) => {
  await connectToDatabase();
  return handler(req, res);
};
