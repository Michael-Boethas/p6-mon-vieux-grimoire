const allowedOrigin = `http://${process.env.ALLOWED_ORIGIN_DOMAIN || "localhost"}:${process.env.ALLOWED_ORIGIN_PORT || 3000}`;

const setHeaders = ((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
  });
  
export default setHeaders;