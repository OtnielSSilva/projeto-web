import express from "express";
import connectDB from "./config/database";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import gameRoutes from "./routes/games";
import wishlistRoutes from "./routes/wishlist";
import cartRoutes from './routes/cartRoutes';
import commentRoutes from "./routes/comments";

import "./jobs/scheduleJob";

const app = express();

dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use("/api/comments", commentRoutes); 


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
