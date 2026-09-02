const express = require("express");
const router = express.Router();
const itemController = require("./item_Controller");
const auth = require('../middleware/auth');
const upload = require("../middleware/upload");

router.get("/add", auth,itemController.addItemPage);
router.post("/add", auth , upload.single("photo") , itemController.addItem);

router.get("/edit/:id",auth, itemController.editItemPage);
router.post("/edit/:id",auth, upload.single("photo"), itemController.editItem);

router.get("/delete/:id",auth, itemController.deleteItem);
router.get("/products",itemController.renderProductPage);

module.exports = router;
