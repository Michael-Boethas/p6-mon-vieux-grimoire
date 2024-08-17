import express from "express";
import routes from "./routes/routes.js";

// Initialisation de l'application express
const app = express();

app.use(express.json()); // Middleware pour traiter les requêtes avec des données au format JSON

app.use((req, res, next) => {   // Middleware de mise en place des Headers 
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(routes);  // Mise en place des routes de l'API

export default app;
