import sharp from "sharp";
import fs from "fs";

const imageOptimize = async (req, res, next) => {
  console.log("#### Optimizing image ####");
  if (!req.file) {
    return next();
  }
  sharp(req.file.path)
    .webp({ quality: 80 }) // Compression en webp
    .toFile(req.file.path + ".webp") // Path créé par Multer + extension
    .then(() => {
      req.file.filename += ".webp"; // Filename Multer + extension

      // Suppression du fichier original de la base de données
      fs.unlink(req.file.path, (err) => {
        if (err) {
          res.status(500).json({ err });
        }
      });
      next();
    });
};

export default imageOptimize;
