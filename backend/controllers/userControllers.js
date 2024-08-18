import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";


export const signUp = (req, res, next) => {
    bcrypt
      .hash(req.body.password, 10) // Hachage du mot de passe utilisateur
      .then((hash) => {
        const user = new User({  // Création d'une instance de User avec l'identifiant (email) et le mot de passe (haché)
          email: req.body.email,
          password: hash,
        });
        user
          .save()  // Enregistrement du nouvel utilisateur sur MongoDB
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))  // 201: Created
          .catch((err) => res.status(400).json({ err }));  // 400: Bad request
      })
      .catch((err) => res.status(500).json({ err }));   // 500: Internal server error
  };
  
export const signIn = (req, res, next) => {
  User.findOne({ email: req.body.email })    // Identification de l'utilisateur
    .then((user) => {
      if (!user) {  // Erreur si l'identifiant utilisateur n'éxiste pas 
        return res
          .status(401)  // 401: Unauthorized
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      bcrypt
        .compare(req.body.password, user.password)  // Vérification du mot de passe en le comparant à la version hachée sur la DB 
        .then((valid) => {
          if (!valid) {  // Erreur si le mot de passe est incorrect
            return res
              .status(401)  // 401: Unauthorized
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          res
            .status(200) // 200: OK
            .json({
              // _id MongoDB
              userId: user._id,
              // Token chiffré avec signature, userId et date de validité
              token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {expiresIn: "24h"})  
            });
        })
        .catch((err) => res.status(500).json({ err }));
    })
    .catch((err) => res.status(500).json({ err }));
};