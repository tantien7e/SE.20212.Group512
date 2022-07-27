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
    const expriresIn = "2h";

    const payload = {
        sub: user._id
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

const genDate = () => {
    const weekDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date();
    return `${weekDay[date.getDay()]}, ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

const genVerificationCode = () => {
    let min = 100000;
    let max = 999999;

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const checkTimeConflict = (start1, end1, start2, end2) => {
    if (start2 > start1 && start2 < end1) {
        return true;
    }

    if (end2 > start1 && end2 < end1) {
        return true;
    }

    return false;
}

const hoursToMilliseconds = hours => {
    return hours * 3600000;
}

const checkEqualDays = (day1, day2) => {
    if(!day1 || !day2) return false;
    return (day1.getDate() === day2.getDate()) && (day1.getMonth() === day2.getMonth()) && (day1.getFullYear() === day2.getFullYear());
}

module.exports = {
    validatePassword,
    genHashAndSalt,
    issueJWT,
    genDate,
    genVerificationCode,
    checkTimeConflict,
    hoursToMilliseconds,
    checkEqualDays
}