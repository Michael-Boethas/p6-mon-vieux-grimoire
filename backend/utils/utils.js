import fs from 'fs'
import { promisify } from 'util'
import log from './logger.js'

// Promessification de fs.unlink
export const deleteImage = promisify(fs.unlink)

// Contôle de qualité du mot de passe
export const isSafePassword = (password) => {
  // Au moins 8 caractères, minuscules, majuscules, chiffres et symboles
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/`~])[A-Za-z\d!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/`~]{8,}$/
  return regex.test(password)
}

// Normalisation du port
export const normalizePort = (val) => {
  const port = parseInt(val, 10) // Conversion de la valeur en entier
  if (isNaN(port)) return val // Retourne la valeur originale si ce n'est pas un nombre (pour accommoder les pipes)
  if (port >= 0 && port <= 65535) return port // Retourne le port s'il est valide
  return false // Retourne false si le port n'est pas valide
}

// Fonction de gestion des erreurs
export const handleServerError = (server, port, err) => {
  // Propagation des erreurs ne concernant pas l'écoute du serveur
  if (err.syscall !== 'listen') {
    throw err
  }

  const address = server.address() // Récupération de l'adresse du serveur

  // Détermination du type d'adresse (pipe si chaîne, port si objet)
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port

  // Gestion de certains cas spécifiques d'erreurs d'écoute
  switch (err.code) {
    case 'EACCES': // Permission refusée
      log.error(new Error(`${bind} requires elevated privileges`))
      process.exit(1)
      break

    case 'EADDRINUSE': // Port indisponible
      log.error(new Error(`Port ${port} is busy, cannot start the server`))
      process.exit(1)
      break

    default: // Propagation des erreurs d'écoute non traitées
      log.error(err)
      throw err
  }
}
