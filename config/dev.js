const env = require("dotenv");

// environment variable
env.config();

module.exports = {
  MONGOURI: `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.pbxhz.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
  JWT_SECRETE: `${process.env.JWT_SECRET}`,
  SENDGRID_API: `${process.env.SENDGRID_API}`,
  EMAIL: "http:localhost:3000",
};
