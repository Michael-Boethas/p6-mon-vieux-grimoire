import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Email unique pour identifier l'utilisateur
  password: { type: String, required: true }
})

export default mongoose.model('User', userSchema)
