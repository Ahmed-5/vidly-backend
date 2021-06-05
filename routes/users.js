const auth = require("../middleware/auth");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const {
  validateUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  User
} = require("../modules/user");

// router.get("/", async (req, res) => {
//   const users = await getUsers();
//   res.send(users);
// });

router.get("/me", auth, async (req, res) => {
  const user = await getUser(req.user._id);
  user ? res.send(user) : res.status(404).send("Not found");
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.put("/:id", async (req, res) => {
  let user = { ...req.body };

  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  user = await updateUser(req.params.id, user, { new: true });
  user ? res.send(user) : res.status(404).send("Not found");
});

router.delete("/:id", async (req, res) => {
  const user = await deleteUser(req.params.id);
  user ? res.send(user) : res.status(404).send("Not found");
});

module.exports = router;
