import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'

const authenticate = (req, res, next) => {
  console.log('### Authentication')
  try {
    const token = req.headers.authorization.split(' ')[1] // Extraction du token depuis le header Authorization
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY) // Verification de sa validité avec la clé
    const userId = decodedToken.userId // Extraction sécurisée de l'identifiant utilisateur pour administration
    // Ajout de l'identifiant utilisateur à la requête
    req.auth = {
      userId: userId
    }
    console.log('  -> Access granted')
    next()
  } catch (err) {
    console.error(' <!> Authentication error: \n')
    console.error(err, '\n')
    return res.status(httpStatus.UNAUTHORIZED).json({ err })
  }
}

export default authenticate
