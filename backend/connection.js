require("dotenv").config()
const mongoose = require("mongoose")
mongoose.connect(process.env.MONGODB_ATLAS_URL)
.then(() => {
    console.log("mongodb connected");
  })
  .catch((e) => console.log(e));
  module.exports=mongoose.connection