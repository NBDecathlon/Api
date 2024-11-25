const setRateLimit = require("express-rate-limit");

const rateLimitMiddleware = (req, res, next) => {
    const isAdmin = req.role === "Admin"; 

    const limiter = setRateLimit({
        windowMs: 60 * 1000,
        max: isAdmin ? 100 : 10,
        message: "You have exceeded your request limit.",
        headers: true,
    });

    limiter(req, res, next);
};

module.exports = rateLimitMiddleware;