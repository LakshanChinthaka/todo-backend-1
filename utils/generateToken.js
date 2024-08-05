const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (payload, res, msg,uid) => {
    jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '24h', algorithm: 'HS256' },
        (err, token) => {
            if (err) {
                throw err;
            }
            res.status(200).send({
                accessToken: token,
                msg: msg,
                uid: uid
            });
        }
    );
};

module.exports = generateToken;
