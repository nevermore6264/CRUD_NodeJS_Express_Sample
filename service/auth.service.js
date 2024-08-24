const db = require("../_helpers/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config.json");

module.exports = {
  login,
  signup,
};

async function login({ email, password }) {
  // Tìm user bằng email
  const user = await db.User.findOne({ where: { email } });

  // Kiểm tra xem user có tồn tại hay không
  if (!user) {
    throw 'User không tồn tại'; // Bạn có thể sửa đổi thông báo này theo ý muốn
  }

  // So sánh mật khẩu đã băm
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw 'Mật khẩu không đúng'; // Thông báo lỗi khi mật khẩu không đúng
  }

  // Tạo token JWT
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return {
    ...omitPassword(user.get()),
    token
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
