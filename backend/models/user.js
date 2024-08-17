import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Email unique pour identifier l'utilisateur
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator); // Gestion des conflits d'unicité

export default mongoose.model("User", userSchema);
