import sharp from 'sharp'
import fs from 'fs'
import { promisify } from 'util'
import httpStatus from 'http-status'

const deleteImage = promisify(fs.unlink)

const imageOptimize = async (req, res, next) => {
  if (!req.file) {
    console.log('  -> No image to process, skipping image optimization')
    return next()
  }

  console.log('### Optimizing image')
  try {
    const filePath = req.file.path
    await sharp(filePath)
      .webp({ quality: 90 }) // Conversion en webp et compression
      .toFile(filePath + '.webp') // Path créé par Multer + extension
    req.file.filename += '.webp' // Ajout de l'extension webp au filename Multer
    console.log('  -> Image optimized')

    // Suppression du fichier original
    try {
      await deleteImage(filePath)
      console.log('  -> Original image deleted')
    } catch (err) {
      console.error(` <!> Failed to delete file: ${req.file.filename} \n`)
      console.error('= = = = = = = = = = = = = = = = = = = = = = = = \n')
      console.error(err, '\n')
      console.error('= = = = = = = = = = = = = = = = = = = = = = = = \n')
    }
    next()
  } catch (err) {
    console.error(' <!> Error during image optimization: \n')
    console.error('= = = = = = = = = = = = = = = = = = = = = = = = \n')
    console.error(err, '\n')
    console.error('= = = = = = = = = = = = = = = = = = = = = = = = \n')
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err })
  }
}

export default imageOptimize
