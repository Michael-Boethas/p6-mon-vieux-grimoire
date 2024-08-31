import sharp from 'sharp'
// import fs from 'fs'
// import { promisify } from 'util'
import httpStatus from 'http-status'
import log from '../utils/logger.js'
import { deleteImage } from '../utils/utils.js'

// const deleteImage = promisify(fs.unlink)

const imageOptimize = async (req, res, next) => {
  if (!req.file) {
    log.info('No image to process, skipping image optimization')
    return next()
  }

  log.info('Optimizing image')
  try {
    const filePath = req.file.path
    await sharp(filePath)
      .webp({ quality: 90 }) // Conversion en webp et compression
      .toFile(filePath + '.webp') // Path créé par Multer + extension
    req.file.filename += '.webp' // Ajout de l'extension webp au filename Multer

    // Suppression du fichier original
    try {
      await deleteImage(filePath)
    } catch (err) {
      log.error(err)
    }
    next()
  } catch (err) {
    log.error(err)
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err })
  }
}

export default imageOptimize
