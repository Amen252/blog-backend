const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// --- PRODUCTION CORS CONFIGURATION ---
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://blog-frontend-phi-silk.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy error"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 200
};

// Apply CORS to all requests
app.use(cors(corsOptions));

// Handle preflight for ALL routes without using a string path 
// This avoids the 'path-to-regexp' error entirely
app.options('*', cors(corsOptions)); 

// If the above still fails, use this alternative instead:
// app.use((req, res, next) => {
//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(200);
//   }
//   next();
// });

// --------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});