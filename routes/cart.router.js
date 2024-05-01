const express = require("express")
const router = express.Router()
const cartController = require("../controller/cart.controller")

router.post("/", cartController.getAllProducts)
router.post("/addProduct", cartController.addProduct)
router.post("/editProduct", cartController.editCart)
router.post("/removeProduct", cartController.removeProduct)

module.exports = router