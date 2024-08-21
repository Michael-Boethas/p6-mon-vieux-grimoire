import multer from "multer";

// Types de fichiers autorisés
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png"
};

const localStorage = multer.diskStorage({   // Stockage en local sur le serveur
    destination: (req, file, callback) => {
        callback(null, "public/images");   // Destination du fichier téléchargé
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");  // Substitution des espaces pour des underscores
        const extension = MIME_TYPES[file.mimetype];       // Acquisition de l'extension depuis le dictionnaire MIME_TYPES
        callback(null, name + Date.now() + "." + extension);  // Nom + date + extension du fichier téléchargé
    }
});

const imageUpload = multer({ storage: localStorage }).single("image");  // Une seule image autorisée

export default imageUpload;