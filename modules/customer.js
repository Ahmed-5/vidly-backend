const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, required: true },
  isGold: Boolean,
  phone: { type: String, required: true, minlength: 5 }
});

const Customer = mongoose.model("Customer", customerSchema);

getCustomers = async () => {
  const customers = await Customer.find();
  return customers;
};

getCustomer = async id => {
  try {
    const customer = await Customer.findById(id);
    return customer;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

createCustomer = async c => {
  let customer = new Customer(c);
  try {
    customer = await customer.save();
    return customer;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

updateCustomer = async (id, c) => {
  try {
    const customer = await Customer.findByIdAndUpdate(id, c, { new: true });
    return customer;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

deleteCustomer = async id => {
  try {
    const customer = await Customer.findByIdAndDelete(id);
    return customer;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

function validateCustomer(customer) {
  schema = {
    name: Joi.string()
      .min(3)
      .required(),
    isGold: Joi.boolean(),
    phone: Joi.string()
      .min(5)
      .required()
  };
  return Joi.validate(customer, schema);
}

module.exports = {
  validateCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  customerSchema,
  Customer
};
