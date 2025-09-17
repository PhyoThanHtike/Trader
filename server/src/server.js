import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import orderRoutes from './routes/order.route.js'
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(cookieParser()); 

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});