const express = require('express');
const morgan = require("morgan");
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const app = express();
const port = 4201;
require("dotenv").config();
const cors = require("cors");


//const userRoutes = require("./routes/user.routes");

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());



//database connection
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.dyculxs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose
  .connect(uri)
  .then(() => console.log("Database connection established"))
  .catch((e) => console.error(e));


//route mid
//app.use("/user", userRoutes);

//app.get("*", (req, res) => {
  //res.send("404");
//});
app.get('/', (req, res) => {
res.send('Toimib!!!!');
});

app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});