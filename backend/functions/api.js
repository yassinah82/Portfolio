const serverless = require("serverless-http");

const app = require("../src/app");
const connectDB = require("../src/config/db");

// Keep track of connection state across warm invocations
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  await connectDB();
  isConnected = true;
};

// Wrap Express app for serverless
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectToDatabase();
  return await handler(event, context);
};
