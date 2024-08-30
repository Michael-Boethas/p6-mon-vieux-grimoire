import multer from 'multer'
import fs from 'fs'
import httpStatus from 'http-status'

const imagesDir = process.env.IMAGES_DIR || 'public/images'

// Stockage en local sur le serveur
const localStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, imagesDir) // Adresse de stockage
  },
  filename: (req, file, callback) => {
    const book = JSON.parse(req.body.book) // Extraction des données du livre au format JSON
    const name = book.title.split(' ').join('_') // Substitution des espaces par des underscores
    const timestamp = Date.now() // Récupération du timestamp actuel
    callback(null, `${name}_${timestamp}`) // Nom du fichier sans extension avec un underscore comme séparateur
  }
})

// Exclusion des types de fichiers non autorisés
const acceptedFiles = (req, file, callback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'] // JPG et PNG autorisés
  if (!allowedMimeTypes.includes(file.mimetype)) {
    console.error(' <!> Unsupported MIME type input \n')
    return callback(new Error('Unsupported file type'), false)
  }

  callback(null, true)
}

const multerConfig = multer({
  storage: localStorage,
  fileFilter: acceptedFiles,
  limits: { files: 1, fileSize: 5 * 1024 ** 2 } // Restriction à 1 fichier de 5MB maximum
}).single('image') // Fichier unique du champs "image" de la requête


const imageUpload = (req, res, next) => {
  console.log('### Uploading image to server')

  // Création du dossier s'il n'existe pas
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true })
  }
  // Enregistrement de l'image
  multerConfig(req, res, (err) => {
    if (err) {
      console.error(' <!> Error during file upload: \n')
      console.error('= = = = = = = = = = = = = = = = = = = = = = = = \n')
      console.error(err, '\n')
      console.error('= = = = = = = = = = = = = = = = = = = = = = = = \n')
      return res.status(httpStatus.BAD_REQUEST).json({ err })
    }
    console.log('  -> Image uploaded')
    next()
  })
}

export default imageUpload
