const express=require("express");   // Loads the express package from nodemodules/express and store it in variable express
const cookieParser=require("cookie-parser");
const cors=require("cors");

const app=express();   

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://prep-ai-indol.vercel.app"
  ],
  credentials: true
};

// Manual CORS preflight handler — runs before everything, no path-to-regexp involved
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowed = corsOptions.origin;
  if (origin && allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
  }
  if (req.method === "OPTIONS") {
    return res.status(204).end();   // End preflight immediately
  }
  next();
});

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "prep-ai-backend",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// Set up API routes here 
const authRouter=require("./routes/auth.routes");
const interviewRouter=require("./routes/interview.routes");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);


     // Express.json() is middleware and it  converts json into javascript object

module.exports=app;
