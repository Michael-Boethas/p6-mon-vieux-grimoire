import multer from "multer";

    // Stockage en local sur le serveur
const localStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "public/images");   // Adresse de stockage
    },
    filename: (req, file, callback) => {
        const book = JSON.parse(req.body.book);
        const name = book.title.split(" ").join("_");  // Substitution des espaces par des underscores
        const timestamp = Date.now();                  // Récupération du timestamp actuel
        callback(null, `${name}_${timestamp}`); // Nom du fichier avec un underscore comme séparateur
    }
});

const imageUpload = multer({ storage: localStorage }).single("image");  // Une seule image autorisée

export default imageUpload;

