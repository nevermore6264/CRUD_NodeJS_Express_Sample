const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const storyService = require("../service/story.service");
const authorize = require("_middleware/authorize");
const isAdmin = require("_middleware/isAdmin");
const gTTS = require("gtts"); // Import thư viện gTTS

// Routes dành cho admin và người dùng
router.get("/", authorize, getAllStories); // Lấy danh sách truyện (dành cho tất cả người dùng đã xác thực)
router.get("/:id", authorize, getStoryById); // Lấy thông tin truyện theo ID (dành cho tất cả người dùng đã xác thực)

// Routes dành cho admin
router.post("/", authorize, isAdmin, createStorySchema, createStory); // Tạo mới truyện
router.put("/:id", authorize, isAdmin, updateStorySchema, updateStory); // Cập nhật truyện
router.delete("/:id", authorize, isAdmin, deleteStory); // Xóa truyện

// API để "like" một truyện
router.post("/:id/like", authorize, likeStory);

// API để "unlike" một truyện
router.post("/:id/unlike", authorize, unlikeStory);

router.get("/:id/read-aloud", authorize, readStoryAloud); // Đọc truyện thành giọng nói

module.exports = router;

// Các hàm xử lý route

function createStory(req, res, next) {
  storyService
    .create(req.body)
    .then(() => res.json({ message: "Story created successfully" }))
    .catch(next);
}

function getAllStories(req, res, next) {
  const userId = req.user.userId;
  storyService
    .getAll(userId)
    .then((stories) => res.json(stories))
    .catch(next);
}

function getStoryById(req, res, next) {
  const userId = req.user.userId;
  storyService
    .getById(req.params.id, userId)
    .then((story) => res.json(story))
    .catch(next);
}

function updateStory(req, res, next) {
  storyService
    .update(req.params.id, req.body)
    .then(() => res.json({ message: "Story updated successfully" }))
    .catch(next);
}

function deleteStory(req, res, next) {
  storyService
    .delete(req.params.id)
    .then(() => res.json({ message: "Story deleted successfully" }))
    .catch(next);
}

// Hàm xử lý "like" truyện
async function likeStory(req, res, next) {
  // Lấy ID của truyện từ params và ID của người dùng từ token đã được giải mã
  const storyId = req.params.id;
  const userId = req.user.userId; // Ensure this is set by the authentication middleware
  storyService
    .like(storyId, userId) // Truyền ID của truyện và ID của người dùng
    .then(() => res.json({ message: "Liked story successfully" }))
    .catch(next);
}

// Hàm xử lý "unlike" truyện
async function unlikeStory(req, res, next) {
  // Lấy ID của truyện từ params và ID của người dùng từ token đã được giải mã
  const storyId = req.params.id;
  const userId = req.user.userId; // Ensure this is set by the authentication middleware
  storyService
    .unlike(storyId, userId) // Truyền ID của truyện và ID của người dùng
    .then(() => res.json({ message: "Unliked story successfully" }))
    .catch(next);
}

// Hàm xử lý đọc truyện thành giọng nói
async function readStoryAloud(req, res, next) {
  try {
    const storyId = req.params.id;
    const userId = req.user.userId;

    // Lấy thông tin truyện từ service
    const story = await storyService.getById(storyId, userId);
    const textToRead = story.content; // Đọc nội dung của truyện

    // Tạo instance gTTS với nội dung truyện và ngôn ngữ
    const gtts = new gTTS(textToRead, "vi"); // 'vi' là mã ngôn ngữ cho tiếng Việt

    // Gửi giọng đọc về client dưới dạng file audio mp3
    gtts.stream()
      .pipe(res)
      .on("finish", () => console.log("Đã hoàn thành chuyển đổi văn bản thành giọng nói"))
      .on("error", (err) => next(err));
  } catch (error) {
    next(error);
  }
}

// Schema validation functions

function createStorySchema(req, res, next) {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    authorId: Joi.number().required(),
    publishedAt: Joi.date().optional(), // Trường này có thể không bắt buộc
    status: Joi.string().valid("Published", "Draft").required(),
    categoryId: Joi.number().required(),
  });
  validateRequest(req, next, schema);
}

function updateStorySchema(req, res, next) {
  const schema = Joi.object({
    title: Joi.string().empty(""),
    content: Joi.string().empty(""),
    authorId: Joi.number().empty(""),
    publishedAt: Joi.date().optional(), // Trường này có thể không bắt buộc
    status: Joi.string().valid("Published", "Draft").optional(),
    categoryId: Joi.number().optional(),
  });
  validateRequest(req, next, schema);
}
