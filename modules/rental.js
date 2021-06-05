const mongoose = require("mongoose");
const Joi = require("joi");
const { movieSchema } = require("./movie");
const { customerSchema } = require("./customer");

const rentalSchema = new mongoose.Schema({
  movie: { type: movieSchema, required: true },
  customer: { type: customerSchema, required: true },
  dateOut: { type: Date, required: true, default: Date.now },
  dateReturned: { type: Date },
  rentalFee: { type: Number, min: 0 }
});

const Rental = mongoose.model("Rental", rentalSchema);

getRentals = async () => {
  const rentals = await Rental.find();
  return rentals;
};

getRental = async id => {
  try {
    const rental = await Rental.findById(id).sort("-dateOut");
    return rental;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

createRental = async c => {
  let rental = new Rental(c);
  try {
    rental = await rental.save();
    return rental;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

updateRental = async (id, c) => {
  try {
    const rental = await Rental.findByIdAndUpdate(id, c, { new: true });
    return rental;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

deleteRental = async id => {
  try {
    const rental = await Rental.findByIdAndDelete(id);
    return rental;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

function validateRental(rental) {
  schema = {
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required()
  };
  return Joi.validate(rental, schema);
}

module.exports = {
  validateRental,
  getRentals,
  getRental,
  updateRental,
  deleteRental,
  rentalSchema,
  Rental
};
