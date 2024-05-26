const express = require("express")
const router = express.Router()

const addressController = require("../controller/address.controller")

router.post("/address/add", addressController.addEnd)
router.post("/address/edit", addressController.editEnd)
router.post("/address/list", addressController.getAllEnds)

module.exports = router