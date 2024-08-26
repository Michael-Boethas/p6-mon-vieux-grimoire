import http from 'http'
import app from './app.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

// Fonction de normalisation du port
const normalizePort = (val) => {
  const port = parseInt(val, 10) // Conversion de la valeur en entier
  if (isNaN(port)) return val // Retourne la valeur originale si ce n'est pas un nombre (pour accommoder les pipes)
  if (port >= 0 && port <= 65535) return port // Retourne le port s'il est valide
  return false // Retourne false si le port n'est pas valide
}

// Fonction de gestion des erreurs
const errorHandler = (err) => {
  // Propagation des erreurs ne concernant pas l'écoute du serveur
  if (err.syscall !== 'listen') {
    throw err
  }

  const address = server.address() // Récupération de l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port // Détermination du type d'adresse (pipe si chaîne, port si objet)

  // Gestion de certains cas spécifiques d'erreurs d'écoute
  switch (err.code) {
    case 'EACCES': // Permission refusée
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break

    case 'EADDRINUSE': // Port indisponible
      console.error(`Port ${port} is busy, cannot start the server`)
      process.exit(1)
      break

    default: // Propagation des erreurs d'écoute non traitées
      console.error('Unexpected error: ', err)
      throw err
  }
}

// Acquisition des variables d'environnement depuis .env
dotenv.config()

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log('  * Connected to MongoDB'))
  .catch((err) => {
    console.error('Connection to MongoDB failed: ', err)
    process.exit(1)
  })

// Attribution du port
const port = normalizePort(process.env.PORT || '4000') // PORT en variable d'environnement ou 4000 par défaut
app.set('port', port)

// Création et démarrage du serveur HTTP
const server = http.createServer(app)
server.on('error', errorHandler) // Gestion des événements d'erreur du serveur
server.on('listening', () => {
  const address = server.address() // Récupération de l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : `port ${port}` // Détermination du type d'adresse (pipe si chaîne, port si objet)
  console.log(`  * Listening on ${bind}`)
})
server.listen(port) // Démarrage du serveur en écoutant sur le port spécifié
