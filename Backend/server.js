const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user");
const usersRoutes = require("./routes/users");
const customerRoutes = require("./routes/customer");
const customersRoutes = require("./routes/customers");
const statusRoutes = require("./routes/status");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/status/", statusRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});