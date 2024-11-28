import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Email unique pour identifier l'utilisateur
  password: { type: String, required: true },
  refreshToken: { type: String }  // Token d'actualisation pour maintenir la session active
})

export default mongoose.model('User', userSchema)
