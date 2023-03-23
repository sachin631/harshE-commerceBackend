require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./db/conn");
const ProductModel = require("./models/ProductModel");
const defaultFunction = require("./defaultdata");
const router = require("./routes/router");
const cookieParser = require("cookie-parser");



app.use(express.json());
app.use(cookieParser(""));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(router);

const port = 6010;

app.listen(port, () => {
  console.log(`working properly at ${port}`);
});

defaultFunction();
