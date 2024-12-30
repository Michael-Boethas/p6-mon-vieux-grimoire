import cors from 'cors'
import helmet from 'helmet'

// Headers cross-origin avec cors et sécurité générale avec helmet

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Accept',
    'Content-Type',
    'Authorization',
  ],
};

const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      imgSrc: ["'self'", 'https://run.pstmn.io'], // Autorisation pour le bouton "Run in Postman"
      scriptSrc: ["'self'", 'https://run.pstmn.io'] // Autorisation pour le bouton "Run in Postman"
    }
  }
};

const setHeaders = [cors(corsOptions), helmet(helmetOptions)]

export default setHeaders
