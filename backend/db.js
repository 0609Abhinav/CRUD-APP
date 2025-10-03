const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("myapp", "root", "123456789", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log("Sequelize connected to MySQL"))
  .catch((err) => console.error("Unable to connect:", err));

module.exports = sequelize;
