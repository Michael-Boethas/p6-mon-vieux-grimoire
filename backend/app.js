import express from "express";
import mongoose from "mongoose";
import { MONGODB_CONNECTION_STRING } from "./config/config.js";
import routes from "./routes/routes.js";

const app = express();

app.use(express.json()); // Pour traiter les requêtes avec des données au format JSON

mongoose
  .connect(MONGODB_CONNECTION_STRING) // Connexion à MongoDB
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.error("Connexion à MongoDB échouée :", err));

app.use(routes);

export default app;
