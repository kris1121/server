import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js"

dotenv.config();
const app = express();

//db
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('db connected'))
    .catch(err => console.log("DB ERROR =>", err));

const port = process.env.PORT || 3000;

//router middleware
app.use("/api", authRoutes);


app.listen(port,
    () => console.log(`Node server is running on PORT ${port}`));