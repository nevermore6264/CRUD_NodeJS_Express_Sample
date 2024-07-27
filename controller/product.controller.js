const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const productService = require("../service/product.service");

// routes
router.get("/get-all", getAll);
router.get("/find-one/:id", getById);
router.post("/insert", createSchema, create);
router.put("/update/:id", updateSchema, update);
router.delete("/delete/:id", _delete);

module.exports = router;

// route functions
function getAll(req, res, next) {
  productService
    .getAll()
    .then((products) => res.json(products))
    .catch(next);
}

function getById(req, res, next) {
  productService
    .getById(req.params.id)
    .then((product) => res.json(product))
    .catch(next);
}

function create(req, res, next) {
  productService
    .create(req.body)
    .then(() => {
      res.json({ message: "Product created" });
    })
    .catch(next);
}

function update(req, res, next) {
  productService
    .update(req.params.id, req.body)
    .then(() => res.json({ message: "Product updated" }))
    .catch(next);
}

function _delete(req, res, next) {
  productService
    .delete(req.params.id)
    .then(() => res.json({ message: "Product deleted" }))
    .catch(next);
}

// schema functions
function createSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().positive().required(),
    description: Joi.string().optional(),
    categoryId: Joi.number().integer().positive().required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().empty(""),
    price: Joi.number().positive().empty(""),
    description: Joi.string().empty(""),
    categoryId: Joi.number().integer().positive().empty(""),
  });
  validateRequest(req, next, schema);
}
