const _ = require("lodash");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const {
  //   getUsers,
  //   getUser,
  //   updateUser,
  //   deleteUser,
  User
} = require("../modules/user");

// router.get("/", async (req, res) => {
//   const users = await getUsers();
//   res.send(users);
// });

// router.get("/:id", async (req, res) => {
//   const user = await getUser(req.params.id);
//   user ? res.send(user) : res.status(404).send("Not found");
// });

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.send(token);
});

// router.put("/:id", async (req, res) => {
//   let user = { ...req.body };

//   const { error } = validate(req.body);
//   if (error) {
//     res.status(400).send(error.details[0].message);
//     return;
//   }

//   user = await updateUser(req.params.id, user, { new: true });
//   user ? res.send(user) : res.status(404).send("Not found");
// });

// router.delete("/:id", async (req, res) => {
//   const user = await deleteUser(req.params.id);
//   user ? res.send(user) : res.status(404).send("Not found");
// });

function validate(req) {
  schema = {
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
  return Joi.validate(req, schema);
}

module.exports = router;
