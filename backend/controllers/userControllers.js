import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import User from '../models/user.js'

//////////// Création d'un nouvel utilisateur ////////////////////////
export const signUp = async (req, res) => {
  console.log('### New user signing up')

  const { email, password } = req.body

  // Validation des paramètres de la requête
  if (!email || !password) {
    console.error(' <!> Email or password missing \n')
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: 'Email and password are required' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10) // Hachage du mot de passe utilisateur
    // Création d'une instance de User avec l'identifiant (email) et le mot de passe haché
    const user = new User({
      email: email,
      password: hashedPassword
    })
    await user.save() // Enregistrement du nouvel utilisateur sur la base de donnée
    console.log('   > User created')
    return res.status(httpStatus.CREATED).json({ message: 'New user created' })
  } catch (err) {
    console.error(' <!> Error creating new user: \n')
    console.error(err, '\n')
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err })
  }
}

/////////////// Vérification de l'utilisateur, envoi de l'id et du token  //////////////////
export const signIn = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    console.error(' <!> Email or password missing \n')
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: 'Email and password are required' })
  }

  try {
    const user = await User.findOne({ email: email }) // Identification de l'utilisateur

    console.log(`### User signing in: ${user._id}`)

    if (!user) {
      console.error(' <!> User not found in database \n')
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: 'User does not exist' })
    }
    // Vérification du mot de passe en le comparant à la version hachée sur la DB
    const passwordIsMatching = await bcrypt.compare(password, user.password)
    if (!passwordIsMatching) {
      console.error(' <!> Password not matching user ID \n')
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: 'login/password combination incorrect' })
    } else {
      console.log(`   > User signed-in`)
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
    console.error(' <!> Error signing in: \n')
    console.error(err, '\n')
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err })
  }
}
