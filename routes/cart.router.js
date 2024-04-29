const express = require("express")
const router = express.Router()

const cartController = require("../controller/cart.controller")

router.get("/", cartController.getAllProducts)
router.post("/addProduct", cartController.addProduct)


module.exports = router