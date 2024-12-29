import express from 'express'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import { API_ENDPOINTS } from '../config/endpoints.js'
import authenticate from '../middleware/authenticate.js'
import imageUpload from '../middleware/imageUpload.js'
import imageOptimize from '../middleware/imageOptimize.js'
import {
  signUp,
  signIn,
  signOut,
  refreshSession,
  deleteAccount
} from '../controllers/userControllers.js'
import {
  getBooks,
  getBookByID,
  getTopRated,
  postBook,
  rateBook,
  updateBook,
  deleteBook
} from '../controllers/bookControllers.js'

const router = express.Router()

// Endpoint pour réveiller le serveur si inactif 
router.get(API_ENDPOINTS.WAKE_UP, (req, res) => {
  res.status(200).send('API is up');
});

// Mise en place de la documentation Swagger 
const swaggerDoc = YAML.load('./swagger.yaml'); 
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

//////////// User Routes ///////////////////////////////////
router.post(API_ENDPOINTS.SIGN_UP, signUp)
router.post(API_ENDPOINTS.SIGN_IN, signIn)
router.post(API_ENDPOINTS.SIGN_OUT, authenticate, signOut)
router.post(API_ENDPOINTS.REFRESH_SESSION, refreshSession)
router.delete(API_ENDPOINTS.DELETE_ACCOUNT, authenticate, deleteAccount)

//////////// Book Routes ///////////////////////////////////
// (Par ordre de spécificité pour éviter les erreurs de routage)
router.get(API_ENDPOINTS.BOOKS, getBooks)
router.post(
  API_ENDPOINTS.BOOKS,
  authenticate,
  imageUpload,
  imageOptimize,
  postBook
)
router.get(API_ENDPOINTS.BEST_RATED, getTopRated)
router.post(API_ENDPOINTS.RATING, authenticate, rateBook)
router.get(API_ENDPOINTS.BOOK_BY_ID, getBookByID)
router.put(
  API_ENDPOINTS.BOOK_BY_ID,
  authenticate,
  imageUpload,
  imageOptimize,
  updateBook
)
router.delete(API_ENDPOINTS.BOOK_BY_ID, authenticate, deleteBook)

export default router
