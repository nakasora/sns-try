const express = require("express");
const authRoute = require("./routes/auth");
const app = express();
const PORT = 5000;

app.use(express.json());
app.use("/api/auth", authRoute);

app.listen(PORT, () => console.log("server start"));
