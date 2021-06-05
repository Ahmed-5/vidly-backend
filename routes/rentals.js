const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Fawn = require("fawn");

Fawn.init(mongoose);

const {
  validateRental,
  getRentals,
  getRental,
  updateRental,
  deleteRental,
  Rental
} = require("../modules/rental");
const { Movie } = require("../modules/movie");
const { Customer } = require("../modules/customer");

router.get("/", async (req, res) => {
  const rentals = await getRentals();
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const rental = await getRental(req.params.id);
  rental ? res.send(rental) : res.status(404).send("Not found");
});

router.post("/", auth, async (req, res) => {
  const { error } = validateRental(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const movie = await Movie.findById(req.body.movieId);

  if (!movie) {
    res.status(400).send("invalid Movie");
    return;
  }
  if (movie.numberInStock === 0) {
    res.status(400).send("Movie is not in stock");
    return;
  }

  const customer = await Customer.findById(req.body.customerId);

  if (!customer) {
    res.status(400).send("invalid Customer");
    return;
  }

  let rental = new Rental({
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    },
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    }
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
    res.send(rental);
  } catch (error) {
    res.status(500).send("Something failed.");
  }
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const movie = await Movie.findById(req.body.movieId);

  if (!movie) {
    res.status(400).send("invalid Movie");
    return;
  }
  if (movie.numberInStock === 0) {
    res.status(400).send("Movie is not in stock");
    return;
  }

  const customer = await Customer.findById(req.body.customerId);

  if (!customer) {
    res.status(400).send("invalid Customer");
    return;
  }

  let rental = {
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    },
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    }
  };

  rental = await updateRental(req.params.id, rental, { new: true });
  rental ? res.send(rental) : res.status(404).send("Not found");
});

router.delete("/:id", auth, async (req, res) => {
  const rental = await deleteRental(req.params.id);
  rental ? res.send(rental) : res.status(404).send("Not found");
});

module.exports = router;
