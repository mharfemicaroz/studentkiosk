require("dotenv").config(); // Load .env variables

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var fs = require("fs");
var jwt = require("jsonwebtoken");
var userController = require("./controllers/userController");
var studentController = require("./controllers/studentController");
var miscController = require("./controllers/miscController");
const ftp = require("basic-ftp");
const { Readable } = require("stream");
const pathModule = require("path");
const rateLimit = require("express-rate-limit");
const ngrok = require("@ngrok/ngrok");
const morgan = require("morgan");
const xssClean = require("xss-clean");
const securityHeaders = require("./middlewares/securityHeaders");

var app = express();
var router = express.Router();

const corsOptions = {
  origin: "*",
  methods: "GET,PUT,POST",
  credentials: true,
  optionsSuccessStatus: 204,
};

// Throttle middleware: limit each IP to 1000 requests per hour
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

// Middleware for logging the current URL and time taken
// router.use((request, response, next) => {
//   const start = Date.now();
//   response.on("finish", () => {
//     const elapsed = Date.now() - start;
//     console.log(`${request.method} ${request.originalUrl} ${elapsed}ms`);
//   });
//   next();
// });

// Apply authentication middleware to all routes except login and reset routes
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

// User Routes
router;
router.route("/users/:id").get(userController.getUserById);
router.route("/users/filter").post(userController.filterBy);
router.route("/users/login/:studentno").post(userController.loginUser);
router.route("/users/logout").post(userController.logoutUser);
router.route("/users/reset").post(userController.resetUser);

router
  .route("/students/:id")
  .get(studentController.getStudentById)
  .put(studentController.updateStudent);

// Special Routes
router.route("/schedule/view").post(miscController.viewSchedule);
router.route("/evaluation/view").post(miscController.viewEvaluation);
router.route("/assessment/view").post(miscController.viewAssessment);
router.route("/payments/view").post(miscController.viewPayments);
router.route("/exams/count/:type").get(miscController.countExams);
router.route("/course/category").get(miscController.getCourse_category);
router.route("/config/defsysem").get(miscController.getDefSYSEM);
router.route("/verify").get((req, res) => {
  res.json({ access: true });
});

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
      secure: process.env.FTP_SECURE === "true", // convert string to boolean
    });

    // Create JSON data with the new ngrok URL
    const configData = JSON.stringify({ ngrokUrl: ngrokUrl });

    // Convert the JSON buffer to a stream
    const sourceStream = bufferToStream(Buffer.from(configData));

    // Retrieve the remote upload path from .env (e.g., "public_html/config.json")
    const remotePath = process.env.FTP_UPLOAD_PATH;

    // Ensure the remote directory exists
    const remoteDir = pathModule.dirname(remotePath);
    await client.ensureDir(remoteDir);

    // Upload the file
    await client.uploadFrom(sourceStream, remotePath);
    console.log("Configuration updated on FTP server.");
  } catch (err) {
    console.error("FTP error:", err);
  }
  client.close();
}

// Store our active ngrok listener so we can close it before starting again
let activeNgrokListener = null;

// Encapsulate ngrok forwarding so we can re-invoke it
async function startNgrokForward() {
  // If a tunnel already exists, close it
  if (activeNgrokListener) {
    try {
      await activeNgrokListener.close();
      console.log("Closed previous ngrok tunnel.");
    } catch (err) {
      console.error("Error closing previous ngrok tunnel:", err);
    }
  }

  // Create a new tunnel
  activeNgrokListener = await ngrok.forward({
    addr: "http://localhost:3000",
    authtoken_from_env: true,
    crt: fs.readFileSync("./credentials/cert.pem", "utf8"),
    key: fs.readFileSync("./credentials/key.pem", "utf8"),
  });

  console.log(`Ingress established at: ${activeNgrokListener.url()}`);

  // Update the config file on your FTP server with the new ngrok URL
  await updateConfigViaFTP(activeNgrokListener.url());
}

// Start HTTPS server
var port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log("API is running at " + port);

  // Start ngrok for the first time
  await startNgrokForward();

  setInterval(async () => {
    await startNgrokForward();
  }, 14400000); // 4 hours in milliseconds

  process.stdin.resume();
});
