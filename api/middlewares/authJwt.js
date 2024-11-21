const jwt = require('jsonwebtoken');
const config = require('../config/key');

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ message: 'Aucun token fourni.' });

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) return res.status(401).send({ message: 'Non autorisé !' });
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.role === 'Admin') {
        next();
    } else {
        res.status(403).send({ message: 'Accès réservé aux administrateurs.' });
    }
};

const isUser = (req, res, next) => {
    if (req.role === 'User' || req.role === 'Admin') {
        next();
    } else {
        res.status(403).send({ message: 'Accès réservé aux utilisateurs.' });
    }
};

module.exports = { verifyToken, isAdmin, isUser };