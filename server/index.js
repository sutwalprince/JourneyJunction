const express = require("express");
const app = express();
const cors = require("cors");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");


app.use(cors());


app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(
  bodyParser.urlencoded({
    limit: "500mb",
    parameterLimit: 100000000,
    extended: true,
  })
);

// dotEnv Configuration
dotEnv.config({ path: "./.env" });

const port = process.env.PORT || 8084;

// mongoDB Configuration
mongoose
  .connect(process.env.MONGO_DB_CLOUD_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log("DB Connected");
  })
  .catch((error) => {
    // console.error(error);
    process.exit(1); // stop the process if unable to connect to mongodb
  });


// router configuration
app.use("/api/users", require("./routers/userRouter"));
app.use("/api/affiliate", require("./routers/affiliateRouter"));
app.use("/api/hotel", require("./routers/hotelRouter"));
app.use("/api/book", require("./routers/Bookingrouter"));


app.listen(port, () => {
  console.log(`Server Started at PORT : ${port}`);
});
