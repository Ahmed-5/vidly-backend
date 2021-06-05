const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

const {
  validateCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer
} = require("../modules/customer");

router.get("/", async (req, res) => {
  const customers = await getCustomers();
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await getCustomer(req.params.id);
  customer ? res.send(customer) : res.status(404).send("Not found");
});

router.post("/", auth, async (req, res) => {
  const { error } = validateCustomer(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const customer = await createCustomer(req.body);
  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  let customer = { ...req.body };

  const { error } = validateCustomer(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  customer = await updateCustomer(req.params.id, customer, { new: true });
  customer ? res.send(customer) : res.status(404).send("Not found");
});

router.delete("/:id", auth, async (req, res) => {
  const customer = await deleteCustomer(req.params.id);
  customer ? res.send(customer) : res.status(404).send("Not found");
});

module.exports = router;
