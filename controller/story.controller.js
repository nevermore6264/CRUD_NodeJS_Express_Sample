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
router.post("/create", authorize, isAdmin, createStorySchema, createStory); // Tạo mới truyện
router.put("/:id", authorize, isAdmin, updateStorySchema, updateStory); // Cập nhật truyện
router.delete("/:id", authorize, isAdmin, deleteStory); // Xóa truyện

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

// Schema validation functions

function createStorySchema(req, res, next) {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    authorId: Joi.number().required(),
  });
  validateRequest(req, next, schema);
}

function updateStorySchema(req, res, next) {
  const schema = Joi.object({
    title: Joi.string().empty(""),
    content: Joi.string().empty(""),
    authorId: Joi.number().empty(""),
  });
  validateRequest(req, next, schema);
}
