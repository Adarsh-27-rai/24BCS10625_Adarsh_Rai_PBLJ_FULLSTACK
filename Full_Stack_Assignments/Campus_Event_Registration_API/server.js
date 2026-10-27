const express = require(express);
const mongoose = require(mongoose);
require("dotenv").config();

const app = express();

app.use(express.json());

const registrationRoutes = require("./Routes/registrationRoutes");
app.use("/api/registrations", registrationRoutes);

app.get("/", (req, res) => {
    res.send("Campus event registration api is running");
})

mongoose.connect(mongoose.connect(process.env.MONGO_URI).then(
    () => {
        console.log("MongoDB connected");
    }
)).catch(err => {
    console.log("Database connection failed", err.message);
})


app.listen(process.env.PORT || 5000, () => {
    console.log("Server started");
});