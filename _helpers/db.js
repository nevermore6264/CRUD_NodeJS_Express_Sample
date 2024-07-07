const config = require("../config.json");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

module.exports = db = {};

initialize();

async function initialize() {
  // create db if it doesn't already exist
  const { host, port, user, password, database } = config.database;
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  // connect to db
  const sequelize = new Sequelize(database, user, password, {
    dialect: "mysql",
  });

  let models = [
    require("../model/product.model.js"),
    require("../model/category.model.js"),
  ]; // Add more models as required

  // Initialize models
  models.forEach((model) => {
    const seqModel = model(sequelize, Sequelize);
    db[seqModel.name] = seqModel;
  });

  // Apply associations
  Object.keys(db).forEach((key) => {
    if ("associate" in db[key]) {
      db[key].associate(db);
    }
  });

  db.sequelize = sequelize;

  // Sync models with database
  sequelize
    .sync({ force: false }) // Set force: true to drop tables if they already exist and recreate them
    .then(() => {
      console.log("Database & tables created!");
    })
    .catch((error) => {
      console.error("Unable to create tables, shutting down...", error);
    });
}
