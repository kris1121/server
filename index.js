import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";

dotenv.config();
const app = express();

//db
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('db connected'))
    .catch(err => console.log("DB ERROR =>", err));

const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
//router middleware
app.use("/api", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use('/api', orderRoutes);


app.listen(port,
    () => console.log(`Node server is running on PORT ${port}`));