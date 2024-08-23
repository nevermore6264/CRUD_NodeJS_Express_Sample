module.exports = function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    // Nếu người dùng là admin, tiếp tục xử lý yêu cầu
    return next();
  } else {
    // Nếu không phải admin, trả về lỗi 403 Forbidden
    return res.status(403).json({ message: "Forbidden: Admins only." });
  }
};
