import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();

//db
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('db connected'))
    .catch(err => console.log("DB ERROR =>", err));

const port = process.env.PORT || 3000;

app.get('/users', (req, res) => {
    res.json({
        data: 'Kris says hello hi'
    })
})


app.listen(port,
    () => console.log(`Node server is running on PORT ${port}`));