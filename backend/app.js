import express from "express";
import mongoose from "mongoose";
import { API_ROUTES, MONGODB_CONNECTION_STRING } from "./constants.js";
import Book from "./models/book.js";

const app = express();

app.use(express.json()); // Pour traiter les requêtes avec des données au format JSON

mongoose
  .connect(MONGODB_CONNECTION_STRING) // Connexion à MongoDB
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.error("Connexion à MongoDB échouée :", err));



///////////////////// Middleware ////////////////////////////////////////////////////////

const getBooks = (req, res, next) => {
  Book.find() // Méthode Mongoose qui retourne tous les Books
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(400).json({ err }));
};

const getBookByID = (req, res, next) => {
  Book.findOne({ _id: req.params.id }) // Récupère un Book par son _id MongoDB en le comparant à celui en paramètre dans l'URL de la requête
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ err }));
};

const postBook = (req, res, next) => {
  delete req.body._id; // Retire un éventuel champs "_id" qui entrerait en conflit avec celui fournit par MongoDB
  const book = new Book({
    ...req.body, // L'opérateur spread permet ici de recréer la liste des champs du body
  });
  book
    .save() // Méthode Mongoose pour enregistrer le nouvel objet dans MongoDB
    .then(() => res.status(201).json({ message: "Nouveau livre enregistré !" }))
    .catch((err) => res.status(400).json({ err }));
};

const updateBook = (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body }) // Mise à jour du Book avec le nouveau req.body
      .then(() => res.status(200).json({ message: "Modification du livre bien enregistrée !" }))
      .catch((err) => res.status(400).json({ err }));
};

const deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id }) // Suppression du Book avec l'id en paramètre dans l'URL de la requête
    .then(() => res.status(200).json({ message: "Le livre a bien été supprimé !"}))
    .catch(err => res.status(400).json({ err}));
};

app.get(API_ROUTES.BOOKS, getBooks);
app.get(API_ROUTES.BOOK_BY_ID, getBookByID);
app.post(API_ROUTES.BOOKS, postBook);
app.put(API_ROUTES.BOOK_BY_ID, updateBook);
app.delete(API_ROUTES.BOOK_BY_ID, deleteBook);

export default app;
