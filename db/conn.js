const mongoose = require("mongoose");
const DB =process.env.URL

module.exports = new mongoose.connect(DB)
  .then(() => {
    console.log("message from db/coon database connected");
  })
  .catch((error) => {
    console.log("message from db/conn", error.message);
  });
