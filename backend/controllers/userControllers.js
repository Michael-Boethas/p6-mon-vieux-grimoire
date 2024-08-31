import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import User from '../models/user.js'
import log from '../utils/logger.js'

//////////// Création d'un nouvel utilisateur ////////////////////////
export const signUp = async (req, res) => {
  log.info('New user signing up')

  const { email, password } = req.body // Acquisition des identifiants

  // Validation des paramètres de la requête
  if (!email || !password) {
    log.warn('Email or password missing')
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: 'Email and password are required' })
  }

  // Vérification de la disponibilité de l'adresse email
  const userExists = await User.findOne({ email })
  if (userExists) {
    log.error(new Error('Email already registered'))
    return res
      .status(httpStatus.CONFLICT)
      .json({ error: 'Email already in use' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10) // Hachage du mot de passe utilisateur avec 10 rounds de salage
    // Création d'une instance de User avec l'identifiant (email) et le mot de passe haché
    const user = new User({
      email: email,
      password: hashedPassword
    })
    await user.save() // Enregistrement du nouvel utilisateur sur la base de donnée
    return res.status(httpStatus.CREATED).json({ message: 'New user created' })
  } catch (err) {
    log.error(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err })
  }
}

/////////////// Vérification de l'utilisateur, envoi de l'id et du token  //////////////////
export const signIn = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    log.warn('Email or password missing')
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: 'Email and password are required' })
  }

  try {
    // Identification de l'utilisateur
    const user = await User.findOne({ email: email })

    if (!user) {
      log.error(new Error('User not found in database'))
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: 'User does not exist' })
    }

    log.info(`User signing in: ${user._id}`)

    // Vérification du mot de passe en le comparant à la version hachée sur la DB
    const passwordIsMatching = await bcrypt.compare(password, user.password)
    if (!passwordIsMatching) {
      log.error(new Error('Password not matching user ID'))
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: 'login/password combination incorrect' })
    } else {
      return res.status(httpStatus.OK).json({
        // _id MongoDB
        userId: user._id,
        // Token chiffré avec signature, userId et durée de validité
        token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: '24h'
        })
      })
    }
  } catch (err) {
    log.error(err)
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err })
  }
}
