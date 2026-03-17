const express = require("express");
require("dotenv").config();

const userRoutes = require("./routes/user");
const usersRoutes = require("./routes/users");

const app = express();

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/users", usersRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});