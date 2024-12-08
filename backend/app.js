import express from 'express'
import cookieParser from 'cookie-parser';
import setRequestLimit from './middleware/setRequestLimit.js'
import setHeaders from './middleware/setHeaders.js'
import routes from './routes/routes.js'

// Initialisation de l'application express
const app = express()

app.set('trust proxy', 1); // Autorisation à 1 proxy (nécéssaire pour le reverse proxy de certains services d'hébergement)

app.use(setRequestLimit) // Gestion du flux de requêtes entrantes

app.use(express.json()) // Traitement des requêtes avec des données au format JSON

app.use(cookieParser()); // Traitement des requêtes avec cookies

app.use(express.static('public')) // Accès aux fichiers statiques (avant les restrictions des headers )

app.use(setHeaders) // Mise en place des headers

app.use(routes) // Mise en place des routes de l'API

export default app
