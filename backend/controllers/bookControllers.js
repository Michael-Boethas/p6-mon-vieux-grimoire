import Book from "../models/book.js";


export const getBooks = (req, res, next) => {
  Book.find() // Méthode Mongoose qui retourne tous les Books
    .then((books) => res.status(200).json(books))   // 200: OK
    .catch((err) => res.status(400).json({ err }));   // 400: Bad Request
};

export const getBookByID = (req, res, next) => {
  Book.findOne({ _id: req.params.id }) // Récupère un Book par son _id MongoDB en le comparant à celui en paramètre dans l'URL de la requête
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ err }));   // 404: Not found
};

export const getTop3 = (req, res, next) => {};

export const postBook = (req, res, next) => {
  const bookData = JSON.parse(req.body.book);  // Extraction des données du livre envoyé 
  delete bookData._id;         // Suppression d'un éventuel champs _id qui entrerait en conflit avec celui fournit par MongoDB
  delete bookData._userId;    // Suppression d'un éventuel champs _userId erroné
  const book = new Book({
      ...bookData,             // Création des champs du modèle Book à partir des données extraites 
      userId: req.auth.userId,  // Ajout de l'identifiant utilisateur extrait du token
      averageRating: 0,        // Initialisation de la note moyenne à zéro
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`  // Ajout de l'URL de l'image téléchargée
  });

  book.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})   // 201: Created
  .catch(err => { res.status(400).json( { err})})
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
