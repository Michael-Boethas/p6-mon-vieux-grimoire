import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import User from '../models/User.js'
import BlacklistedToken from '../models/BlacklistedToken.js'
import log from '../utils/logger.js'
import { isValidEmail, isSafePassword } from '../utils/utils.js'

//////////// Création d'un nouvel utilisateur ////////////////////////
export const signUp = async (req, res) => {
  log.info('New user signing up')

  const { email, password } = req.body // Acquisition des identifiants

  // Validation des paramètres de la requête
  if (!email || !password) {
    log.warn('Email or password missing')
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ errorMessage: 'Email and password are required' })
  }

  if (!isValidEmail(email)) {
    log.error('Invalid email address, aborting')
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ errorMessage: 'Email must respect the "local-part@domain.TLD" format' })
  }

  if (!isSafePassword(password)) {
    log.error('Unsafe password, aborting')
    return res.status(httpStatus.BAD_REQUEST).json({
      errorMessage:
        'Password must be at least 8 characters long and contain uppercase letters, lowercase letters, numbers and symbols'
    })
  }

  // Vérification de la disponibilité de l'adresse email
  const userExists = await User.findOne({ email: email })
  if (userExists) {
    log.error(new Error('Email already registered'))
    return res
      .status(httpStatus.CONFLICT)
      .json({ errorMessage: 'Email already in use' })
  }

  try {
    // Hachage du mot de passe utilisateur avec 10 rounds de salage
    const hashedPassword = await bcrypt.hash(password, 10)
    // Création d'une instance de User avec l'identifiant (email) et le mot de passe haché
    const user = new User({
      email: email,
      password: hashedPassword
    })
    await user.save() // Enregistrement du nouvel utilisateur sur la base de donnée
    return res.status(httpStatus.CREATED).json({ message: 'New user created' })
  } catch (err) {
    log.error(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ errorMessage: 'Failed to sign up' })
  }
}

/////////////// Vérification de l'utilisateur, envoi de l'id et du token  //////////////////
export const signIn = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    log.warn('Email or password missing')
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ errorMessage: 'Email and password are required' })
  }

  try {
    // Identification de l'utilisateur
    const user = await User.findOne({ email: email })

    if (!user) {
      log.error(new Error('User not found in database'))
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ errorMessage: 'User does not exist' })
    }

    log.info(`User signing in: ${user._id}`)

    // Vérification du mot de passe en le comparant à la version hachée sur la DB
    const passwordIsMatching = await bcrypt.compare(password, user.password)

    if (!passwordIsMatching) {
      log.error(new Error('Password not matching user ID'))
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ errorMessage: 'login/password combination incorrect' })
    }

    // Token d'accès
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_JWT_SECRET_KEY,
      { expiresIn: '15min' }
    )

    // Token d'actualisation
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_JWT_SECRET_KEY,
      { expiresIn: '24h' }
    )

    // Stockage du refresh token haché
    user.refreshToken = await bcrypt.hash(refreshToken, 10)
    await user.save()

    // Stockage du refresh token dans un cookie "HTTP-only" pour en empêcher l'accès en JS
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Sécurisé par HTTPS en environnement de production
      maxAge: 24 * 60 * 60 * 1000, // 24h
      sameSite: 'Strict' // Protection CSRF
    })

    // Envoi du token d'accès
    return res.status(httpStatus.OK).json({
      token: accessToken,
      userId: user._id
    })
  } catch (err) {
    log.error(err)
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ errorMessage: 'Failed to log in' })
  }
}

/////////////// Déconnexion, révocation du token d'actualisation  /////////////////
export const signOut = async (req, res) => {
  try {
    const userId = req.auth.userId
    const user = await User.findOne({ _id: userId })

    log.info(`User signing out: ${user._id}`)

    // Suppression du refresh token sur la DB
    if (user) {
      user.refreshToken = null
      await user.save()
    }

    // Suppression du cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    })

    // Invalidation du token d'accès jusqu'à expiration
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.decode(token) // extraction du payload sans vérification (déjà effectuée dans authenticate)

    const expiry = new Date(decodedToken.exp * 1000)
    await BlacklistedToken.create({ token, expiresAt: expiry })

    return res
      .status(httpStatus.OK)
      .json({ message: 'Logged out successfully' })
  } catch (err) {
    log.error(err)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ errorMessage: 'Failed to log out' })
  }
}

/////////////// Actualisation du token d'accès et rotation du refresh token ///////////////
export const refreshSession = async (req, res) => {
  const token = req.cookies.refreshToken

  if (!token) {
    log.error(new Error('Refresh token not provided'))
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ errorMessage: 'Refresh token required' })
  }

  log.info('Refreshing session')

  try {
    // Vérification de l'intégrité du refresh token
    const decodedToken = jwt.verify(token, process.env.REFRESH_JWT_SECRET_KEY)
    const user = await User.findOne({ _id: decodedToken.userId })

    if (!user) {
      log.error(new Error('Invalid user for this refresh token'))
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ errorMessage: 'User not found' })
    }

    // Vérification de sa correspondance avec le token haché sur la base de donnée
    const tokenIsValid = await bcrypt.compare(token, user.refreshToken)

    if (!tokenIsValid) {
      log.error(new Error('Refresh token not matching hashed version on DB'))
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ errorMessage: 'Invalid refresh token' })
    }

    // Création du nouveau token d'accès
    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_JWT_SECRET_KEY,
      { expiresIn: '15min' }
    )

    // Création du nouveau refresh token
    const newRefreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_JWT_SECRET_KEY,
      { expiresIn: '24h' }
    )

    // Mise à jour du refresh token haché
    user.refreshToken = await bcrypt.hash(newRefreshToken, 10)
    await user.save()

    // Envoi du nouveau refresh token
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24h
      sameSite: 'Strict'
    })

    // Envoi du nouveau token d'accès
    return res.status(httpStatus.OK).json({
      token: newAccessToken,
      userId: user._id
    })
} catch (err) {
  log.error(err)
  if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
    // Problème de token
    return res.status(httpStatus.UNAUTHORIZED).json({ errorMessage: 'Invalid or expired refresh token' })
  }
  // Autre erreur 
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ errorMessage: 'Failed to refresh session' })
}
}

/////////////// Suppression des données utilisateur ///////////////
export const deleteAccount = async (req, res) => {
  try {
    const { userId } = req.auth
    await User.deleteOne({ _id: userId })

    // Suppression du cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    })

    return res
      .status(httpStatus.OK)
      .json({ message: 'Deleted account successfully' })
  } catch (err) {
    log.error(err)
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ errorMessage: 'Failed to delete account' })
  }
}
