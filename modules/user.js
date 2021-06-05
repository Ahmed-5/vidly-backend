const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, maxlength: 100, required: true },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    unique: true
  },
  password: { type: String, required: true, minlength: 6, maxlength: 1024 },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

getUsers = async () => {
  const users = await User.find().sort("name");
  return users;
};

getUser = async id => {
  try {
    const user = await User.findById(id).select("-password");
    return user;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

createUser = async c => {
  let user = new User(c);
  try {
    user = await user.save();
    return user;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

updateUser = async (id, c) => {
  try {
    const user = await User.findByIdAndUpdate(id, c, { new: true });
    return user;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

deleteUser = async id => {
  try {
    const user = await User.findByIdAndDelete(id);
    return user;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

function validateUser(user) {
  schema = {
    name: Joi.string()
      .min(3)
      .max(100)
      .required(),
    email: Joi.string()
      .email()
      .min(5)
      .max(255)
      .required(),
    password: Joi.string()
      .min(6)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}

module.exports = {
  validateUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  userSchema,
  User
};
