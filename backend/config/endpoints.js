export const API_ENDPOINTS = {
  
  // Users
  SIGN_UP: '/api/auth/signup',
  SIGN_IN: '/api/auth/login',
  SIGN_OUT: '/api/auth/logout',
  DELETE_ACCOUNT: '/api/auth/delete-account',
  REFRESH_SESSION: '/api/auth/refresh-session',

  // Books
  BOOKS: '/api/books',
  BEST_RATED: '/api/books/bestrating',
  RATING: '/api/books/:id/rating',
  BOOK_BY_ID: '/api/books/:id',

  // Misc
  API_DOC: '/api-docs', // Swagger doc
  WAKE_UP: '/wake-up' // Route pour réveiller le serveur si inactif  
}
