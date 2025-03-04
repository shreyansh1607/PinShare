const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoute = require("./routes/users");
const pinRoute = require("./routes/pins");

dotenv.config();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

mongoose 
 .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        })   
 .then(() => console.log("MongoDB connected!"))
 .catch(err => console.log(err));

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});