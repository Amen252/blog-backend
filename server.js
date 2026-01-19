// --- FINAL CORS CONFIGURATION ---
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://blog-frontend-phi-silk.vercel.app" // Your live Vercel link
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error('CORS blocked: Origin not allowed'), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
// Handle preflight requests for all routes
app.options('*', cors()); 
// ----------------------------------