const express = require("express");
const { requireSignin, adminMiddleware } = require("../../middleware");
const { initialData } = require("../../controller/admin/initialData");
const router = express.Router();

router.post("/initialdata", initialData);

module.exports = router;
