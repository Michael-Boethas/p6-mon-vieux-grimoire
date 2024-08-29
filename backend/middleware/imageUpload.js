import multer from 'multer'
import fs from 'fs'
import httpStatus from 'http-status'

const imagesDir = 'public/images/'

// Stockage en local sur le serveur
const localStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/images') // Adresse de stockage
  },
  filename: (req, file, callback) => {
    const book = JSON.parse(req.body.book) // Extraction des données du livre au format JSON
    const name = book.title.split(' ').join('_') // Substitution des espaces par des underscores
    const timestamp = Date.now() // Récupération du timestamp actuel
    callback(null, `${name}_${timestamp}`) // Nom du fichier sans extension avec un underscore comme séparateur
  }
})

const multerConfig = multer({ storage: localStorage }).single('image') // Une seule image autorisée

const imageUpload = (req, res, next) => {
  console.log('### Uploading image to server')

  // Restriction du type de fichier
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedMimeTypes.includes(req.get('Content-Type'))) {
    console.error(' <!> Unsupported MIME type input \n');
    return res.status(httpStatus.BAD_REQUEST).json({ error: 'Unsupported file type' });
  }

  // Création du dossier s'il n'existe pas
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true })
  }
  // Enregistrement de l'image
  multerConfig(req, res, (err) => {
    if (err) {
      console.error(' <!> Error during file upload: \n')
      console.error('= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = \n')
    console.error(err, '\n')
    console.error('= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = ')
    return res.status(httpStatus.BAD_REQUEST).json({ err })
    }
    console.log('  -> Image uploaded')
    next()
  })
}

export default imageUpload
