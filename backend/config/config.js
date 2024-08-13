export const API_ENDPOINTS = {
  SIGN_UP: `/api/auth/signup`,
  SIGN_IN: `/api/auth/login`,
  BOOKS: `/api/books`,
  BOOK_BY_ID: `/api/books/:id`,
  RATING: `/api/books/:id/rating`,
  BEST_RATED: `/api/books/bestrating`,
};

export const MONGODB_CONNECTION_STRING =
  "mongodb+srv://dummyuser:dUmMyPaSsWoRd@cluster0.db0ou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
