const serverless = require("serverless-http");
const connectDB = require("../../backend/src/config/db");
const app = require("../../backend/src/app");

// Reuse the MongoDB connection across warm invocations
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  await connectDB();
  isConnected = true;
};

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectToDatabase();
  return handler(event, context);
};
