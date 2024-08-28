const db = require("../_helpers/db");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  truncate,
  like,
  unlike,
};

async function getAll(userId) {
  // Lấy tất cả truyện cùng với thông tin danh mục, tác giả, và trạng thái đã thích
  const stories = await db.Story.findAll({
    include: [
      {
        model: db.Category,
        as: "category", // Alias cần trùng với alias trong thiết lập association của model Story
        attributes: ["id", "name", "description"],
      },
      {
        model: db.Author,
        as: "author", // Alias cần trùng với alias trong thiết lập association của model Story
        attributes: ["id", "name", "bio"],
      },
      {
        model: db.Favorite,
        as: "favorites", // Alias cần trùng với alias trong thiết lập association của model Story
        where: { userId: userId }, // Lọc danh sách yêu thích theo userId
        required: false, // Sử dụng LEFT JOIN để bao gồm truyện ngay cả khi không có lượt thích từ người dùng này
        attributes: [], // Không cần lấy thuộc tính từ model Favorite
      },
    ],
    attributes: {
      include: [
        [
          db.sequelize.literal(
            `(SELECT COUNT(*) FROM Favorites WHERE Favorites.storyId = Story.id AND Favorites.userId = ${userId})`
          ),
          "likedByUser",
        ],
      ],
    },
  });

  // Thêm trường likedByUser boolean vào mỗi truyện dựa trên kết quả COUNT
  return stories.map((story) => {
    const storyJson = story.toJSON();
    storyJson.likedByUser = storyJson.likedByUser > 0;
    return storyJson;
  });
}

async function getById(id, userId) {
  return await getStory(id, userId);
}

async function create(params) {
  // Kiểm tra trùng tiêu đề
  if (await db.Story.findOne({ where: { title: params.title } })) {
    throw 'Tiêu đề "' + params.title + '" đã được sử dụng';
  }

  const story = new db.Story(params);

  // Lưu truyện
  await story.save();
}

async function update(id, params) {
  const story = await getStory(id);

  // Kiểm tra trùng tiêu đề
  const titleChanged = params.title && story.title !== params.title;
  if (
    titleChanged &&
    (await db.Story.findOne({ where: { title: params.title } }))
  ) {
    throw 'Tiêu đề "' + params.title + '" đã được sử dụng';
  }

  // Sao chép tham số vào truyện và lưu
  Object.assign(story, params);
  await story.save();
}

async function _delete(id) {
  const story = await getStory(id);
  await story.destroy();
}

// Hàm hỗ trợ lấy truyện theo ID
async function getStory(id, userId) {
  const story = await db.Story.findByPk(id, {
    include: [
      {
        model: db.Category,
        as: "category", // Alias cần trùng với alias trong thiết lập association của model Story
        attributes: ["id", "name", "description"],
      },
      {
        model: db.Author,
        as: "author", // Alias cần trùng với alias trong thiết lập association của model Story
        attributes: ["id", "name", "bio"],
      },
      {
        model: db.Favorite,
        as: "favorites", // Alias cần trùng với alias trong thiết lập association của model Story
        where: { userId: userId }, // Lọc danh sách yêu thích theo userId
        required: false, // Sử dụng LEFT JOIN để bao gồm truyện ngay cả khi không có lượt thích từ người dùng này
        attributes: [], // Không cần lấy thuộc tính từ model Favorite
      },
    ],
    attributes: {
      include: [
        [
          db.sequelize.literal(
            `(SELECT COUNT(*) FROM Favorites WHERE Favorites.storyId = Story.id AND Favorites.userId = ${userId})`
          ),
          "likedByUser",
        ],
      ],
    },
  });

  if (!story) throw new Error("Không tìm thấy truyện");

  const storyJson = story.toJSON();
  storyJson.likedByUser = storyJson.likedByUser > 0;
  return storyJson;
}

// Hàm xóa tất cả dữ liệu trong bảng 'stories'
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

async function like(storyId, userId) {
  // Kiểm tra xem truyện có tồn tại hay không
  const story = await db.Story.findByPk(storyId);
  if (!story) throw "Không tìm thấy truyện";

  // Kiểm tra xem người dùng đã thích truyện này chưa
  const alreadyLiked = await db.Favorite.findOne({
    where: { storyId: storyId, userId: userId },
  });

  if (alreadyLiked) throw "Bạn đã thích truyện này rồi";

  // Thêm lượt thích mới
  await db.Favorite.create({ storyId, userId });
}

async function unlike(storyId, userId) {
  // Kiểm tra xem truyện có tồn tại hay không
  const story = await db.Story.findByPk(storyId);
  if (!story) throw "Không tìm thấy truyện";

  // Kiểm tra xem người dùng đã thích truyện này chưa
  const favorite = await db.Favorite.findOne({
    where: { storyId: storyId, userId: userId },
  });

  if (!favorite) throw "Bạn chưa thích truyện này";

  // Xóa lượt thích
  await favorite.destroy();
}
