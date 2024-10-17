const { app } = require("./config/expressConfig");
const connectDb = require("./config/dbConfig");
const config = require("./config");

require("dotenv").config();
const PORT = config.conf.port || 5000;

connectDb(`${process.env.DB_URL}`);

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
