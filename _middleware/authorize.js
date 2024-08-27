const jwt = require("jsonwebtoken");
const config = require("../config.json");

module.exports = function authorize(req, res, next) {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, config.secret, (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    // Thêm thông tin người dùng vào request
    req.user = { userId: user.sub, role: user.role }; // Extract user ID from 'sub' and role from 'role'
    next();
  });
};
