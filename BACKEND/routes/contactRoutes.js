// backend/routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const { handleContact } = require("../src/controllers/contactController");

router.post("/", handleContact);

module.exports = router;
