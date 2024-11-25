const jwt = require('jsonwebtoken');
const config = require('../config/key');

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({ message: 'No token provided' });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        req.userId = decoded.id;
        req.role = decoded.role || 'user';
        next();
    });
};

module.exports = verifyToken;