const express = require("express")
const router = express.Router()

const addressController = require("../controller/address.controller")

router.post("/add", addressController.addEnd)
router.post("/edit", addressController.editEnd)
router.post("/remove", addressController.removeEnd)
router.post("/list", addressController.getAllEnds)

module.exports = router