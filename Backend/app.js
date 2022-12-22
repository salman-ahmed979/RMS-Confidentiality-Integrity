const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { validateToken } = require("../Backend/middleware/JWT");
const { validRole } = require("./middleware/ValidRole");
const userRoute = require("./routes/userRoute");
const operationRoute = require("./routes/operationRoute");

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/user", userRoute);

app.use("/record", validateToken, validRole, operationRoute);

module.exports = app;
