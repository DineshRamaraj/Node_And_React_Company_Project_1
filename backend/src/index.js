const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectionDB = require("./config/db");
const router = require("./routes/routes");

dotenv.config();

connectionDB();

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use('/api', router);

app.listen(process.env.PORT, () => {
  console.log("Server Listening on Port is " + process.env.PORT);
});
