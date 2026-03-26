const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app.js");
const connectToDB = require("./src/config/database.js");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectToDB();
    app.listen(PORT, () => {
      console.log(`Server started at port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();