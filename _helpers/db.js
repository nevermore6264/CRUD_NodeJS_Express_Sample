const config = require("../config.json");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

// Khởi tạo đối tượng db để chứa các model và Sequelize instance
module.exports = db = {};

initialize();

// Hàm khởi tạo cơ sở dữ liệu và kết nối với Sequelize
async function initialize() {
  // Tạo cơ sở dữ liệu nếu chưa tồn tại
  const { host, port, user, password, database } = config.database;
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  // Kết nối đến cơ sở dữ liệu sử dụng Sequelize
  const sequelize = new Sequelize(database, user, password, {
    dialect: "mysql",
  });

  // Tải các model
  let models = [
    require("../model/product.model.js"),
    require("../model/category.model.js"),
    require("../model/user.model.js"),
    require("../model/author.model.js"),
    require("../model/story.model.js"),
    require("../model/comment.model.js"),
    require("../model/favorite.model.js"),
  ]; // Có thể thêm các model khác nếu cần

  // Khởi tạo các model và thêm vào đối tượng db
  models.forEach((model) => {
    const seqModel = model(sequelize, Sequelize.DataTypes);
    db[seqModel.name] = seqModel;
  });

  // Thiết lập các mối quan hệ giữa các model nếu có
  Object.keys(db).forEach((key) => {
    if ("associate" in db[key]) {
      db[key].associate(db);
    }
  });

  // Lưu trữ instance Sequelize trong đối tượng db để sử dụng sau này
  db.sequelize = sequelize;

  // Đồng bộ các model với cơ sở dữ liệu
  sequelize
    .sync({ force: false }) // Đặt force: true nếu muốn xóa và tạo lại bảng khi chúng đã tồn tại
    .then(() => {
      console.log("Database & tables created!"); // Thông báo khi cơ sở dữ liệu và bảng được tạo thành công
    })
    .catch((error) => {
      console.error("Unable to create tables, shutting down...", error); // Thông báo lỗi nếu có vấn đề trong quá trình tạo bảng
    });
}
