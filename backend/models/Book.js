import mongoose from 'mongoose'

const ratingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  grade: { type: Number, required: true }
})

const bookSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: { type: [ratingSchema], default: [], required: true },
  averageRating: { type: Number, default: 0 }
}, { collection: 'books' })

export default mongoose.model('Book', bookSchema)
