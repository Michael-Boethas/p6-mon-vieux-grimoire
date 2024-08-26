import rateLimit from 'express-rate-limit'

const setRequestLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // 100 requêtes max par fenêtre de 15 min
    message: 'Too many requests from this IP, please try again later',
  });

export default setRequestLimit