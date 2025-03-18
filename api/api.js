require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const userController = require("./controllers/userController");
const studentController = require("./controllers/studentController");
const miscController = require("./controllers/miscController");
const ftp = require("basic-ftp");
const { Readable } = require("stream");
const pathModule = require("path");
const rateLimit = require("express-rate-limit");
const ngrok = require("@ngrok/ngrok");
const morgan = require("morgan");
const xssClean = require("xss-clean");
const securityHeaders = require("./middlewares/securityHeaders");
const redis = require("redis");
const crypto = require("crypto");

const app = express();
const router = express.Router();

// Create and configure Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.connect();

// CORS Options
const corsOptions = {
  origin: "*",
  methods: "GET,PUT,POST",
  credentials: true,
  optionsSuccessStatus: 204,
};

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000,
  message: "Too many requests from this IP, please try again later.",
});

app.set("trust proxy", 1);
app.use("/api", apiLimiter);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(xssClean());
app.use(securityHeaders());
app.use(morgan("dev"));
app.use("/api", router);

const secretKey = process.env.secretKey;

// Authentication middleware
function isAuthenticated(request, response, next) {
  const token = request.headers.authorization?.split(" ")[1];
  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return response.status(401).json({ message: "Unauthorized" });
      }
      request.user = decoded;
      next();
    });
  } else {
    response.status(401).json({ message: "Unauthorized" });
  }
}

// Apply authentication middleware to all routes except login, reset, and verify
router.use((request, response, next) => {
  if (
    request.originalUrl.startsWith("/api/users/login") ||
    request.originalUrl.startsWith("/api/users/reset") ||
    request.originalUrl.startsWith("/api/verify")
  ) {
    return next();
  }
  isAuthenticated(request, response, next);
});

// --- Caching Middleware for Specific Routes ---

// Cache middleware for GET /users/:id
async function cacheUserMiddleware(req, res, next) {
  const { id } = req.params;
  const cacheKey = `user:${id}`;
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for user id: ${id}`);
      return res.json(JSON.parse(cachedData));
    }
    // Override res.json to cache the response before sending it
    res.sendResponse = res.json;
    res.json = (body) => {
      redisClient.setEx(cacheKey, 3600, JSON.stringify(body)); // Cache for 1 hour
      res.sendResponse(body);
    };
    next();
  } catch (err) {
    console.error("Redis error:", err);
    next();
  }
}

// Cache middleware for GET /students/:id
async function cacheStudentMiddleware(req, res, next) {
  const { id } = req.params;
  const cacheKey = `student:${id}`;
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for student id: ${id}`);
      return res.json(JSON.parse(cachedData));
    }
    res.sendResponse = res.json;
    res.json = (body) => {
      redisClient.setEx(cacheKey, 3600, JSON.stringify(body)); // Cache for 1 hour
      res.sendResponse(body);
    };
    next();
  } catch (err) {
    console.error("Redis error:", err);
    next();
  }
}

// Generic cache middleware for miscellaneous routes (works for both GET and POST)
// It uses a combination of the URL and request body (if any) to generate a unique cache key.
async function cacheGenericMiddleware(req, res, next) {
  // Generate a key based on the URL and, for POST requests, the body
  const bodyString = req.method === "POST" ? JSON.stringify(req.body) : "";
  const hash = crypto
    .createHash("md5")
    .update(req.originalUrl + bodyString)
    .digest("hex");
  const cacheKey = `${req.originalUrl}:${hash}`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for ${req.originalUrl}`);
      return res.json(JSON.parse(cachedData));
    }
    res.sendResponse = res.json;
    res.json = (body) => {
      redisClient.setEx(cacheKey, 3600, JSON.stringify(body)); // Cache for 1 hour
      res.sendResponse(body);
    };
    next();
  } catch (err) {
    console.error("Redis error:", err);
    next();
  }
}

// --- End of Caching Middleware ---

// Helper: Convert a Buffer to a Readable stream
function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

// Function to update the configuration file on FTP
async function updateConfigViaFTP(ngrokUrl) {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
      secure: process.env.FTP_SECURE === "true",
    });
    const configData = JSON.stringify({ ngrokUrl: ngrokUrl });
    const sourceStream = bufferToStream(Buffer.from(configData));
    const remotePath = process.env.FTP_UPLOAD_PATH;
    const remoteDir = pathModule.dirname(remotePath);
    await client.ensureDir(remoteDir);
    await client.uploadFrom(sourceStream, remotePath);
    console.log("Configuration updated on FTP server.");
  } catch (err) {
    console.error("FTP error:", err);
  }
  client.close();
}

// Store active ngrok listener
let activeNgrokListener = null;

// Function to encapsulate ngrok forwarding
async function startNgrokForward() {
  if (activeNgrokListener) {
    try {
      await activeNgrokListener.close();
      console.log("Closed previous ngrok tunnel.");
    } catch (err) {
      console.error("Error closing previous ngrok tunnel:", err);
    }
  }
  activeNgrokListener = await ngrok.forward({
    addr: "http://localhost:3000",
    authtoken_from_env: true,
    crt: fs.readFileSync("./credentials/cert.pem", "utf8"),
    key: fs.readFileSync("./credentials/key.pem", "utf8"),
  });
  console.log(`Ingress established at: ${activeNgrokListener.url()}`);
  await updateConfigViaFTP(activeNgrokListener.url());
}

// --- Routes ---

// User Routes (GET route uses caching middleware)
router.route("/users/:id").get(cacheUserMiddleware, userController.getUserById);
router.route("/users/filter").post(userController.filterBy);
router.route("/users/login/:studentno").post(userController.loginUser);
router.route("/users/logout").post(userController.logoutUser);
router.route("/users/reset").post(userController.resetUser);

// Student Routes (GET route uses caching middleware; PUT route invalidates the cache)
router
  .route("/students/:id")
  .get(cacheStudentMiddleware, studentController.getStudentById)
  .put(async (req, res) => {
    await studentController.updateStudent(req, res);
    // Invalidate the cache for the student after update
    const cacheKey = `student:${req.params.id}`;
    try {
      await redisClient.del(cacheKey);
      console.log(`Cache invalidated for student id: ${req.params.id}`);
    } catch (err) {
      console.error("Error invalidating cache:", err);
    }
  });

// Miscellaneous Routes with caching
router
  .route("/schedule/view")
  .post(cacheGenericMiddleware, miscController.viewSchedule);
router
  .route("/evaluation/view")
  .post(cacheGenericMiddleware, miscController.viewEvaluation);
router
  .route("/assessment/view")
  .post(cacheGenericMiddleware, miscController.viewAssessment);
router
  .route("/payments/view")
  .post(cacheGenericMiddleware, miscController.viewPayments);
router
  .route("/exams/count/:type")
  .get(cacheGenericMiddleware, miscController.countExams);
router
  .route("/course/category")
  .get(cacheGenericMiddleware, miscController.getCourse_category);
router
  .route("/config/defsysem")
  .get(cacheGenericMiddleware, miscController.getDefSYSEM);
router.route("/verify").get((req, res) => {
  res.json({ access: true });
});

// Start HTTPS server
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log("API is running at " + port);
  await startNgrokForward();
  setInterval(async () => {
    await startNgrokForward();
  }, 14400000); // 4 hours
  process.stdin.resume();
});
