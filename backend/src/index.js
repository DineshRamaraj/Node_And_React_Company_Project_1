const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectionDB = require("./config/db");
const router = require("./routes/routes");

dotenv.config();

connectionDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/', router);

app.listen(process.env.PORT, () => {
  console.log("Server Listening on Port is " + process.env.PORT);
});
