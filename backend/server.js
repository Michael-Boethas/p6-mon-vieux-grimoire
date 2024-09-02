import dotenv from 'dotenv'
import http from 'http'
import mongoose from 'mongoose'
import app from './app.js'
import log from './utils/logger.js'
import { normalizePort, handleServerError } from './utils/utils.js'

// Acquisition des variables d'environnement depuis .env
dotenv.config()

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log('  * Connected to MongoDB'))
  .catch((err) => {
    log.error(err)
    process.exit(1)
  })

// Attribution du port
const port = normalizePort(process.env.PORT || '4000') // PORT en variable d'environnement ou 4000 par défaut
app.set('port', port) // Ajout de la propriété "port" à l'app pour éventuelle future référence

// Création et démarrage du serveur HTTP
const server = http.createServer(app)
server.on('error', (err) => handleServerError(server, port, err)) // Gestion des événements d'erreur du serveur
server.on('listening', () => {
  const address = server.address() // Récupération de l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : `port ${port}` // Détermination du type d'adresse
  console.log(`  * Listening on ${bind}`)
})
server.listen(port) // Démarrage du serveur en écoutant sur le port spécifié
