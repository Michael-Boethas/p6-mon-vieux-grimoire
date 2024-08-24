import multer from "multer";
import httpStatus from "http-status";

// Stockage en local sur le serveur
const localStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/images"); // Adresse de stockage
  },
  filename: (req, file, callback) => {
    const book = JSON.parse(req.body.book); // Extraction des données du livre au format JSON
    const name = book.title.split(" ").join("_"); // Substitution des espaces par des underscores
    const timestamp = Date.now(); // Récupération du timestamp actuel
    callback(null, `${name}_${timestamp}`); // Nom du fichier sans extension avec un underscore comme séparateur
  },
});

const multerConfig = multer({ storage: localStorage }).single("image"); // Une seule image autorisée

const imageUpload = (req, res, next) => {
  multerConfig(req, res, (err) => {
    if (err) {
      console.error("Error during file upload:", err);
      return res.status(httpStatus.BAD_REQUEST).json({ err });
    }
    next();
  });
};

export default imageUpload;
