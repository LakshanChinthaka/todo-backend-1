const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = function (req, res, next) {
    // extract token from header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Split token

    if (!token) {
        return res.status(401).json({ msg: 'Token is missing, authorization denied' });
    }

    // Verify jwt token
    try {
        const decodedJwtToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decodedJwtToken.user;
        next();

    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
