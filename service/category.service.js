const db = require("../_helpers/db");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  truncate,
};

async function getAll() {
  return await db.Category.findAll();
}

async function getById(id) {
  return await getCategory(id);
}

async function create(params) {
  // Kiểm tra tên danh mục đã tồn tại hay chưa
  if (await db.Category.findOne({ where: { name: params.name } })) {
    throw 'Tên danh mục "' + params.name + '" đã được đăng ký';
  }

  const category = new db.Category(params);

  // Lưu danh mục
  await category.save();
}

async function update(id, params) {
  const category = await getCategory(id);

  // Kiểm tra tên danh mục đã thay đổi và nếu đã tồn tại
  const nameChanged = params.name && category.name !== params.name;
  if (
    nameChanged &&
    (await db.Category.findOne({ where: { name: params.name } }))
  ) {
    throw 'Tên danh mục "' + params.name + '" đã được sử dụng';
  }

  // Cập nhật thông tin danh mục và lưu lại
  Object.assign(category, params);
  await category.save();
}

async function _delete(id) {
  const category = await getCategory(id);
  await category.destroy();
}

// Hàm hỗ trợ

async function getCategory(id) {
  const category = await db.Category.findByPk(id);
  if (!category) throw "Không tìm thấy danh mục";
  return category;
}

async function truncate() {
  try {
    // Thực hiện xóa toàn bộ dữ liệu trong bảng 'categories'
    await db.Category.destroy({
      where: {},
      truncate: true, // Chỉ thị xóa sạch bảng
      restartIdentity: true, // Reset auto-increment của ID
    });
    console.log("Bảng danh mục đã được xóa sạch.");
  } catch (error) {
    console.error("Lỗi khi xóa sạch bảng danh mục:", error);
  }
}
