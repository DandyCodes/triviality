const router = require("express").Router();

router.get("/test", (req, res) => {
  res.status(204);
  res.send("hello");
});

module.exports = router;
