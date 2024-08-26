const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const storyService = require("../service/story.service");
const authorize = require("_middleware/authorize");
const isAdmin = require("_middleware/isAdmin");

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

module.exports = router;

// Các hàm xử lý route

function createStory(req, res, next) {
  storyService
    .create(req.body)
    .then(() => res.json({ message: "Story created successfully" }))
    .catch(next);
}

function getAllStories(req, res, next) {
  storyService
    .getAll()
    .then((stories) => res.json(stories))
    .catch(next);
}

function getStoryById(req, res, next) {
  storyService
    .getById(req.params.id)
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
  storyService
    .like(req.params.id, req.user.id) // Truyền ID của truyện và ID của người dùng
    .then(() => res.json({ message: "Liked story successfully" }))
    .catch(next);
}

// Hàm xử lý "unlike" truyện
async function unlikeStory(req, res, next) {
  storyService
    .unlike(req.params.id, req.user.id) // Truyền ID của truyện và ID của người dùng
    .then(() => res.json({ message: "Unliked story successfully" }))
    .catch(next);
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
