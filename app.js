const express = require('express');
const dotenv = require('dotenv');
const axios = require("axios");
const cors = require("cors");
const {DateTime} = require("luxon");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({ origin: true }));

dotenv.config();

app.use("/asana", require("./routes/asana"));
app.use("/hubspot", require("./routes/hubspot"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});