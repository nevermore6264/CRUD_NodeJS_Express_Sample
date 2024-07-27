const db = require("../_helpers/db");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  truncate
};

async function getAll() {
  return await db.Category.findAll();
}

async function getById(id) {
  return await getCategory(id);
}

async function create(params) {
  // validate
  if (await db.Category.findOne({ where: { name: params.name } })) {
    throw 'Category name "' + params.name + '" is already registered';
  }

  const category = new db.Category(params);

  // save category
  await category.save();
}

async function update(id, params) {
  const category = await getCategory(id);

  // validate
  const nameChanged = params.name && category.name !== params.name;
  if (
    nameChanged &&
    (await db.Category.findOne({ where: { name: params.name } }))
  ) {
    throw 'Category name "' + params.name + '" is already taken';
  }

  // copy params to category and save
  Object.assign(category, params);
  await category.save();
}

async function _delete(id) {
  const category = await getCategory(id);
  await category.destroy();
}

// helper functions

async function getCategory(id) {
  const category = await db.Category.findByPk(id);
  if (!category) throw "Category not found";
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
    console.log("Categories table truncated.");
  } catch (error) {
    console.error("Error truncating categories table:", error);
  }
}