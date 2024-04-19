const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const ProductController = require('../controller/ProductController')


router.get("/usuarios", UserController.getUsers);
router.get("/produtos", ProductController.getProducts);

module.exports = router