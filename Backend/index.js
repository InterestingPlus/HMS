const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const {
  getDoctor,
  getAllDoctors,
  addDoctor,
  loginDoctor,
  getAuthenticatedDoctor,
  TopDoctors,
} = require("./controllers/doctor.controller.js");

const {
  loginPatient,
  getAuthenticatedPatient,
  addPatient,
} = require("./controllers/patient.controller.js");
const {
  addAppointment,
  getAppointmentsPatient,
  getAppointmentsDoctor,
  updateStatus,
  checkBookedAppointments,
} = require("./controllers/appointment.controller.js");

const { otpVerification } = require("./controllers/email.controller.js");

const app = express();

// Middleware for enabling multiple origins in CORS
const corsOptions = {
  origin: ["http://localhost:3000", "https://MediConnect-hms.netlify.app"],
  methods: "GET,POST,DELETE",
};

// Create an HTTP server to use with Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: corsOptions, 
});

// Add Socket.IO connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("status", (data) => {
    console.log("Notification received:", data);
    io.emit("new-notification", data);
  });
 
});
module.exports = { io };

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
const db_uri = process.env.DATABASE_URI;
const PORT = process.env.PORT || 2000;

mongoose
  .connect(db_uri)
  .then(() => {
    console.log("Connected to MongoDB...!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB : ", error);
  });

// Routes
app.get("/", (req, res) => {
  res.send("MediConnect : Hospital Management System Backend!");
});
app.get("/get-doctor", getAllDoctors);
app.get("/top-doctor", TopDoctors);
app.post("/doctor", getDoctor);

app.post("/login-doctor", loginDoctor);
app.post("/create-doctor", addDoctor);
app.post("/auth-doctor", getAuthenticatedDoctor);

app.post("/login-patient", loginPatient);
app.post("/create-patient", addPatient);
app.post("/auth-patient", getAuthenticatedPatient);

app.post("/create-appointment", addAppointment);
app.post("/get-appointments-patient", getAppointmentsPatient);
app.post("/get-appointments-doctor", getAppointmentsDoctor);
app.post("/update-status", updateStatus);

app.post("/check-booked-appointments", checkBookedAppointments);

app.post("/otp-verification", otpVerification);

// Start the server with Socket.IO
server.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`);
});
