const mongoose = require("mongoose");
require("dotenv").config();

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DataBase connected succesfully");
    })
    .catch((err) => console.log("Error connecting to Database", err));
