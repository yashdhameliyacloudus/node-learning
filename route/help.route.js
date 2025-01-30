const express = require("express");
const router = express.Router();
const helpController = require("../controller/helpController");
router.post("/create", helpController.addHelp);
router.get("/get", helpController.getHelp);
router.patch("/update", helpController.updateHelp);
router.delete("/delete", helpController.deleteHelp);
module.exports = router;
