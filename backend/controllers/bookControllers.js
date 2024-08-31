// import fs from 'fs'
// import { promisify } from 'util'
import httpStatus from 'http-status'
import Book from '../models/book.js'
import log from '../utils/logger.js'
import { deleteImage } from '../utils/utils.js'

// const deleteImage = promisify(fs.unlink) // Promessification de fs.unlink

/////////// Renvoie un tableau de tous les livres /////////////////
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find() // Mongoose, renvoie un tableau contenant tous les livres de la collection
    return res.status(httpStatus.OK).json(books)
  } catch (err) {
    log.error(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err }) // Envoi de l'erreur au client
  }
}

////////// Renvoie le livre avec l'identifiant précisé //////////////
export const getBookByID = async (req, res) => {
  // Vérification de l'id en paramètre URL
  const bookId = req.params.id
  if (!bookId) {
    log.error(new Error('ID parameter missing or undefined'))
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: 'ID parameter missing or undefined' })
  }

  try {
    const book = await Book.findOne({ _id: bookId }) // Récupère un Book par son _id MongoDB en le comparant au paramètre URL
    if (!book) {
      log.error(new Error(`Book not found (${bookId})`))
      return res.status(httpStatus.NOT_FOUND).json({ error: 'Book not found' })
    }
    return res.status(httpStatus.OK).json(book)
  } catch (err) {
    log.error(new Error(`Error retrieving book (${bookId}):`))
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err })
  }
}

///////// Renvoie un tableau des livres les mieux notés ///////////////////
export const getTopRated = async (req, res) => {
  try {
    const topRatedBooks = await Book.find() // Mongoose
      .sort({ averageRating: -1 }) // Tri par ordre décroissant
      .limit(3) //  Uniquement les trois premiers
    return res.status(httpStatus.OK).json(topRatedBooks)
  } catch (err) {
    log.error(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err })
  }
}

//////// Ajoute un livre sur la base de donnée ///////////////////////////
export const postBook = async (req, res) => {
  log.info('Adding new book to the database')

  try {
    // Extraction des données du livre envoyé
    const newBookData = JSON.parse(req.body.book)

    // Suppression d'un éventuel champs conflictuels
    delete newBookData._id
    delete newBookData.userId

    // Instantiation d'un nouveau livre
    const book = new Book({
      ratings: [], // Initialisation d'un tableau vide (remplacé par le rating utilisateur si renseigné)
      ...newBookData, // Création des champs du modèle Book à partir des données extraites
      userId: req.auth.userId, // Ajout de l'identifiant utilisateur extrait du token
      averageRating: 0, // Initialisation de la note moyenne à zéro
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Ajout de l'URL de l'image sur le serveur
    })
    // Enregistrement sur la base de donnée
    await book.save()
    return res
      .status(httpStatus.CREATED)
      .json({ message: 'New book uploaded successfully' })
  } catch (err) {
    log.error(err)
    // Suppression de l'image du serveur en cas d'échec
    try {
      await deleteImage(`public/images/${req.file.filename}`)
    } catch (err) {
      log.error(err)
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err })
  }
}

//////// Mise à jour d'un livre sur la base de donnée /////////////////////////
export const updateBook = async (req, res) => {
  // Vérification de l'id en paramètre URL
  const bookId = req.params.id
  if (!bookId) {
    log.error(new Error('ID parameter missing or undefined'))
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: 'ID parameter missing or undefined' })
  }

  try {
    // Acquisition de la version actuelle du livre
    const book = await Book.findOne({ _id: bookId })
    // Reconstruction du chemin local de l'image sur le serveur
    const fileName = book.imageUrl.split('/images/')[1]
    const filePath = `public/images/${fileName}`

    log.info(`Updating book: ${bookId}`)

    // Vérification de l'utilisateur
    if (book.userId !== req.auth.userId) {
      log.error(new Error('Operation denied: user unauthorized'))
      return res
        .status(httpStatus.FORBIDDEN)
        .json({ error: 'Operation denied: user unauthorized' })
    }

    // Gestion des cas avec et sans modification de l'image
    const imageIsModified = req.file ? true : false
    let newBookData

    if (imageIsModified) {
      // Suppression préalable de l'ancienne image (avant d'effacer l'objet contenant imageUrl)
      await deleteImage(filePath)

      // Inclusion, le cas échéant, de la nouvelle imageUrl
      newBookData = {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
    } else {
      newBookData = { ...req.body }
    }

    delete newBookData.userId // Évite d'accidentellement modifier l'utilisateur qui a posté le livre

    // Mise à jour avec les nouvelles informations
    await Book.updateOne(
      { _id: req.params.id },
      { ...newBookData, _id: req.params.id }
    )
    return res
      .status(httpStatus.OK)
      .json({ message: 'Book updated successfully' })
  } catch (err) {
    log.error(err)
    // Suppression de l'image du serveur en cas d'échec
    try {
      await deleteImage(`public/images/${req.file.filename}`)
    } catch (err) {
      log.error(err)
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err })
  }
}

//////// Suppression d'un livre de la base de donnée /////////////////////////
export const deleteBook = async (req, res) => {
  const bookId = req.params.id
  if (!bookId) {
    log.error(new Error('ID parameter missing or undefined'))
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: 'ID parameter missing or undefined' })
  }

  log.info(`Deleting book ${req.params.id}`)

  try {
    // Acquisition du livre à traiter
    const book = await Book.findOne({ _id: bookId })
    const fileName = book.imageUrl.split('/images/')[1]
    const filePath = `public/images/${fileName}` // Reconstruction de l'URL de l'image

    // Vérification de l'utilisateur
    if (book.userId !== req.auth.userId) {
      log.error(new Error('Operation denied: user unauthorized'))
      return res
        .status(httpStatus.FORBIDDEN)
        .json({ error: 'Operation denied' })
    }

    // Vérification de l'existence du fichier
    if (!filePath) {
      log.error(new Error(`File not found at: ${filePath}`))
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Image file not found' })
    }

    // Suppression préalable de l'image (avant d'effacer l'objet contenant imageUrl)
    try {
      await deleteImage(filePath)
    } catch (err) {
      log.error(err)
    }

    // Suppression du livre
    await Book.deleteOne({ _id: bookId })
    return res
      .status(httpStatus.OK)
      .json({ message: 'Book deleted successfully' })
  } catch (err) {
    log.error(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err })
  }
}

//////// Ajout d'un avis sur un livre en particulier /////////////////////////
export const rateBook = async (req, res) => {
  // Vérification de l'id en paramètre URL

  const bookId = req.params.id
  if (!bookId || bookId === 'undefined') {
    // Contourne un problème du frontend
    log.error(new Error('ID parameter missing or undefined'))
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: 'ID parameter missing or undefined' })
  }

  log.info(`Rating book: ${bookId}`)

  try {
    // Vérification de l'existence du livre
    const book = await Book.findOne({ _id: bookId })
    if (!book) {
      log.error(new Error('Book not found'))
      return res.status(httpStatus.NOT_FOUND).json({ error: 'Book not found' })
    }

    const newRating = req.body.rating
    // Vérification de la validité de la note de l'utilisateur
    if (newRating < 0 || newRating > 5) {
      log.error(new Error('User rating is out of range'))
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Rating should be between 0 and 5' })
    }

    // Prévention des doublons de ratings
    const userHasRated = book.ratings.find(
      (rating) => rating.userId === req.auth.userId
    )
    if (userHasRated) {
      log.error(new Error('User rating already exists for this book'))
      return res
        .status(httpStatus.CONFLICT)
        .json({ error: 'User already has rated this book' })
    } else {
      // Ajout de la note de l'utilisateur
      book.ratings.push({
        userId: req.auth.userId,
        grade: newRating
      })
    }

    // Calcul de la note moyenne arrondie au centième
    if (book.ratings.length > 0) {
      let sumRatings = 0
      book.ratings.forEach((rating) => {
        sumRatings += rating.grade
      })
      book.averageRating =
        Math.ceil((sumRatings / book.ratings.length) * 100) / 100
    }

    // Enregistrement dans MongoDB
    await book.save()
    return res.status(httpStatus.CREATED).json({ book })
  } catch (err) {
    log.error(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err })
  }
}
