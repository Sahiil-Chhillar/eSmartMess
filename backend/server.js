const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser')


const app = express();
app.use(express.json());
app.use(cookieParser()); // To parse cookies
app.use(cors({
    origin: "https://smart-mess-chi.vercel.app", // your frontend port
    credentials: true, // 👈 allow cookies
}));

dotenv.config();

const authRoutes = require("./routes/auth")
const menuRoutes = require("./routes/menu")
const attendanceRoutes = require("./routes/attendance")
const paymentRoutes = require("./routes/payment")
const complaintRoutes = require("./routes/complaint")
const noticeRoutes = require("./routes/notice")
const rebateRoutes = require("./routes/rebate")

const PORT = process.env.PORT || 3000;

// CONNECT TO MONGODB
connectDB();

app.get("/", (req, res) => {
    res.send("Welcome to SmartMess API");
})

app.use("/api/user", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/complaint", complaintRoutes);
app.use("/api/notice", noticeRoutes);
app.use("/api/rebate", rebateRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})