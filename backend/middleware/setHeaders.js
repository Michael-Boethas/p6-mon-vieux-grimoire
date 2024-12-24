import cors from 'cors'
import helmet from 'helmet'

// Headers cross-origin avec cors et sécurité générale avec helmet

const corsOptions = {
  origin: [
    `http://${process.env.ALLOWED_ORIGIN_DOMAIN || 'localhost'}:${process.env.ALLOWED_ORIGIN_PORT || 3000}`,
    'https://run.pstmn.io' // Autorisation pour le bouton "Run in Postman"
  ],  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Accept',
    'Content-Type',
    'Authorization'
  ]
}

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
