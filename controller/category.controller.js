const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const categoryService = require("../service/category.service");

// routes
router.get("/get-all", getAllCategories);
router.get("/find-one/:id", getCategoryById);
router.post("/insert", createCategorySchema, createCategory);
router.put("/update/:id", updateCategorySchema, updateCategory);
router.delete("/delete/:id", deleteCategory);

module.exports = router;

// route functions
function getAllCategories(req, res, next) {
  categoryService
    .getAll()
    .then((categories) => res.json(categories))
    .catch(next);
}

function getCategoryById(req, res, next) {
  categoryService
    .getById(req.params.id)
    .then((category) => res.json(category))
    .catch(next);
}

function createCategory(req, res, next) {
  categoryService
    .create(req.body)
    .then(() => {
      res.json({ message: "Category created" });
    })
    .catch(next);
}

function updateCategory(req, res, next) {
  categoryService
    .update(req.params.id, req.body)
    .then(() => res.json({ message: "Category updated" }))
    .catch(next);
}

function deleteCategory(req, res, next) {
  categoryService
    .delete(req.params.id)
    .then(() => res.json({ message: "Category deleted" }))
    .catch(next);
}

// schema functions
function createCategorySchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
  });
  validateRequest(req, next, schema);
}

function updateCategorySchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().empty(""),
    description: Joi.string().empty(""),
  });
  validateRequest(req, next, schema);
}