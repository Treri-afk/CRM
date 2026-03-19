const express = require("express");
const cors = require("cors");
require("dotenv").config();


const usersRoutes = require("./routes/users");
const companiesRoutes = require("./routes/companies");
const customersRoutes = require("./routes/customers");
const statusRoutes = require("./routes/status");
const dealsRoutes = require("./routes/deals")

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/users", usersRoutes);
app.use("/api/companies", companiesRoutes)
app.use("/api/customers", customersRoutes);
app.use("/api/status/", statusRoutes);
app.use("/api/deals", dealsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});