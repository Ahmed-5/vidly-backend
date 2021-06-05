const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

const {
  validateMovie,
  getMovies,
  getMovie,
  updateMovie,
  deleteMovie
} = require("../modules/movie");
const { Genre } = require("../modules/genre");

router.get("/", async (req, res) => {
  const movies = await getMovies();
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await getMovie(req.params.id);
  movie ? res.send(movie) : res.status(404).send("Not found");
});

router.post("/", auth, async (req, res) => {
  const { error } = validateMovie(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const genre = await Genre.findById(req.body.genreId);

  if (!genre) {
    res.status(400).send("invalid Genre");
    return;
  }

  let movie = {
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  };

  movie = await createMovie(movie);
  res.send(movie);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const genre = await Genre.findById(req.body.genreId);

  if (!genre) {
    res.status(400).send("invalid Genre");
    return;
  }

  let movie = {
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  };

  movie = await updateMovie(req.params.id, movie, { new: true });
  movie ? res.send(movie) : res.status(404).send("Not found");
});

router.delete("/:id", auth, async (req, res) => {
  const movie = await deleteMovie(req.params.id);
  movie ? res.send(movie) : res.status(404).send("Not found");
});

module.exports = router;
