// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

function validateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  // Garante que o formato é "Bearer TOKEN"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  jwt.verify(token, SECRET_KEY, (err, decode) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }

    // Injeta os dados do usuário na requisição
    req.user = decode;
    next();
  });
}

module.exports = { 
  validateJWT 
};