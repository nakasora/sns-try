const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
require("dotenv").config();
const authRoute = require("express").Router();

const prisma = new PrismaClient();
//新規ユーザ登録API
authRoute.post("/register", async (req, res) => {
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

//ユーザログインAPI
authRoute.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "そのユーザは存在しません。" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "そのPWは間違っています" });
  }

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return res.json({ token });
});

module.exports = authRoute;
