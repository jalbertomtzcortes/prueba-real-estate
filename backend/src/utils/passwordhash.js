const bcrypt = require("bcryptjs");

(async () => {
  const hashedPassword = await bcrypt.hash("12345", 10);
  console.log(hashedPassword);
})();
