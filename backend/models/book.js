import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true},
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: false },
  year: { type: Number, required: true },
  genre: { type: String, required: false },
  ratings: [
    {
      userId: { type: String, required: true, unique: true},
      grade: { type: Number, required: true },
    },
  ],
  averageRating: { type: Number, required: false },
});

export default mongoose.model("Book", bookSchema);
