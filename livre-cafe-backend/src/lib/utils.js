const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

const validatePassword = (password, hash, salt) => {
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashedPassword;
}

const genHashAndSalt = (password) => {
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    

    return {
        salt: salt,
        hash: hash
    }
}

const issueJWT = user => {
    const expriresIn = '1d';

    const payload = {
        sub: user._id,
        iat: Date.now()
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
        expiresIn: expriresIn,
        algorithm: 'RS256'
    });

    return {
        token: "Bearer " + signedToken,
        expires: expriresIn
    }
}

module.exports = {
    validatePassword,
    genHashAndSalt,
    issueJWT
}