require("dotenv").config();
const path = require("path");
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
    origin: [
      "http://localhost:3000",
      "https://jazzy-clafoutis-d31c1b.netlify.app",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/", Middleware.checkRequestForAuthToken);
app.use("/admin", admin);
app.use("/user", user);

// app.use(express.static(path.join(__dirname, "build")));
// app.use("/app", express.static(path.join(__dirname, "build")));
// app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
