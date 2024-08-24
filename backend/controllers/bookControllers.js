import fs from "fs";
import { promisify } from "util";
import httpStatus from "http-status";
import Book from "../models/book.js";


const deleteImage = promisify(fs.unlink); // Promessification de fs.unlink

/////////// Renvoie un tableau de tous les livres /////////////////
export const getBooks = async (req, res, next) => {
  console.log("### Fetching Books ###");
  try {
    const books = await Book.find(); // Mongoose, renvoie un tableau contenant tous les livres de la collection
    return res.status(httpStatus.OK).json(books);
  } catch (err) {
    console.error("Error fetching books: ", err); // Affichage de l'erreur côté serveur
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err }); // Envoi de l'erreur au client
  }
};

///////// Renvoie le livre avec l'identifiant précisé //////////////
export const getBookByID = async (req, res, next) => {
  // Vérification de l'id en paramètre URL
  const bookId = req.params.id;
  if (!bookId) {
    console.error("ID parameter missing or undefined");
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: "ID parameter missing or undefined" });
  }
  console.log(`### Retrieving book: ${bookId} ###`);

  try {
    const book = await Book.findOne({ _id: bookId }); // Récupère un Book par son _id MongoDB en le comparant au paramètre URL
    if (!book) {
      console.error("Book not found: ", err);
      return res.status(httpStatus.NOT_FOUND).json({ error: "Book not found" });
    }
    return res.status(httpStatus.OK).json(book);
  } catch (err) {
    console.error(`Error retrieving book (${bookId}):`, err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err });
  }
};

///////// Renvoie un tableau des livres les mieux notés ///////////////////
export const getTopRated = async (req, res, next) => {
  console.log("### Fetching top rated books ###");
  try {
    const topRatedBooks = await Book.find() // Mongoose
      .sort({ averageRating: -1 }) // Tri par ordre décroissant
      .limit(3); //  Uniquement les trois premiers
    return res.status(httpStatus.OK).json(topRatedBooks);
  } catch (err) {
    console.error("Error fetching top rated books: ", err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err });
  }
};

//////// Ajoute un livre sur la base de donnée ///////////////////////////
export const postBook = (req, res, next) => {
  console.log("### Adding new book to the database ###");
  const newBookData = JSON.parse(req.body.book); // Extraction des données du livre envoyé
  if (newBookData.userId !== req.auth.userId) {
    return res.status(403).json({ err: "" }); // 403: Forbidden
  }
  delete newBookData._id; // Suppression d'un éventuel champs _id qui entrerait en conflit avec celui fournit par MongoDB
  delete newBookData.userId; // Suppression d'un éventuel champs _id qui entrerait en conflit avec celui fournit par MongoDB
  const book = new Book({
    ...newBookData, // Création des champs du modèle Book à partir des données extraites
    userId: req.auth.userId, // Ajout de l'identifiant utilisateur extrait du token
    averageRating: 0, // Initialisation de la note moyenne à zéro
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`, // Ajout de l'URL de l'image sur le serveur
  });

  book
    .save()
    .then(() => {
      return res
        .status(201)
        .json({ message: "Votre livre a bien été enregistré !" });
    }) // 201: Created
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ err });
    });
};

// //////// Mise à jour d'un livre sur la base de donnée /////////////////////////
// export const updateBook = (req, res, next) => {
//   console.log(`### Updating book: ${req.params.id} ###`);

//   const bookData = req.file
//     ? {
//         ...JSON.parse(req.body.book),
//         imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
//       }
//     : { ...req.body };

//   if (bookData.userId !== req.auth.userId) {
//     return res.status(403).json({ err }); // 403: Forbidden
//   }
//   delete bookData.userId; // Évite les conflits avec MongoDB
//   Book.updateOne({ _id: req.params.id }, { ...bookData, _id: req.params.id })
//     .then(() =>
//       res.status(200).json({ message: "Le livre a bien été modifié!" })
//     )
//     .catch((err) => res.status(401).json({ err }));
// };

//////// Mise à jour d'un livre sur la base de donnée /////////////////////////
export const updateBook = async (req, res, next) => {
  // Vérification de l'id en paramètre URL
  const bookId = req.params.id;
  if (!bookId) {
    console.error("ID parameter missing or undefined");
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: "ID parameter missing or undefined" });
  }

  try {
    const book = await Book.findOne({ _id: bookId });  // Acquisition de la version actuelle du livre
    const imageIsModified = req.file ? true : false;
    let newBookData;
    const fileName = book.imageUrl.split("/images/")[1]; // Extraction du nom de fichier
    const filePath = `public/images/${fileName}`;   // Reconstruction du chemin local de l'image sur le serveur

    if (book.userId !== req.auth.userId) {
      console.error("Operation denied: user unauthorized");
      return res.status(httpStatus.FORBIDDEN).json({ err });
    }

    console.log(`### Updating book: ${bookId} ###`);
    if (imageIsModified) {
      await deleteImage(filePath);  // Suppression préalable de l'ancienne image (avant d'effacer l'objet contenant imageUrl)
      newBookData = {   // Inclusion de la nouvelle imageUrl le cas échéant
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    } else {
      newBookData = { ...req.body };
    }
    delete newBookData.userId; // Évite d'accidentellement modifier l'utilisateur qui a posté le livre
    await Book.updateOne({ _id: req.params.id }, { ...newBookData, _id: req.params.id }) // Mise à jour des informations du livre
    return res.status(httpStatus.OK).json({ message: "Le livre a bien été modifié!" })
  } catch (err) {
    console.error("Failed to update image", err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err });
  }
};


//////// Suppression d'un livre de la base de donnée /////////////////////////
export const deleteBook = async (req, res, next) => {
  const bookId = req.params.id;
  if (!bookId) {
    console.error("ID parameter missing or undefined");
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: "ID parameter missing or undefined" });
  }
  console.log(`### Deleting book ${req.params.id} ###`);

  try {
    const book = await Book.findOne({ _id: bookId });
    const fileName = book.imageUrl.split("/images/")[1];
    const filePath = `public/images/${fileName}`;       // Reconstruction de l'URL de l'image

    if (book.userId !== req.auth.userId) {
      console.error("Operation denied: user unauthorized");
      return res.status(httpStatus.FORBIDDEN).json({ error: "Operation denied" });
    }
    if (!filePath) {
      console.error(`File not found at: ${filePath}`);
      return res.status(httpStatus.NOT_FOUND).json({ error: "Image file not found" });
    }

    // Suppression préalable de l'image (avant d'effacer l'objet contenant imageUrl)
    try {
      await deleteImage(filePath);
      console.log("Image deleted");
    } catch (err) {
      console.error(`Failed to delete : ${filePath}`, err);
    }

    await Book.deleteOne({ _id: bookId }); // Suppression du Book avec l'id en paramètre dans l'URL de la requête
    console.log("Book deleted");
    return res.status(httpStatus.OK).json({ message: "Le livre a bien été supprimé !" });
  } catch (err) {
    console.error("An error occured during the deletion", err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err });
  }
};

//////// Ajout d'un avis sur un livre en particulier /////////////////////////
export const rateBook = (req, res, next) => {
  ///////////// JSON.parse() ?????????????

  console.log(`### Rating book: ${req.params.id} ###`);
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
