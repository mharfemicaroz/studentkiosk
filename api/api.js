var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var fs = require("fs");
var https = require("https");
var userController = require("./controllers/userController");
var studentController = require("./controllers/studentController");
var miscController = require("./controllers/miscController");

var app = express();
var router = express.Router();

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/api", router);

// Middleware for logging
router.use((request, response, next) => {
  console.log("Middleware active");
  next();
});
// User Routes
router
  .route("/users")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/users/:id")
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

router.route("/users/filter").post(userController.filterBy);

router.route("/users/login").post(userController.loginUser);
router.route("/users/logout").post(userController.logoutUser);

// Student Routes
router
  .route("/students")
  .get(studentController.getAllStudents)
  .post(studentController.createStudent);

router
  .route("/students/:id")
  .get(studentController.getStudentById)
  .put(studentController.updateStudent)
  .patch(studentController.updateStudent)
  .delete(studentController.deleteStudent);

// Special Routes
router.route("/schedule/view").post(miscController.viewSchedule);
router.route("/evaluation/view").post(miscController.viewEvaluation);
router.route("/assessment/view").post(miscController.viewAssessment);
router.route("/payments/view").post(miscController.viewPayments);
router.route("/exams/count/:type").get(miscController.countExams);
router.route("/course/category").get(miscController.getCourse_category);
router.route("/config/defsysem").get(miscController.getDefSYSEM);

// Read SSL certificate and key files
var privateKey = fs.readFileSync("./credentials/key.pem", "utf8");
var certificate = fs.readFileSync("./credentials/cert.pem", "utf8");

var credentials = { key: privateKey, cert: certificate };

// Start HTTPS server
var port = process.env.PORT || 8081;
https.createServer(credentials, app).listen(port, () => {
  console.log("API is running at " + port);
});
