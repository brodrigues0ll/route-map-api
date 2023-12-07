const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3002;

// Palavra-chave para autenticação
const AUTH_KEYWORD = process.env.AUTH_KEYWORD;

// Middleware para verificar a palavra-chave na requisição
const checkAuthentication = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.includes(AUTH_KEYWORD)) {
    return res.status(403).json({ error: "Forbidden: Palavra-chave inválida" });
  }

  next();
};

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  return res.json({ message: "Hello World!" });
});

// Adiciona o middleware de verificação na rota específica
app.get("/api/directions", checkAuthentication, async (req, res) => {
  const { origin, destination } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
