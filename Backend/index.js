import express from "express"
import connect from "./config/db.js";
import authRoutes from "./routes.js/authRoutes.js"
import listingRoutes from "./routes.js/listingRoutes.js"
import bookingRoutes from "./routes.js/bookingRoutes.js"
import dotenv from "dotenv";

dotenv.config();
const app=express();
const port=process.env.PORT || 3000;

connect();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});