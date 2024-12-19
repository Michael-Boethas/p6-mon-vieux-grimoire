import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import BlacklistedToken from '../models/BlacklistedToken.js'
import log from '../utils/logger.js'

const authenticate = async (req, res, next) => {
  log.info('Authentication')
  try {
    const token = req.headers.authorization.split(' ')[1] // Extraction du token depuis le header Authorization

    if (!token) {
      log.error('Missing or invalid authorization header')
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: 'Authorization token is required' })
    }

    // Vérification des tokens révoqués
    const blacklisted = await BlacklistedToken.findOne({ token })

    if (blacklisted) {
      log.error('Token has been blacklisted')
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: 'Invalid token' })
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_JWT_SECRET_KEY) // Vérification de sa validité avec la clé
    const userId = decodedToken.userId // Extraction sécurisée de l'identifiant utilisateur pour administration
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
