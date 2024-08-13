import express from "express";
import { API_ENDPOINTS } from "../config/config.js";
import {
  signUp,
  signIn,
  getBooks,
  getBookByID,
  getTop3,
  postBook,
  rateBook,
  updateBook,
  deleteBook,
} from "../controllers/controllers.js";

const router = express.Router();

//////////// User Routes ///////////////////////////////////
router.post(API_ENDPOINTS.SIGN_UP, signUp);
router.post(API_ENDPOINTS.SIGN_IN, signIn);

//////////// Book Routes ///////////////////////////////////
router.get(API_ENDPOINTS.BOOKS, getBooks);
router.get(API_ENDPOINTS.BOOK_BY_ID, getBookByID);
router.get(API_ENDPOINTS.BEST_RATED, getTop3);
router.post(API_ENDPOINTS.BOOKS, postBook);
router.post(API_ENDPOINTS.RATING, rateBook);
router.put(API_ENDPOINTS.BOOK_BY_ID, updateBook);
router.delete(API_ENDPOINTS.BOOK_BY_ID, deleteBook);

export default router;
