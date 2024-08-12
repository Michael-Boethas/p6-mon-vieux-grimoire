import express from "express";
import mongoose from "mongoose";
import { API_ROUTES, MONGODB_CONNECTION_STRING } from "./constants.js";
import Book from "./models/book.js";

const app = express();

app.use(express.json()); // Pour traiter les requêtes avec des données au format JSON

mongoose
  .connect(MONGODB_CONNECTION_STRING)   // Connection à MongoDB
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.error("Connexion à MongoDB échouée :", err));


///////////////////// Spécifications de l'API ////////////////////////////////////////////////////////

const getBooks = (req, res, next) => {
  Book.find() // Méthode Mongoose qui retourne tous les Books
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

const getBookByID = (req, res, next) => {
  Book.findOne({ _id: req.params.id }) // Récupère un objet par son _id MongoDB
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

const postBook = (req, res, next) => {
  delete req.body._id; // Retire un éventuel champs "_id" qui entrerait en conflit avec celui fournit par MongoDB
  const book = new Book({
    ...req.body, // L'opérateur spread permet ici de recréer la liste des champs du body puis d'en ajouter
  });
  book
    .save() // Méthode Mongoose pour enregistrer le nouvel objet dans MongoDB
    .then(() => res.status(201).json({ message: "Nouveau livre enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

app.get(API_ROUTES.BOOKS, getBooks);
app.get(API_ROUTES.BOOK_BY_ID, getBookByID);
app.post(API_ROUTES.BOOKS, postBook);

export default app;
