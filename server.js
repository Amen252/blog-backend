const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --- PRODUCTION CORS CONFIGURATION ---
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "http://127.0.0.1:5173", // Local development (alternative)
  "https://blog-frontend-phi-silk.vercel.app" // Your live Vercel URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, or curl)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(new Error("CORS policy: This origin is not allowed access."));
      }
    },
    credentials: true, // Required for sending/receiving cookies and Auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
  })
);

// Explicitly handle pre-flight requests (OPTIONS) for all routes
app.options("*", cors());
// --------------------------------------

// Standard Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging Middleware (To see requests in Render logs)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin || "No Origin"}`);
  next();
});

// Routes
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// Base Health Check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`✅ Whitelisted Origins: ${allowedOrigins.join(", ")}`);
});