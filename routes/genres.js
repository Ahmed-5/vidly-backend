const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();

const {
  validateGenre,
  getGenres,
  getGenre,
  updateGenre,
  deleteGenre
} = require("../modules/genre");

router.get("/", async (req, res) => {
  const genres = await getGenres();
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  const genre = await getGenre(req.params.id);
  genre ? res.send(genre) : res.status(404).send("Not found");
});

router.post("/", auth, async (req, res) => {
  console.log(req.body);
  const { error } = validateGenre(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const genre = await createGenre({ name: req.body.name });
  res.send(genre);
});

router.put("/:id", auth, async (req, res) => {
  let genre = { name: req.body.name };

  const { error } = validateGenre(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  genre = await updateGenre(req.params.id, genre, { new: true });
  genre ? res.send(genre) : res.status(404).send("Not found");
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await deleteGenre(req.params.id);
  genre ? res.send(genre) : res.status(404).send("Not found");
});

module.exports = router;
