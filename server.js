require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const Middleware = require("./services/Middleware");
const connectDB = require("./db/dbcon");
const admin = require("./routes/admin");
const user = require("./routes/user");

connectDB();
const PORT = process.env.PORT;
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/", Middleware.checkRequestForAuthToken);
app.use("/admin", admin);
app.use("/user", user);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
