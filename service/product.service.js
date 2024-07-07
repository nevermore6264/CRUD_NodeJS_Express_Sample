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
  return await db.Product.findAll();
}

async function getById(id) {
  return await getProduct(id);
}

async function create(params) {
  // validate
  if (await db.Product.findOne({ where: { name: params.name } })) {
    throw 'Product name "' + params.name + '" is already registered';
  }

  const product = new db.Product(params);

  // save product
  await product.save();
}

async function update(id, params) {
  const product = await getProduct(id);

  // validate
  const nameChanged = params.name && product.name !== params.name;
  if (
    nameChanged &&
    (await db.Product.findOne({ where: { name: params.name } }))
  ) {
    throw 'Product name "' + params.name + '" is already taken';
  }

  // copy params to product and save
  Object.assign(product, params);
  await product.save();
}

async function _delete(id) {
  const product = await getProduct(id);
  await product.destroy();
}

// helper functions

async function getProduct(id) {
  const product = await db.Product.findByPk(id);
  if (!product) throw "Product not found";
  return product;
}

async function truncate() {
  try {
    // Thực hiện xóa toàn bộ dữ liệu trong bảng 'products'
    await db.Product.destroy({
      where: {},
      truncate: true, // Chỉ thị xóa sạch bảng
      restartIdentity: true, // Reset auto-increment của ID
    });
    console.log("Products table truncated.");
  } catch (error) {
    console.error("Error truncating products table:", error);
  }
}