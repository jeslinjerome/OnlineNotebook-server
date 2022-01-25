const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    req.json([])
});

module.exports = router;
