module.exports = function isAdmin(req, res, next) {
  console.log(req.user);
  if (req.user && req.user.role == "Admin") {
    // Nếu người dùng là admin, tiếp tục xử lý yêu cầu
    return next();
  } else {
    // Nếu không phải admin, trả về lỗi 403 Forbidden
    return res.status(403).json({ message: "Forbidden: Chỉ dành cho quản trị viên." });
  }
};
