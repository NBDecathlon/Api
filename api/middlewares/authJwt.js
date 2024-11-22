const jwt = require('jsonwebtoken');
const config = require('../config/key');

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ message: 'No token provided' });

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) return res.status(401).send({ message: 'Not Authorized!' });
        req.userId = decoded.id;
        req.role = decoded.role || "user";
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.role !== "admin") return res.status(403).send({ message: 'Refused access' });
    next();
};

module.exports = { verifyToken, isAdmin };