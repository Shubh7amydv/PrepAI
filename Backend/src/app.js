const express=require("express");   // Loads the express package from nodemodules/express and store it in variable express
const cookieParser=require("cookie-parser");

const app=express();   
const cors=require("cors");


app.use(express.json());           // This creates the server application and you can do app.get("/users"), app.post("/login"), app.listen(3000)

app.use(cookieParser());

app.use(cors({
     origin:"http://localhost:5173",
     credentials:true
}))

// Set up API routes here 
const authRouter=require("./routes/auth.routes");

app.use("/api/auth", authRouter);


     // Express.json() is middleware and it  converts json into javascript object

module.exports=app;
