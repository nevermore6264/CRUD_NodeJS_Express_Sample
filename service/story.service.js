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
  return await db.Story.findAll({
    include: [
      {
        model: db.Category,
        as: "category", // Alias này cần trùng với alias trong model Story khi thiết lập association
        attributes: ["id", "name", "description"], // Chọn các cột cần lấy từ bảng Category
      },
      {
        model: db.Author,
        as: "author", // Alias này cần trùng với alias trong model Story khi thiết lập association
        attributes: ["id", "name", "bio"], // Chọn các cột cần lấy từ bảng Author
      },
    ],
  });
}

async function getById(id) {
  return await getStory(id);
}

async function create(params) {
  // Kiểm tra
  if (await db.Story.findOne({ where: { title: params.title } })) {
    throw 'Tiêu đề "' + params.title + '" đã được sử dụng';
  }

  const story = new db.Story(params);

  // Lưu truyện
  await story.save();
}

async function update(id, params) {
  const story = await getStory(id);

  // Kiểm tra
  const titleChanged = params.title && story.title !== params.title;
  if (
    titleChanged &&
    (await db.Story.findOne({ where: { title: params.title } }))
  ) {
    throw 'Tiêu đề "' + params.title + '" đã được sử dụng';
  }

  // Sao chép tham số vào story và lưu
  Object.assign(story, params);
  await story.save();
}

async function _delete(id) {
  const story = await getStory(id);
  await story.destroy();
}

// Hàm hỗ trợ

async function getStory(id) {
  const story = await db.Story.findByPk(id, {
    include: [
      {
        model: db.Category,
        as: "category", // Alias này cần trùng với alias trong model Story khi thiết lập association
        attributes: ["id", "name", "description"], // Chọn các cột cần lấy từ bảng Category
      },
      {
        model: db.Author,
        as: "author", // Alias này cần trùng với alias trong model Story khi thiết lập association
        attributes: ["id", "name", "bio"], // Chọn các cột cần lấy từ bảng Author
      },
    ],
  });

  if (!story) throw new Error("Không tìm thấy truyện");

  return story;
}

// Hàm để xóa tất cả dữ liệu trong bảng 'stories'
async function truncate() {
  try {
    await db.Story.destroy({
      where: {},
      truncate: true,
    });
    console.log("Tất cả truyện đã được xóa.");
  } catch (error) {
    console.error("Lỗi khi xóa toàn bộ truyện:", error);
  }
}
