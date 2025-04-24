const express = require('express');
const morgan = require("morgan");
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const app = express();
const port = 4201;
require("dotenv").config();
const cors = require("cors");


const userRoutes = require("./routes/user.routes");
const eventRoutes = require("./routes/event.routes");
const galleryRoutes = require("./routes/gallery.routes");

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//server running
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
	});

//database connection
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.dyculxs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose
  .connect(uri)
  .then(() => console.log("Database connection established"))
  .catch((e) => console.error(e));


//route mid
app.use("/user", userRoutes);

app.use("/event", eventRoutes);

app.use("/gallery", galleryRoutes);


app.get("*", (req, res) => {
  res.send("404");
});

