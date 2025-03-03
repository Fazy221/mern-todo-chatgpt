const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("./passportConfig");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SECRET_KEY, // Replace with your secret key
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Use the todos routes
const todosRoutes = require("./routes/todos");
app.use("/todos", todosRoutes);

// Use the auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// API Routes
app.get("/", (req, res) => {
  res.send("Todo API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
