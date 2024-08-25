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
  return await db.Story.findAll();
}

async function getById(id) {
  return await getStory(id);
}

async function create(params) {
  // validate
  if (await db.Story.findOne({ where: { title: params.title } })) {
    throw 'Title "' + params.title + '" is already taken';
  }

  const story = new db.Story(params);

  // save story
  await story.save();
}

async function update(id, params) {
  const story = await getStory(id);

  // validate
  const titleChanged = params.title && story.title !== params.title;
  if (
    titleChanged &&
    (await db.Story.findOne({ where: { title: params.title } }))
  ) {
    throw 'Title "' + params.title + '" is already taken';
  }

  // copy params to story and save
  Object.assign(story, params);
  await story.save();
}

async function _delete(id) {
  const story = await getStory(id);
  await story.destroy();
}

// helper functions

async function getStory(id) {
  const story = await db.Story.findByPk(id);
  if (!story) throw "Story not found";
  return story;
}

// Hàm để xóa tất cả dữ liệu trong bảng 'stories'
async function truncate() {
  try {
    await Story.destroy({
      where: {},
      truncate: true,
    });
    console.log("All stories have been deleted.");
  } catch (error) {
    console.error("Error truncating stories:", error);
  }
}
