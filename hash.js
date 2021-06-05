const bcrypt = require("bcrypt");

run = async () => {
  const salt = await bcrypt.genSalt(10);
  const pw = await bcrypt.hash("1234", salt);
  console.log(pw);
};

run();
