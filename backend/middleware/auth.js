import jwt from "jsonwebtoken";
 
export const authenticate = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];  // Extraction du token depuis le header Authorization
       const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);  // Verification de sa validité avec la clé
       const userId = decodedToken.userId;  // Extraction sécurisée de l'identifiant utilisateur pour administration
       req.auth = {
           userId: userId
       };
	next();
   } catch(err) {
       res.status(401).json({ err });  // 401: Unauthorized
   }
};

export default authenticate;