const jwt = require("jsonwebtoken");

function auth(requiredRole = null) {

  return (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No autorizado" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ error: "Sin permisos" });
      }

      req.user = decoded;
      next();

    } catch {
      return res.status(401).json({ error: "Token inválido" });
    }
  };
}

module.exports = auth;