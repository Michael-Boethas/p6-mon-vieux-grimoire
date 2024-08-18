import express from "express";
import { API_ENDPOINTS } from "../config/endpoints.js";
import authenticate from "../middleware/auth.js";
import { signUp, signIn } from "../controllers/userControllers.js";
import {
  getBooks,
  getBookByID,
  getTop3,
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
router.get(API_ENDPOINTS.BOOK_BY_ID, getBookByID);
router.get(API_ENDPOINTS.BEST_RATED, getTop3);
router.post(API_ENDPOINTS.BOOKS, authenticate, postBook);
router.post(API_ENDPOINTS.RATING, authenticate, rateBook);
router.put(API_ENDPOINTS.BOOK_BY_ID, authenticate, updateBook);
router.delete(API_ENDPOINTS.BOOK_BY_ID, authenticate, deleteBook);

export default router;
