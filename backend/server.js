require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

// Connect to database then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`
🚀 Portfolio Backend Server
━━━━━━━━━━━━━━━━━━━━━━━━━━
   Port:  ${PORT}
   Mode:  ${process.env.NODE_ENV || "development"}
   API:   http://localhost:${PORT}/api
━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  });
});
