import Book from "../models/book.js";


export const getBooks = (req, res, next) => {
  Book.find() // Méthode Mongoose qui retourne tous les Books
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(400).json({ err }));
};

export const getBookByID = (req, res, next) => {
  Book.findOne({ _id: req.params.id }) // Récupère un Book par son _id MongoDB en le comparant à celui en paramètre dans l'URL de la requête
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ err }));   // 404: Not found
};

export const getTop3 = (req, res, next) => {};

export const postBook = (req, res, next) => {
  delete req.body._id; // Retire un éventuel champs "_id" qui entrerait en conflit avec celui fournit par MongoDB
  const book = new Book({
    ...req.body, // L'opérateur spread permet ici de recréer la liste des champs du body
  });
  book
    .save() // Méthode Mongoose pour enregistrer le nouvel objet dans MongoDB
    .then(() => res.status(201).json({ message: "Nouveau livre enregistré !" }))
    .catch((err) => res.status(400).json({ err }));
};

export const rateBook = (req, res, next) => {};

export const updateBook = (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body }) // Mise à jour du Book avec le nouveau req.body
    .then(() =>
      res
        .status(200)
        .json({ message: "Modification du livre bien enregistrée !" })
    )
    .catch((err) => res.status(400).json({ err }));
};

export const deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id }) // Suppression du Book avec l'id en paramètre dans l'URL de la requête
    .then(() =>
      res.status(200).json({ message: "Le livre a bien été supprimé !" })
    )
    .catch((err) => res.status(400).json({ err }));
};
