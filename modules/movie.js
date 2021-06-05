const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
    trim: true
  },
  genre: { type: genreSchema, required: true },
  numberInStock: { type: Number, min: 0, max: 255, required: true },
  dailyRentalRate: { type: Number, min: 0, max: 255, required: true }
});

const Movie = mongoose.model("Movie", movieSchema);

getMovies = async () => {
  const movies = await Movie.find();
  return movies;
};

getMovie = async id => {
  try {
    const movie = await Movie.findById(id);
    return movie;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

createMovie = async c => {
  let movie = new Movie(c);
  try {
    movie = await movie.save();
    return movie;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

updateMovie = async (id, c) => {
  try {
    const movie = await Movie.findByIdAndUpdate(id, c, { new: true });
    return movie;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

deleteMovie = async id => {
  try {
    const movie = await Movie.findByIdAndDelete(id);
    return movie;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

function validateMovie(movie) {
  schema = {
    title: Joi.string()
      .min(3)
      .max(255)
      .required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number()
      .min(0)
      .max(255)
      .required(),
    dailyRentalRate: Joi.number()
      .min(0)
      .max(255)
      .required()
  };
  return Joi.validate(movie, schema);
}

module.exports = {
  validateMovie,
  getMovies,
  getMovie,
  updateMovie,
  deleteMovie,
  movieSchema,
  Movie
};
