import express from "express";
const router = express.Router();

// 「/user/{ID}」にマッチする場合の処理
router.get("/:id", (req, res) => {
  res.send("hello " + req.params.id);
});

// 「/user/」にマッチする場合の処理
router.post("/", (req, res) => {
  res.send("hello " + req.body.name);
});

module.exports = router;
