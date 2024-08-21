import express from "express";
import { API_ENDPOINTS } from "../config/endpoints.js";
import authenticate from "../middleware/authenticate.js";
import imageUpload from "../middleware/imageUpload.js";
import { signUp, signIn } from "../controllers/userControllers.js";
import {
  getBooks,
  getBookByID,
  getBestRated,
  postBook,
  rateBook,
  updateBook,
  deleteBook,
} from "../controllers/bookControllers.js";

const router = express.Router();

//////////// User Routes ///////////////////////////////////
router.post(API_ENDPOINTS.SIGN_UP, signUp);
router.post(API_ENDPOINTS.SIGN_IN, signIn);

//////////// Book Routes ///////////////////////////////////
router.get(API_ENDPOINTS.BOOKS, getBooks);
router.post(API_ENDPOINTS.BOOKS, authenticate, imageUpload, postBook);
router.get(API_ENDPOINTS.BEST_RATED, getBestRated);  // Avant la route paramétrée :id pour éviter les problèmes de routage
router.get(API_ENDPOINTS.BOOK_BY_ID, getBookByID);  
router.put(API_ENDPOINTS.BOOK_BY_ID, authenticate, updateBook);
router.delete(API_ENDPOINTS.BOOK_BY_ID, authenticate, deleteBook);
router.post(API_ENDPOINTS.RATING, authenticate, rateBook);


export default router;
