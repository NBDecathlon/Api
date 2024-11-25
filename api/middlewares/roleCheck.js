const isAdmin = (req, res, next) => {
    if (req.role !== 'Admin') {
        return res.status(403).send({ message: 'Admin access required' });
    }
    next();
};

module.exports = { isAdmin };