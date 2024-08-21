import httpStatus from "http-status";
import Book from "../models/book.js";

/////////// Renvoie un tableau de tous les livres de la DB //////////////////
export const getBooks = (req, res, next) => {
  console.log("#### Fetching Books ####");
  Book.find() // Méthode Mongoose qui retourne tous les Books
    .then((books) => res.status(200).json(books)) // 200: OK
    .catch((err) => res.status(400).json({ err })); // 400: Bad Request
};

///////// Renvoie du livre avec l'identifiant précisé /////////////////
export const getBookByID = (req, res, next) => {
  console.log(`#### Retrieving book: ${req.params.id} ####`);
  Book.findOne({ _id: req.params.id }) // Récupère un Book par son _id MongoDB en le comparant à celui en paramètre dans l'URL de la requête
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((err) => res.status(404).json({ err })); // 404: Not found
};

///////// Renvoie un tableau des livres les mieux notés ///////////////////
export const getBestRated = (req, res, next) => {
  console.log("#### Fetching top rated books ####");
  Book.find()
    .sort({ averageRating: -1 }) // Tri par ordre décroissant
    .limit(3) //  Uniquement les trois premiers
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(400).json(err));
};

export const postBook = (req, res, next) => {
  console.log("#### Adding new book to the database ####");
  const bookData = JSON.parse(req.body.book); // Extraction des données du livre envoyé
  delete bookData._id; // Suppression d'un éventuel champs _id qui entrerait en conflit avec celui fournit par MongoDB
  delete bookData._userId; // Suppression d'un éventuel champs _userId erroné
  const book = new Book({
    ...bookData, // Création des champs du modèle Book à partir des données extraites
    userId: req.auth.userId, // Ajout de l'identifiant utilisateur extrait du token
    averageRating: 0, // Initialisation de la note moyenne à zéro
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}` // Ajout de l'URL de l'image téléchargée
  });
  
  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Votre livre a bien été enregistré !" });
    }) // 201: Created
    .catch((err) => {
      console.log(err);
      res.status(400).json({ err });
    });
};

export const rateBook = (req, res, next) => {

  ///////////// JSON.parse() ?????????????

  console.log(`#### Rating book: ${req.params.id} ####`);
  console.log(`@@@@ Rating book: ${JSON.stringify(req.params)} @@@@`);

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ err });
      }

      const { rating } = req.body;
      console.log(">?>?>?>?> " + JSON.stringify(req, null, 2));
      console.log("^@^@^@^@ " + rating);
      const existingRating = book.ratings.find(
        (rating) => rating.userId === req.auth.userId
      );

      if (existingRating) {
        return res.status(409).json({ err }); // 409: Conflict
      } else {
        book.ratings.push({
          userId: req.auth.userId,
          grade: rating,
        });
      }

      // Calcul de la note moyenne
      const sumRatings = book.ratings.reduce(
        (sum, rating) => sum + rating.grade,
        0
      );
      if (book.ratings.length > 0) {
        book.averageRating = sumRatings / book.ratings.length;
      }

      // Enregistrement dans MongoDB
      book
        .save()
        .then(() =>
          res
            .status(201)
            .json({ book, message: "Votre avis a bien été pris en compte" })
        )
        .catch((err) => res.status(400).json({ err }));
    })
    .catch((err) => res.status(400).json({ err }));
};

export const updateBook = (req, res, next) => {
  console.log(`#### Updating book: ${req.params.id} ####`);
  Book.updateOne({ _id: req.params.id }, { ...req.body }) // Mise à jour du Book avec le nouveau req.body
    .then(() => {
      if (req.body.userId !== req.auth.userId) {
        return res.status(403).json({ err });  // 403: Forbidden
      }
      res
        .status(200)
        .json({ message: "Modification du livre bien enregistrée !" });
    })
    .catch((err) => res.status(400).json({ err }));
};

export const deleteBook = (req, res, next) => {
  console.log(`#### Deleting book ${req.params.id} ####`);
  Book.deleteOne({ _id: req.params.id }) // Suppression du Book avec l'id en paramètre dans l'URL de la requête
    .then(() =>
      res.status(200).json({ message: "Le livre a bien été supprimé !" })
    )
    .catch((err) => res.status(400).json({ err }));
};
