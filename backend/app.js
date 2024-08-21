import express from "express";
import setHeaders from "./middleware/setHeaders.js";
import routes from "./routes/routes.js";

// Initialisation de l'application express
const app = express();

app.use(express.json()); // Middleware pour le traitement des requêtes avec des données au format JSON

app.use(setHeaders);  // Mise en place des headers

app.use(express.static("public"));  // Accès aux fichiers statiques

app.use(routes);  // Mise en place des routes de l'API

export default app;
