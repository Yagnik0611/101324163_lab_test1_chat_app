const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const adminsRouter = require("./routes/admins");
// const clientsRouter = require('./routes/clients')
const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");
const bodyParser = require('body-parser');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50mb"}));




app.use("/admin", adminsRouter);
app.use("/auth", loginRouter);
// app.use("/client",clientsRouter)
app.use("/user", usersRouter);

const uri = process.env.ATLAS_URI;
mongoose.set("strictQuery", false);
mongoose.connect(uri);

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
