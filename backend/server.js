import http from "http";
import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";


// Acquisition des variables d'environnement depuis .env
dotenv.config();

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)  // Connexion à MongoDB
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => {
    console.error("Connexion à MongoDB échouée :", err);
    process.exit(1);
  });

// Fonction pour normaliser le port
const normalizePort = (val) => {
  const port = parseInt(val, 10); // Conversion de la valeur en entier
  if (isNaN(port)) return val; // Retourne la valeur originale si ce n'est pas un nombre
  if (port >= 0 && port <= 65535) return port; // Retourne le port s'il est valide
  return false; // Retourne false si le port n'est pas valide
};

// Définir le port
const port = normalizePort(process.env.PORT || "4000");  // PORT en variable d'environnement ou 4000 par défaut
app.set("port", port); // Attribution du port pour l'application

// Fonction de gestion des erreurs
const errorHandler = (err) => {
  // Vérifie si l'erreur concerne l'écoute du serveur
  if (err.syscall !== "listen") {
    throw err; // Lève une erreur si elle n'est pas liée à l'écoute du serveur
  }

  const address = server.address(); // Récupération de l'adresse du serveur
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port; // Détermination du type d'adresse

  // Gestion des différentes erreurs possibles
  switch (err.code) {
    case "EACCES": // Permission refusée
      console.error(`${bind} nécessite des privilèges élevés.`);
      process.exit(1);

    case "EADDRINUSE": // Port indisponible
      console.error(
        `Le port ${port} est déjà utilisé. Le serveur ne peut pas démarrer.`,
      );
      process.exit(1);

    default:
      console.error("Une erreur inattendue est survenue :", err);
      throw err;
  }
};

// Création et démarrage du serveur HTTP
const server = http.createServer(app);
server.on("error", errorHandler); // Gestion des événements d'erreur du serveur
server.on("listening", () => {
  const address = server.address(); // Récupération de l'adresse du serveur
  const bind = typeof address === "string" ? "pipe " + address : `port ${port}`; // Détermination du type d'adresse
  console.log(`Écoute sur ${bind}`);
});
server.listen(port); // Démarrage du serveur en écoutant sur le port spécifié
