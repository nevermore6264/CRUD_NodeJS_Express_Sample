const db = require("../_helpers/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config.json");

module.exports = {
  login,
  signup,
};

async function login({ email, password }) {
  const user = await db.User.findOne({ where: { email } });

  // Kiểm tra nếu người dùng không tồn tại hoặc mật khẩu không khớp
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw "Email hoặc mật khẩu không chính xác";
  }

  // Tạo token JWT
  const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: "7d" });

  return {
    ...omitPassword(user.get()),
    token,
  };
}

async function signup(params) {
  // validate
  if (await db.User.findOne({ where: { email: params.email } })) {
    throw 'Email "' + params.email + '" đã được đăng ký';
  }

  // Hash mật khẩu
  if (params.password) {
    params.password = await bcrypt.hash(params.password, 10);
  }

  // Tạo người dùng mới
  const user = new db.User(params);

  // Lưu người dùng vào cơ sở dữ liệu
  await user.save();
}

// helper functions

function omitPassword(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
