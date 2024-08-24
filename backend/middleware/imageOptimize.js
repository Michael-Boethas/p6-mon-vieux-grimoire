import sharp from "sharp";
import fs from "fs";
import { promisify } from "util";
import httpStatus from "http-status";

const deleteImage = promisify(fs.unlink);

const imageOptimize = async (req, res, next) => {
  console.log("#### Optimizing image ####");
  if (!req.file) {
    console.log("No image to process, skipping image optimization");
    return next();
  }

  try {
    const filePath = req.file.path;
    await sharp(filePath)
      .webp({ quality: 80 }) // Conversion en webp et compression
      .toFile(filePath + ".webp"); // Path créé par Multer + extension
    req.file.filename += ".webp"; // Ajout de l'extension webp au filename Multer

    // Suppression du fichier original
    try {
      await deleteImage(filePath);
      console.log("Image deleted");
    } catch (err) {
      console.error(`Failed to delete file: ${req.file.filename}`, err);
    }
    return next();
  } catch (err) {
    console.error("Error during image optimization: ", err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err });
  }
};

export default imageOptimize;
