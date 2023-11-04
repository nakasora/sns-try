const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();

const PORT = 5000;

const prisma = new PrismaClient();
app.use(express.json());

//新規ユーザ登録API
app.post("/api/auth/register", async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });
  return res.json({ user });
});
app.listen(PORT, () => console.log("server start"));
