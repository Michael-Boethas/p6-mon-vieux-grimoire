import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import log from '../utils/logger.js'

const authenticate = (req, res, next) => {
  log.info('Authentication')
  try {
    const token = req.headers.authorization.split(' ')[1] // Extraction du token depuis le header Authorization
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY) // Vérification de sa validité avec la clé
    const userId = verifiedToken.userId // Extraction sécurisée de l'identifiant utilisateur pour administration
    // Ajout de l'identifiant utilisateur à la requête
    req.auth = {
      userId: userId
    }
    next()
  } catch (err) {
    log.error(err)
    return res.status(httpStatus.UNAUTHORIZED).json({ err })
  }
}

export default authenticate
