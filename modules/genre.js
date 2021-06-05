const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, required: true }
});

const Genre = mongoose.model("Genre", genreSchema);

getGenres = async () => {
  const genres = await Genre.find();
  return genres;
};

getGenre = async id => {
  try {
    const genre = await Genre.findById(id);
    return genre;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

createGenre = async c => {
  let genre = new Genre(c);
  try {
    genre = await genre.save();
    return genre;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

updateGenre = async (id, c) => {
  try {
    const genre = await Genre.findByIdAndUpdate(id, c, { new: true });
    return genre;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

deleteGenre = async id => {
  try {
    const genre = await Genre.findByIdAndDelete(id);
    return genre;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

function validateGenre(genre) {
  schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(genre, schema);
}

module.exports = {
  validateGenre,
  getGenres,
  getGenre,
  updateGenre,
  deleteGenre,
  genreSchema,
  Genre
};
