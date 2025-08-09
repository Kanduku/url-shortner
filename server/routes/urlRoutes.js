const express = require("express");
const router = express.Router();
const { createShortUrl, getUserUrls, redirectToOriginal } = require("../controllers/urlController");
const userAuth = require("../middlewares/userAuth");

router.post("/shorten", userAuth, createShortUrl);
router.get("/shorten", userAuth, getUserUrls);
router.get("/:short_code", redirectToOriginal);

module.exports = router;
