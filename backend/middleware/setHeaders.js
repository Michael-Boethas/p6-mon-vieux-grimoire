import cors from 'cors'
import helmet from 'helmet'

const corsOptions = {
  origin: `http://${process.env.ALLOWED_ORIGIN_DOMAIN || 'localhost'}:${process.env.ALLOWED_ORIGIN_PORT || 3000}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Accept',
    'Content-Type',
    'Authorization'
  ]
}

const setHeaders = [cors(corsOptions), helmet()]

export default setHeaders
